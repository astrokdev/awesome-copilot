---
description: 'MISRA-C:2012 compliance rules for embedded C code: mandatory, required, and advisory rules with compliant patterns and common violations.'
applyTo: '**.c, **.h'
---

# MISRA-C:2012 Compliance

## Mandatory Rules (no deviations permitted)

- **Rule 1.3**: There shall be no occurrence of undefined or critical unspecified behavior. Avoid signed integer overflow, null pointer dereference, division by zero, out-of-bounds array access, and unsequenced side effects.
- **Rule 17.3**: A function shall not be declared implicitly. Always include or provide a prototype before calling a function.
- **Rule 21.1**: `#define` and `#undef` shall not be applied to identifiers in the standard library. Never redefine `NULL`, `true`, `false`, `errno`, or any `_`-prefixed reserved name.
- **Rule 21.2**: A reserved identifier or macro name shall not be declared. Do not shadow standard library names like `abs`, `free`, `time`.

## Required Rules — Most Commonly Violated

### Type Safety (Rules 10.x)

- **Rule 10.1**: Operands shall not be of an inappropriate essential type.
  ```c
  /* NON-COMPLIANT: mixing signed and unsigned */
  uint16 a = 10U;
  sint16 b = -5;
  if (a > b) { }           /* signed/unsigned comparison */

  /* COMPLIANT: explicit cast or same type */
  if (a > (uint16)b) { }   /* or redesign to avoid mixing */
  ```

- **Rule 10.3**: The value of an expression shall not be assigned to an object of a narrower essential type unless it is explicitly cast.
  ```c
  /* NON-COMPLIANT */
  uint16 wide = getSensorValue();
  uint8 narrow = wide;

  /* COMPLIANT */
  uint8 narrow = (uint8)(wide & 0x00FFU);
  ```

- **Rule 10.4**: Both operands of an operator in which the usual arithmetic conversions are performed shall have the same essential type category.
  ```c
  /* NON-COMPLIANT */
  uint32 result = signedVal + unsignedVal;

  /* COMPLIANT */
  uint32 result = (uint32)signedVal + unsignedVal;
  ```

### Pointer Rules (Rules 11.x)

- **Rule 11.3**: A cast shall not be performed between a pointer to object type and a pointer to a different object type. Exception: cast to/from `void*` is allowed. Hardware register access requires a deviation record.

- **Rule 11.8**: A cast shall not remove any `const` or `volatile` qualification from the pointer target type. Never cast away `const` — redesign the API instead.

### Expression Rules (Rules 12.x, 14.x)

- **Rule 12.1**: The precedence of operators within expressions should be made explicit.
  ```c
  /* NON-COMPLIANT */
  result = a + b * c;

  /* COMPLIANT — parentheses make intent clear */
  result = a + (b * c);
  ```

- **Rule 14.4**: The controlling expression of `if`, `while`, `for`, and `do...while` shall have essentially Boolean type.
  ```c
  /* NON-COMPLIANT */
  uint8 status = getStatus();
  if (status) { }

  /* COMPLIANT */
  if (status != 0U) { }

  /* Also COMPLIANT — boolean type is directly usable */
  boolean ready = isReady();
  if (ready) { }
  ```

### Control Flow (Rules 15.x, 16.x)

- **Rule 15.7**: All `if...else if` constructs shall be terminated with an `else` statement.
  ```c
  /* NON-COMPLIANT */
  if (x == 1U) { doA(); }
  else if (x == 2U) { doB(); }

  /* COMPLIANT */
  if (x == 1U) { doA(); }
  else if (x == 2U) { doB(); }
  else { /* default: no action */ }
  ```

- **Rule 16.4**: Every `switch` statement shall have a `default` label.
- **Rule 16.6**: Every `switch` shall have at least two `case` labels (otherwise use `if`).

### Function Rules (Rules 8.x, 17.x)

- **Rule 8.4**: A compatible declaration shall be visible when an object or function with external linkage is defined. Include the header that declares the function before defining it in the `.c` file.

- **Rule 17.7**: The value returned by a function having non-void return type shall be used. If intentionally discarding:
  ```c
  (void)memset(buffer, 0, sizeof(buffer));
  ```

## Compliant Code Patterns

### Function Declaration

```c
/* Always declare return type explicitly; use Std_ReturnType for fallible functions */
static Std_ReturnType processValue(uint16 input, uint16* output);
```

### For Loop

```c
/* Loop variable: unsigned, no modification inside body, single increment */
for (uint8 idx = 0U; idx < TABLE_SIZE; idx++)
{
    table[idx] = computeEntry(idx);
}
```

### Null Pointer Check

```c
/* Always check pointers before dereference */
if (dataPtr != NULL_PTR)
{
    *dataPtr = newValue;
}
```

### Bit Manipulation

```c
/* Use unsigned types, explicit width, parenthesized shifts */
uint32 mask = ((uint32)1U << bitPosition);
register_value = register_value | mask;        /* set bit */
register_value = register_value & (~mask);     /* clear bit */
```

## Anti-Patterns

- Using `int` instead of fixed-width types (`uint8`, `uint16`, `uint32`)
- Relying on implicit integer promotion for correctness
- Using `malloc`/`free` after initialization (Rule 21.3 in safety contexts)
- Recursive function calls (Rule 17.2 — prohibited in safety-critical code)
- Using `goto` except for error cleanup in a single function (Rule 15.1)
- Comparing floating-point values with `==` (Directive 1.1 — undefined precision)
- Omitting `U` suffix on unsigned constants: use `0U`, `0xFFU`, `100U`
