---
name: low-level-driver-design
description: Guides the design of embedded peripheral drivers including MMIO register abstraction, ISR design, DMA configuration, and portable HAL patterns for microcontrollers.
---

# Low-Level Driver Design

This skill helps you design, review, and refactor low-level peripheral drivers for embedded microcontrollers, covering register-level hardware abstraction, interrupt service routines, DMA, and portable driver APIs.

## When to Use This Skill

Use this skill when you need to:

- Design a new peripheral driver (UART, SPI, I2C, CAN, ADC, PWM, GPIO, timers)
- Implement MMIO register access with correct volatile semantics
- Design ISR-safe data exchange between interrupt context and task context
- Configure and use DMA for peripheral transfers
- Evaluate HAL vs. bare-metal trade-offs for your platform
- Create a portable driver API that can target multiple MCU families
- Review existing driver code for correctness, portability, or performance issues

## Core Concepts

### MMIO Register Access

Always use `volatile` for memory-mapped peripheral registers to prevent the compiler from optimizing away hardware accesses.

**Recommended pattern — struct-based register map:**

```c
/* Peripheral register map — place at known hardware address */
typedef struct {
    volatile uint32_t CR1;    /* Control register 1      offset 0x00 */
    volatile uint32_t CR2;    /* Control register 2      offset 0x04 */
    volatile uint32_t SR;     /* Status register         offset 0x08 */
    volatile uint32_t DR;     /* Data register           offset 0x0C */
    volatile uint32_t BRR;    /* Baud rate register      offset 0x10 */
    uint32_t          RESERVED[3]; /* Unused              offset 0x14 */
    volatile uint32_t CR3;    /* Control register 3      offset 0x20 */
} USART_Regs_t;

#define USART1  ((USART_Regs_t *) 0x40013800UL)
#define USART2  ((USART_Regs_t *) 0x40004400UL)
```

**Key rules:**
- Every register accessed by hardware must be `volatile`
- Use `uint32_t` / `uint16_t` / `uint8_t` for register widths — never `int`
- Use bit-field structs only if the compiler guarantees packing and ordering (generally unsafe across toolchains — prefer bitmask macros)
- Reserve padding bytes for unused register offsets to maintain correct addressing

**Bitmask macros (preferred over bit fields for portability):**

```c
/* USART CR1 bit definitions */
#define USART_CR1_UE    (1UL << 13)   /* USART Enable */
#define USART_CR1_RE    (1UL << 2)    /* Receiver Enable */
#define USART_CR1_TE    (1UL << 3)    /* Transmitter Enable */
#define USART_CR1_RXNEIE (1UL << 5)  /* RX Not Empty Interrupt Enable */

/* Usage */
USART1->CR1 |= USART_CR1_UE | USART_CR1_TE | USART_CR1_RE;
```

### ISR Design Principles

**Data exchange between ISR and task context:**

The canonical pattern is a ring buffer (circular queue) or a double-buffer protected by atomic flags. Never use mutexes in ISR context.

```c
/* Ring buffer for UART RX — ISR writes, task reads */
#define RX_BUF_SIZE  64U   /* Must be power of 2 for fast modulo */
#define RX_BUF_MASK  (RX_BUF_SIZE - 1U)

typedef struct {
    uint8_t  buf[RX_BUF_SIZE];
    volatile uint16_t head;  /* Written by ISR */
    volatile uint16_t tail;  /* Written by consumer task */
} RingBuf_t;

/* ISR — runs at interrupt priority */
void USART1_IRQHandler(void)
{
    if (USART1->SR & USART_SR_RXNE)
    {
        uint16_t next = (rxBuf.head + 1U) & RX_BUF_MASK;
        if (next != rxBuf.tail)              /* buffer not full */
        {
            rxBuf.buf[rxBuf.head] = (uint8_t)USART1->DR;
            rxBuf.head = next;
        }
        /* If full: drop byte (or set overflow flag) */
    }
}

/* Task context — never called from ISR */
bool UART_Read(uint8_t *out)
{
    if (rxBuf.tail == rxBuf.head) return false;   /* empty */
    *out = rxBuf.buf[rxBuf.tail];
    rxBuf.tail = (rxBuf.tail + 1U) & RX_BUF_MASK;
    return true;
}
```

**Critical section patterns:**

```c
/* Cortex-M — disable/enable interrupts */
__disable_irq();
/* --- critical section --- */
__enable_irq();

/* FreeRTOS — task-context critical section */
taskENTER_CRITICAL();
/* --- critical section --- */
taskEXIT_CRITICAL();

/* FreeRTOS — ISR-context critical section */
UBaseType_t uxSaved = taskENTER_CRITICAL_FROM_ISR();
/* --- critical section --- */
taskEXIT_CRITICAL_FROM_ISR(uxSaved);
```

