---
name: ceedling-unit-test
description: 'Comprehensive C unit testing with Ceedling, Unity, and CMock: project setup, testing single files and modules, hardware peripheral register mocking, coverage reporting, and CI integration.'
---

# Ceedling Unit Testing

This skill guides you through unit testing embedded C code with **Ceedling** (ThrowTheSwitch), **Unity** (test framework), and **CMock** (auto-mocking). It covers everything from project setup to mocking hardware peripheral registers and integrating with CI pipelines.

## When to Use This Skill

Use this skill when you need to:

- Set up a Ceedling project for unit testing an embedded C codebase
- Write unit tests for a single C file or a complete module
- Mock hardware peripheral registers (MMIO) to test driver code on the host
- Auto-generate mocks from C header files using CMock
- Run tests with code coverage and interpret gcov/gcovr reports
- Integrate Ceedling tests into a CI pipeline (GitHub Actions, Jenkins, GitLab CI)
- Troubleshoot Ceedling configuration (`project.yml`) or test failures

## Ceedling Overview

Ceedling is a build and test runner for C projects that orchestrates:

- **Unity** — lightweight C unit test framework (assertions, test runner generation)
- **CMock** — generates mock implementations from C header files
- **Ceedling** — build system that ties everything together with a `project.yml` config

All three are part of the [ThrowTheSwitch](https://github.com/ThrowTheSwitch/Ceedling) ecosystem.

## Project Setup

### Installation

```bash
# Install Ruby (required by Ceedling)
# macOS: brew install ruby
# Ubuntu: sudo apt install ruby

# Install Ceedling gem
gem install ceedling

# Verify installation
ceedling version
```

### Create a New Project

```bash
ceedling new my_project
cd my_project
```

This generates:

```
my_project/
├── project.yml          # Main configuration file
├── src/                 # Production source files
├── test/                # Test files (test_*.c)
├── vendor/              # Unity, CMock, CException sources
└── build/               # Generated build artifacts
```

### Integrate into an Existing Project

If your source code is not in `src/`, update `project.yml`:

```yaml
:paths:
  :source:
    - src/**           # Production C files
    - hal/**           # HAL sources to include
  :test:
    - test/**          # Test files
  :include:
    - inc/**           # Headers
    - hal/inc/**
    - vendor/unity/src
    - vendor/cmock/src
```

### Essential `project.yml` Configuration

```yaml
---
:project:
  :use_exceptions: FALSE
  :use_test_preprocessor: TRUE    # Enable for macro-heavy embedded code
  :use_auxiliary_dependencies: TRUE
  :build_root: build
  :test_file_prefix: test_

:plugins:
  :load_paths:
    - vendor/ceedling/plugins
  :enabled:
    - stdout_pretty_tests_report
    - module_generator
    - gcov                         # Code coverage

:gcov:
  :reports:
    - HtmlDetailed
    - Text
  :gcovr:
    :html_medium_threshold: 75
    :html_high_threshold: 90

:cmock:
  :mock_prefix: mock_
  :when_no_prototypes: :warn
  :enforce_strict_ordering: TRUE
  :plugins:
    - :ignore
    - :callback
    - :return_thru_ptr
  :treat_as:
    uint8_t: HEX8
    uint16_t: HEX16
    uint32_t: HEX32

:tools:
  :test_compiler:
    :executable: gcc
    :arguments:
      - -std=c11
      - -Wall
      - -Wextra
      - -DUNIT_TEST              # Guard for test-only code paths
      - -DTARGET_HOST            # Distinguish host build from target build

:defines:
  :common: &common_defines
    - UNIT_TEST
    - TARGET_HOST
  :test:
    - *common_defines
```

## Testing a Single C File

### Source file: `src/temperature_sensor.c`

```c
#include "temperature_sensor.h"
#include "adc_driver.h"   /* dependency to mock */

#define ADC_VREF_MV     3300U
#define ADC_RESOLUTION  4096U
#define TEMP_OFFSET_MV  500U
#define TEMP_GAIN       10U   /* 10 mV per degree C */

float TemperatureSensor_Read(void)
{
    uint16_t raw = ADC_Read(ADC_CHANNEL_TEMP);
    uint32_t voltage_mv = ((uint32_t)raw * ADC_VREF_MV) / ADC_RESOLUTION;
    return (float)(voltage_mv - TEMP_OFFSET_MV) / TEMP_GAIN;
}
```

### Test file: `test/test_temperature_sensor.c`

```c
#include "unity.h"
#include "mock_adc_driver.h"   /* CMock auto-generated from adc_driver.h */
#include "temperature_sensor.h"

void setUp(void)    { }   /* Called before each test */
void tearDown(void) { }   /* Called after each test */

/* Test: nominal reading at 25 degC
 * Expected: ADC returns 1706 (0.5V offset + 25*10mV = 750mV → raw = 750*4096/3300 ≈ 931)
 * Let's use a round number for clarity
 */
void test_TemperatureSensor_Read_25degC(void)
{
    /* ADC raw value for 750 mV: raw = 750 * 4096 / 3300 = 931 */
    ADC_Read_ExpectAndReturn(ADC_CHANNEL_TEMP, 931U);

    float result = TemperatureSensor_Read();

    /* Allow ±0.5 degC tolerance for integer rounding */
    TEST_ASSERT_FLOAT_WITHIN(0.5f, 25.0f, result);
}

void test_TemperatureSensor_Read_ZeroDegC(void)
{
    /* 0 degC → voltage = 500 mV → raw = 500 * 4096 / 3300 = 620 */
    ADC_Read_ExpectAndReturn(ADC_CHANNEL_TEMP, 620U);

    float result = TemperatureSensor_Read();

    TEST_ASSERT_FLOAT_WITHIN(0.5f, 0.0f, result);
}

void test_TemperatureSensor_Read_NegativeTemp(void)
{
    /* -10 degC → voltage = 400 mV → raw = 400 * 4096 / 3300 = 496 */
    ADC_Read_ExpectAndReturn(ADC_CHANNEL_TEMP, 496U);

    float result = TemperatureSensor_Read();

    TEST_ASSERT_FLOAT_WITHIN(0.5f, -10.0f, result);
}
```

### Run the test

```bash
ceedling test:path[test/test_temperature_sensor.c]
```

## Testing a Complete Module (Multiple C Files)

For a module with multiple implementation files (e.g., `uart.c`, `uart_ring_buffer.c`, `uart_dma.c`):

### Directory structure

```
src/
  uart/
    uart.c
    uart_ring_buffer.c
    uart_dma.c
inc/
  uart/
    uart.h
    uart_ring_buffer.h
    uart_dma.h
test/
  test_uart_ring_buffer.c
  test_uart_dma.c
  test_uart_integration.c
```

### `project.yml` paths

```yaml
:paths:
  :source:
    - src/uart/**
  :include:
    - inc/uart/**
  :test:
    - test/**
```

### Run all tests in the module

```bash
ceedling test:all
```

### Module generator (scaffold boilerplate)

```bash
ceedling module:create[uart_ring_buffer]
# Creates: src/uart_ring_buffer.c, inc/uart_ring_buffer.h, test/test_uart_ring_buffer.c
```

## Hardware Peripheral Register Mocking

This is the most critical technique for testing embedded driver code on the host without real hardware.

### Strategy: Redirect MMIO pointer to a fake register map

Instead of accessing hardware registers directly via a fixed address, the driver uses a pointer that can be redirected in tests.

**Production header: `inc/usart_regs.h`**

```c
#ifndef USART_REGS_H
#define USART_REGS_H

#include <stdint.h>

typedef struct {
    volatile uint32_t CR1;
    volatile uint32_t CR2;
    volatile uint32_t SR;
    volatile uint32_t DR;
    volatile uint32_t BRR;
} USART_Regs_t;

/* In production: points to real hardware address */
/* In test: redirected to fake_usart defined in test file */
extern USART_Regs_t *USART1;

#endif
```

**Production source: `src/usart_driver.c`**

```c
#include "usart_driver.h"
#include "usart_regs.h"

/* In production builds, USART1 is initialized to the hardware address */
#ifndef UNIT_TEST
USART_Regs_t *USART1 = (USART_Regs_t *)0x40013800UL;
#endif

void USART_Enable(void)
{
    USART1->CR1 |= (1UL << 13);  /* UE bit */
}

uint8_t USART_ReadByte(void)
{
    while (!(USART1->SR & (1UL << 5))) { }  /* Wait for RXNE */
    return (uint8_t)(USART1->DR & 0xFFU);
}
```

**Test file: `test/test_usart_driver.c`**

```c
#include "unity.h"
#include "usart_driver.h"
#include "usart_regs.h"

/* Fake register map — lives in host RAM during test */
static USART_Regs_t fake_usart;

/* Override the USART1 pointer to point to our fake registers */
USART_Regs_t *USART1 = &fake_usart;

void setUp(void)
{
    /* Reset all fake registers before each test */
    fake_usart.CR1 = 0U;
    fake_usart.CR2 = 0U;
    fake_usart.SR  = 0U;
    fake_usart.DR  = 0U;
    fake_usart.BRR = 0U;
}

void tearDown(void) { }

void test_USART_Enable_SetsBit13InCR1(void)
{
    USART_Enable();

    TEST_ASSERT_BITS_HIGH(1UL << 13U, fake_usart.CR1);
}

void test_USART_ReadByte_ReturnsDataRegisterValue(void)
{
    /* Pre-set RXNE flag and data register */
    fake_usart.SR = (1UL << 5U);   /* RXNE set */
    fake_usart.DR = 0xA5U;

    uint8_t result = USART_ReadByte();

    TEST_ASSERT_EQUAL_HEX8(0xA5U, result);
}
```

### Strategy: Compile-time HAL function replacement

For code that calls HAL functions (e.g., `HAL_GPIO_WritePin`), create a test double header:

```c
/* test/support/hal_gpio_fake.h — included instead of real HAL in UNIT_TEST builds */
#ifndef HAL_GPIO_FAKE_H
#define HAL_GPIO_FAKE_H

#include <stdint.h>

typedef uint32_t GPIO_TypeDef;
typedef uint16_t uint16_t;
typedef enum { GPIO_PIN_RESET = 0, GPIO_PIN_SET } GPIO_PinState;

/* Track calls for assertion in tests */
extern GPIO_TypeDef *last_gpio_port;
extern uint16_t      last_gpio_pin;
extern GPIO_PinState last_gpio_state;

static inline void HAL_GPIO_WritePin(GPIO_TypeDef *GPIOx, uint16_t GPIO_Pin, GPIO_PinState state)
{
    last_gpio_port  = GPIOx;
    last_gpio_pin   = GPIO_Pin;
    last_gpio_state = state;
}

#endif
```

## CMock Auto-Generated Mocks

CMock generates mock implementations from header files automatically.

**Given `inc/adc_driver.h`:**

```c
uint16_t ADC_Read(uint8_t channel);
void     ADC_Init(uint8_t channel, uint8_t resolution);
```

**Ceedling auto-generates `build/test/mocks/mock_adc_driver.h` and `.c`** containing:

```c
/* Expect calls and set return values */
void ADC_Read_ExpectAndReturn(uint8_t channel, uint16_t toReturn);
void ADC_Init_Expect(uint8_t channel, uint8_t resolution);

/* Ignore calls (don't verify) */
void ADC_Read_IgnoreAndReturn(uint16_t toReturn);

/* Callback for complex behavior */
void ADC_Read_StubWithCallback(CMOCK_ADC_Read_CALLBACK callback);
```

To use a mock in a test file:

```c
#include "mock_adc_driver.h"

void test_something(void)
{
    ADC_Init_Expect(0U, 12U);                      /* Expect exact call */
    ADC_Read_ExpectAndReturn(0U, 2048U);           /* Expect and return value */

    my_function_under_test();

    /* CMock automatically verifies all expectations at test end */
}
```

## ISR Testing

ISRs cannot be called directly in most test setups, but the logic they invoke can be tested by:

1. Extracting ISR logic into a helper function: `static void UART_HandleRxByte(uint8_t byte)`
2. Testing the helper function directly from the test file
3. Using the fake register map to verify the ISR reads the correct register

```c
/* src/uart_isr.c */
static RingBuf_t rxBuf;

static void UART_ProcessRxByte(void)
{
    if (USART1->SR & RXNE_FLAG)
    {
        uint8_t byte = (uint8_t)(USART1->DR & 0xFFU);
        RingBuf_Push(&rxBuf, byte);
    }
}

void USART1_IRQHandler(void) { UART_ProcessRxByte(); }

/* test/test_uart_isr.c */
void test_UART_ProcessRxByte_PushesToRingBuffer(void)
{
    fake_usart.SR = RXNE_FLAG;
    fake_usart.DR = 0x42U;

    UART_ProcessRxByte();   /* Call internal function directly */

    uint8_t out;
    TEST_ASSERT_TRUE(RingBuf_Pop(&rxBuf, &out));
    TEST_ASSERT_EQUAL_HEX8(0x42U, out);
}
```

## Code Coverage

### Enable gcov in `project.yml`

```yaml
:plugins:
  :enabled:
    - gcov

:gcov:
  :reports:
    - HtmlDetailed
    - Text
    - Cobertura      # For CI systems (Jenkins, GitLab)
  :gcovr:
    :branches: TRUE
    :exclude:
      - vendor/**
      - test/**
```

### Run with coverage

```bash
ceedling gcov:all              # Run tests with coverage instrumentation
ceedling utils:gcov            # Generate HTML report
open build/artifacts/gcov/index.html
```

### Coverage targets by ASIL (ISO 26262 Part 6):

| ASIL | Required coverage |
|------|------------------|
| A | Statement coverage (SC) |
| B | Branch coverage (BC) |
| C | Branch coverage (BC) recommended, MC/DC considered |
| D | MC/DC (Modified Condition/Decision Coverage) |

## CI Integration

### GitHub Actions example

```yaml
name: Unit Tests

on: [push, pull_request]

jobs:
  unit-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Ruby and Ceedling
        run: |
          sudo apt-get install -y ruby
          gem install ceedling

      - name: Run unit tests
        run: ceedling test:all

      - name: Generate coverage report
        run: |
          ceedling gcov:all
          ceedling utils:gcov

      - name: Upload coverage report
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: build/artifacts/gcov/
```

### Makefile integration

```makefile
.PHONY: test test-coverage

test:
	ceedling test:all

test-coverage:
	ceedling gcov:all && ceedling utils:gcov

test-module:
	ceedling test:path[test/$(MODULE)]
```

## Unity Assertion Reference

```c
/* Basic assertions */
TEST_ASSERT_TRUE(condition)
TEST_ASSERT_FALSE(condition)
TEST_ASSERT_NULL(pointer)
TEST_ASSERT_NOT_NULL(pointer)

/* Integer equality */
TEST_ASSERT_EQUAL_INT(expected, actual)
TEST_ASSERT_EQUAL_UINT8(expected, actual)
TEST_ASSERT_EQUAL_UINT16(expected, actual)
TEST_ASSERT_EQUAL_UINT32(expected, actual)
TEST_ASSERT_EQUAL_HEX8(expected, actual)   /* prints as 0xXX */
TEST_ASSERT_EQUAL_HEX32(expected, actual)

/* Bit-level assertions */
TEST_ASSERT_BITS_HIGH(mask, actual)        /* mask bits must be set */
TEST_ASSERT_BITS_LOW(mask, actual)         /* mask bits must be clear */
TEST_ASSERT_BIT_HIGH(bit_number, actual)
TEST_ASSERT_BIT_LOW(bit_number, actual)

/* Float assertions */
TEST_ASSERT_FLOAT_WITHIN(delta, expected, actual)
TEST_ASSERT_EQUAL_FLOAT(expected, actual)

/* Array assertions */
TEST_ASSERT_EQUAL_UINT8_ARRAY(expected, actual, num_elements)
TEST_ASSERT_EQUAL_MEMORY(expected, actual, len)

/* String assertions */
TEST_ASSERT_EQUAL_STRING(expected, actual)
```

## Prompt Examples

- "Set up a Ceedling project for my STM32 firmware. The source is in `Core/Src/`, headers in `Core/Inc/`, and I want to test on the host with gcc."
- "Write a unit test for this CRC calculation function using Unity assertions."
- "I need to test my SPI driver that accesses `SPI1->DR` and `SPI1->SR` directly. Show me how to redirect the register pointer to a fake in the test."
- "Generate CMock expectations for this I2C driver function: `HAL_StatusTypeDef HAL_I2C_Master_Transmit(I2C_HandleTypeDef *hi2c, uint16_t DevAddress, uint8_t *pData, uint16_t Size, uint32_t Timeout)`."
- "My ceedling test is failing with 'undefined reference to ADC_Read'. What's wrong with my mock setup?"
- "How do I measure branch coverage with gcovr and export it as a Cobertura XML for Jenkins?"
