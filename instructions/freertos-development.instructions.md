---
description: 'Coding conventions and best practices for FreeRTOS-based embedded firmware development, covering task design, synchronization primitives, memory management, and common pitfalls.'
applyTo: '**.c, **.cpp, **.h'
---

# FreeRTOS Development

## Task Design

- Use `xTaskCreate()` with statically allocated stacks (`xTaskCreateStatic()`) for safety-critical applications where heap usage must be bounded
- Set task priorities deliberately: higher priority for time-critical tasks (e.g., motor control, safety monitors), lower priority for background work (logging, diagnostics)
- Name all tasks descriptively (the name appears in RTOS trace tools and debuggers)
- Keep task stack sizes as small as practical; use `uxTaskGetStackHighWaterMark()` during development to tune them
- Every task must contain an infinite loop — a task that returns will call `vTaskDelete(NULL)` or trigger a fault handler

## Synchronization Primitives

- Use binary semaphores for signaling between an ISR and a task
- Use mutexes (`xSemaphoreCreateMutex()`) for mutual exclusion in task context — never take a mutex from an ISR
- Use `xSemaphoreGiveFromISR()` / `xQueueSendFromISR()` inside interrupt handlers — never the non-ISR variants
- Always check the return value of `xSemaphoreTake()` and `xQueueReceive()` — a timeout means the wait expired, not that the operation succeeded
- Avoid priority inversion: use priority inheritance mutexes when a low-priority task holds a resource needed by a high-priority task

## Memory Management

- Prefer `heap_4` or `heap_5` for most applications; use `heap_1` only when no dynamic allocation after init is acceptable
- Set `configSUPPORT_STATIC_ALLOCATION` to `1` and provide `vApplicationGetIdleTaskMemory()` / `vApplicationGetTimerTaskMemory()` when using static allocation
- Never call `malloc()` / `free()` directly — use `pvPortMalloc()` / `vPortFree()` so FreeRTOS can track heap usage
- In safety-critical contexts, allocate all tasks, queues, semaphores, and buffers at startup and never free them at runtime

## Queues and Message Passing

- Size queues conservatively: a full queue on a send from an ISR silently drops the message unless checked
- Use queues for data transfer between tasks; use semaphores only for signaling
- Pass pointers in queues only if the pointed-to data has a lifetime that exceeds the queue transaction (prefer copying small structs by value)

## Timing and Delays

- Use `vTaskDelay()` for relative delays and `vTaskDelayUntil()` for precise periodic execution
- Express delays in ticks via `pdMS_TO_TICKS()` — never hardcode tick counts
- Do not rely on `vTaskDelay(0)` to yield; use `taskYIELD()` explicitly

## Debugging and Tracing

- Enable `configUSE_TRACE_FACILITY` and `configGENERATE_RUN_TIME_STATS` during development to profile CPU usage per task
- Use `vTaskList()` and `vTaskGetRunTimeStats()` via a debug UART task to monitor runtime behavior
- Implement `vApplicationStackOverflowHook()` to catch stack overflows during testing
- Implement `vApplicationMallocFailedHook()` to catch heap exhaustion