**ISR execution rules:**
- Keep ISRs short: set a flag or write to a ring buffer, defer processing to a task
- Never call blocking functions (`malloc`, `printf`, OS pend calls) from ISR
- Re-entrant ISRs require careful design — prefer tail-chaining or priority grouping
- Clear the interrupt pending bit *before* re-enabling interrupts to prevent spurious re-entry

### DMA Configuration

DMA eliminates CPU involvement in bulk data transfers. Key design decisions:

1. **Transfer type**: memory-to-peripheral (TX), peripheral-to-memory (RX), memory-to-memory
2. **Data width**: byte, half-word, word — must match peripheral FIFO width
3. **Circular vs. normal mode**: circular for continuous streaming (audio, ADC); normal for one-shot transfers
4. **Double-buffering**: swap buffers on half-transfer and transfer-complete interrupts for zero-copy streaming

```c
/* DMA completion callback pattern */
void DMA1_Stream5_IRQHandler(void)
{
    if (DMA1->HISR & DMA_HISR_TCIF5)   /* Transfer Complete */
    {
        DMA1->HIFCR = DMA_HIFCR_CTCIF5; /* Clear flag */
        uart_dma_tx_complete_callback();
    }
    if (DMA1->HISR & DMA_HISR_TEIF5)   /* Transfer Error */
    {
        DMA1->HIFCR = DMA_HIFCR_CTEIF5;
        uart_dma_error_callback();
    }
}
```

**DMA safety checklist:**
- Cache coherency: flush D-cache before DMA TX, invalidate before DMA RX (Cortex-M7 with cache)
- Buffer alignment: many DMA controllers require word-aligned buffers
- Do not access a DMA-owned buffer from CPU while transfer is in progress

### Portable Driver API Design

A portable driver exposes a hardware-independent API and isolates MCU-specific code behind an implementation file.

**Header (portable API):**

```c
/* uart_driver.h — platform-independent interface */
#ifndef UART_DRIVER_H
#define UART_DRIVER_H

#include <stdint.h>
#include <stdbool.h>

typedef enum {
    UART_OK = 0,
    UART_ERR_BUSY,
    UART_ERR_TIMEOUT,
    UART_ERR_OVERFLOW,
    UART_ERR_FRAMING
} UartStatus_t;

typedef struct {
    uint32_t baudRate;
    uint8_t  dataBits;   /* 7 or 8 */
    uint8_t  stopBits;   /* 1 or 2 */
    bool     parityEnable;
    bool     parityOdd;
} UartConfig_t;

UartStatus_t UART_Init(uint8_t channel, const UartConfig_t *config);
UartStatus_t UART_Transmit(uint8_t channel, const uint8_t *data, uint16_t len, uint32_t timeoutMs);
UartStatus_t UART_Receive(uint8_t channel, uint8_t *data, uint16_t len, uint32_t timeoutMs);
void         UART_DeInit(uint8_t channel);

#endif /* UART_DRIVER_H */
```

## HAL vs. Bare-Metal Trade-offs

| Aspect | Bare-Metal (register-level) | Vendor HAL (e.g., STM32 HAL) |
|--------|-----------------------------|-------------------------------|
| Performance | Optimal — no overhead | Moderate overhead from abstraction |
| Portability | Low — MCU-specific | Medium — vendor-family portable |
| Maintenance | High effort | Vendor-maintained |
| Debugging | Full visibility | Abstraction hides register state |
| Safety | Full control over behavior | HAL may have undocumented behavior |
| MISRA compliance | Achievable with discipline | HAL code rarely MISRA-compliant |

**Recommendation for safety-critical systems:** Use bare-metal or a thin, MISRA-compliant abstraction layer. Validate all register accesses against the reference manual. Avoid vendor HALs in ASIL-B/C/D code paths unless the HAL has been certified or qualified.

## Prompt Examples

- "Design a SPI driver for STM32F4 using DMA for both TX and RX, with circular buffer for continuous sensor streaming."
- "Review this UART ISR for thread safety and correct volatile usage."
- "I need to mock the GPIO peripheral registers in a unit test — how do I redirect the MMIO pointer to a fake register map?"
- "What's the correct way to handle cache coherency for DMA transfers on Cortex-M7?"
- "Create a portable I2C driver API that works for both STM32 and NXP S32K targets."
