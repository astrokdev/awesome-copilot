---
name: safety-code-review
description: 'ISO 26262 compliant code review process for safety-relevant AUTOSAR software components.'
---

# Safety Code Review Workflow

ISO 26262 compliant code review process for safety-relevant AUTOSAR software components.

## Trigger

Before merging code changes to safety-relevant (ASIL A or higher) software components. Required by ISO 26262 Part 6, Section 9 (Software unit verification).

## Steps

### Step 1: MISRA Compliance Verification

**Agent**: `embedded-c-reviewer`
**Hook**: `misra-compliance-check`

- Run full MISRA-C:2012 static analysis on changed files
- Verify zero mandatory rule violations
- Review all required rule deviations — each must have a formal Deviation Record
- Advisory rule violations: review and accept or fix
- **Gate**: Mandatory violations = 0, all required deviations documented

### Step 2: Safety Analysis Impact

**Skill**: `iso26262-review`

- Check if changes affect safety goals or safety requirements
- Review FMEA for impacted functions — verify failure modes are still covered
- Verify ASIL decomposition is maintained (no ASIL violation at integration boundary)
- Check freedom-from-interference (changes in QM code don't affect ASIL code)
- **Gate**: Safety impact assessment completed and documented

### Step 3: Code Coverage Verification

**Agent**: `embedded-test-architect`

- Run unit tests and collect coverage data
- Verify coverage meets ASIL level requirements:

| ASIL | Coverage Type | Minimum | Recommended |
|------|--------------|---------|-------------|
| A | Statement | 80% | 90% |
| B | Branch | 80% | 90% |
| C | Branch + MC/DC | 90% | 95% |
| D | MC/DC | 90% | 100% |

- If coverage is below target, identify uncovered branches and create additional tests
- **Gate**: Coverage target met for the component's ASIL level

### Step 4: Memory and Resource Analysis

**Skill**: `memory-map-analyzer`
**Agent**: `linker-memory-engineer`

- Verify stack usage remains within allocated bounds per task
- Check FLASH and RAM utilization against budget
- Review timing impact — changes should not increase WCET beyond budget
- **Gate**: Memory and timing budgets not exceeded

### Step 5: Review Checklist Sign-off

Based on ISO 26262 Part 6, Table 9 — Software unit verification methods:

#### Checklist Items

- [ ] **No dynamic objects or variables**: All variables are statically allocated
- [ ] **No recursion**: No direct or indirect recursive calls
- [ ] **Return values checked**: All function return values are used or explicitly cast to `(void)`
- [ ] **Null pointer checks**: All pointer parameters validated before dereference
- [ ] **Array bounds**: All array accesses are within declared bounds
- [ ] **Integer overflow**: No operations that can cause signed integer overflow
- [ ] **Type safety**: No implicit narrowing conversions; explicit casts used
- [ ] **Initialization**: All variables initialized before first use
- [ ] **Volatile correctness**: Hardware-accessed and ISR-shared variables are `volatile`
- [ ] **Critical sections**: Shared data protected by exclusive areas or OS resources
- [ ] **Error handling**: All error paths have defined behavior (DET, Dem, or defensive defaults)
- [ ] **Naming conventions**: AUTOSAR naming patterns followed consistently
- [ ] **MemMap sections**: All code and data in correct AUTOSAR MemMap sections
- [ ] **Documentation**: Deviation records filed for all MISRA required rule violations

### Review Record

```
Review ID:       REV-<project>-<number>
Component:       <SwcName>
ASIL Level:      <ASIL>
Reviewer:        <name>
Date:            <date>
Commit/PR:       <reference>
Coverage Result: <type> coverage at <X>%
MISRA Result:    <N> advisory, <M> deviations documented
Verdict:         APPROVED / REWORK REQUIRED
Comments:        <findings>
```
