---
description: 'Embedded C unit and integration test coding patterns: test naming, assertion usage, RTE stub organization, mock configuration, and hardware abstraction in tests.'
applyTo: '**/test/**, **/tests/**, **/*_test.c, **/*_Test.c, **/Test_*.c'
---

# Embedded Test Patterns

## Test Naming

Use the convention: `Test_<Module>_<Function>_<Scenario>`

```c
void Test_TempFilter_Apply_NominalInput(void);
void Test_TempFilter_Apply_BoundaryMaximum(void);
void Test_TempFilter_Apply_InputZero(void);
void Test_TempFilter_Apply_RteReadFailure(void);
void Test_TempFilter_Init_SetsDefaultState(void);
```

## Assertion Patterns

Use typed assertions for clear failure messages:

```c
/* Integer comparisons — use the matching width */
TEST_ASSERT_EQUAL_UINT8(expected, actual);
TEST_ASSERT_EQUAL_UINT16(expected, actual);
TEST_ASSERT_EQUAL_UINT32(expected, actual);
TEST_ASSERT_EQUAL_INT16(expected, actual);

/* Float comparisons — always use tolerance */
TEST_ASSERT_FLOAT_WITHIN(0.01f, expected, actual);

/* Boolean */
TEST_ASSERT_TRUE(condition);
TEST_ASSERT_FALSE(condition);

/* Pointer */
TEST_ASSERT_NOT_NULL(ptr);
TEST_ASSERT_NULL(ptr);

/* Memory comparison */
TEST_ASSERT_EQUAL_MEMORY(expected_buf, actual_buf, size);
```

## RTE Stub Organization

- One stub file pair per SWC: `Stub_Rte_<SwcName>.h` and `Stub_Rte_<SwcName>.c`
- Stubs live in `test/unit/<SwcName>/stubs/`
- Each stub provides: init/reset, setter functions (control inputs), getter functions (capture outputs), call counters

```
test/unit/<SwcName>/
├── Test_<SwcName>.c
└── stubs/
    ├── Stub_Rte_<SwcName>.h
    └── Stub_Rte_<SwcName>.c
```

## Setup / Teardown Pattern

```c
void setUp(void)
{
    Stub_Rte_SwcName_Init();     /* Reset all RTE stubs to defaults */
    SwcName_Init();              /* Call SWC init runnable */
}

void tearDown(void)
{
    Stub_Rte_SwcName_Reset();    /* Clean up stub state */
}
```

Always reset stubs before each test to prevent test-order dependencies.

## Test Isolation Rules

- Each test file links against stubs only — never against real RTE, BSW, or MCAL
- Tests must be order-independent — no test relies on state from a previous test
- setUp/tearDown must fully reset all stub state
- No file I/O, network, or real hardware access in unit tests

## Hardware Abstraction in Tests

```c
/* In production code — use macros for register access */
#ifdef UNIT_TEST
  extern uint32 mock_registers[];
  #define HW_REG(addr) (mock_registers[(addr) >> 2U])
#else
  #define HW_REG(addr) (*(volatile uint32*)(addr))
#endif
```

## Anti-Patterns

- Testing implementation details (private function internals) instead of observable behavior
- Writing tests that only check the happy path — always test error paths and boundary values
- Fragile mocks that break when the SWC's internal call order changes
- Missing boundary conditions: off-by-one, maximum value, zero, negative (for signed types)
- Asserting on exact float equality without tolerance
- Tests that depend on execution order
- No tearDown/reset between tests — shared state causes intermittent failures
