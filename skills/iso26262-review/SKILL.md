---
name: iso26262-review
description: 'Functional safety review assistant for ISO 26262 automotive systems: FMEA, ASIL decomposition, safety goal definition, safety concept reviews, and work product checklists.'
---

# ISO 26262 Functional Safety Review

This skill assists with functional safety analysis and reviews following ISO 26262 (Road vehicles — Functional safety), covering hazard analysis, ASIL assignment, safety goal definition, FMEA, and software safety concept reviews.

## When to Use This Skill

Use this skill when you need to:

- Perform or review a Hazard Analysis and Risk Assessment (HARA)
- Define or review Safety Goals and Functional Safety Requirements
- Conduct or review a Failure Mode and Effects Analysis (FMEA/FMEDA) for hardware or software
- Evaluate ASIL decomposition correctness
- Review a Technical Safety Concept (TSC) or Software Safety Concept (SSC)
- Check software development work products for ISO 26262 Part 6 compliance
- Generate safety analysis templates for a new item or element

## Key ISO 26262 Concepts

### ASIL (Automotive Safety Integrity Level)

ASILs rank the risk reduction required for a safety goal:

| ASIL | Severity | Exposure | Controllability | Description |
|------|----------|----------|-----------------|-------------|
| QM | Any | Any | Any | Quality Management only — no safety requirement |
| A | Low | Any | Any | Lowest safety requirement |
| B | — | — | — | Moderate safety requirement |
| C | — | — | — | High safety requirement |
| D | High | High | Low | Highest safety requirement |

### Hazard Analysis and Risk Assessment (HARA)

For each hazardous event, rate:

**Severity (S):**
| Rating | Description |
|--------|-------------|
| S0 | No injuries |
| S1 | Light and moderate injuries |
| S2 | Severe and life-threatening injuries (survival probable) |
| S3 | Life-threatening injuries (survival uncertain) or fatal |

**Exposure (E):**
| Rating | Description |
|--------|-------------|
| E0 | Incredible |
| E1 | Very low probability |
| E2 | Low probability |
| E3 | Medium probability |
| E4 | High probability (occurs in most driving situations) |

**Controllability (C):**
| Rating | Description |
|--------|-------------|
| C0 | Controllable in general |
| C1 | Simply controllable |
| C2 | Normally controllable |
| C3 | Difficult to control or uncontrollable |

**ASIL determination matrix (ISO 26262-3 Table 4):**

| S\E+C | E1,C1 | E1,C2 | E1,C3 | E2,C1 | E2,C2 | E2,C3 | E3,C1 | E3,C2 | E3,C3 | E4,C1 | E4,C2 | E4,C3 |
|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|
| S1 | QM | QM | QM | QM | QM | A | QM | A | B | A | B | C |
| S2 | QM | QM | A | QM | A | B | A | B | C | B | C | D |
| S3 | QM | A | B | A | B | C | B | C | D | C | D | D |

### Safety Goal Definition

A Safety Goal is derived from each hazardous event assigned ASIL A–D. Format:

> "The [system/function] shall [action/constraint] to avoid [hazardous event]."

Example:
> **SG-001 [ASIL D]:** The Electric Power Steering system shall not apply unintended steering torque above 3 Nm to avoid loss of vehicle control.

Each Safety Goal requires:
- Unique ID
- ASIL level
- Fault tolerant time interval (FTTI)
- Safe state definition
- Emergency operation interval (EOI) if applicable

## FMEA Review Checklist

When reviewing an FMEA (Failure Mode and Effects Analysis):

**Completeness:**
- All components/functions in scope are analyzed
- All relevant failure modes are considered (no output, wrong output, delayed output, unintended output)
- Failure effects are analyzed at component, system, and vehicle level
- Single-point failures and latent faults are identified

**Diagnostic Coverage (DC):**
- Diagnostic mechanisms are specified for each failure mode
- DC values are justified (none <60%, low 60–90%, medium 90–99%, high ≥99%)
- Safe failure fraction (SFF) is calculated correctly for hardware

**FMEDA-specific:**
- Failure rate data sources are traceable (SN 29500, IEC TR 62380, FMD-2016, or field data)
- Random hardware failure targets (PMHF) meet ASIL requirements:
  - ASIL A: < 10⁻⁵ per hour
  - ASIL B: < 10⁻⁶ per hour
  - ASIL C: < 10⁻⁷ per hour
  - ASIL D: < 10⁻⁸ per hour

## ASIL Decomposition

ASIL decomposition splits a safety requirement between two independent elements to reduce the ASIL of each:

| Original | Decomposed pair |
|----------|----------------|
| ASIL D | ASIL B(D) + ASIL B(D) — or — ASIL A(D) + ASIL C(D) |
| ASIL C | ASIL A(C) + ASIL B(C) |
| ASIL B | ASIL A(B) + QM(B) |

**Independence requirements:**
- Spatial independence: separate hardware (different silicon, power supply, ground)
- Temporal independence: separate OS tasks, distinct scheduling slots
- No common cause failures: different design teams, different tools/compilers where possible

**Decomposition review checklist:**
- Independence of the two elements is demonstrated and documented
- Both elements implement their decomposed ASIL requirements
- The overall safety goal is still met even if one element fails (fail-safe or fail-operational)
- No common cause failure paths exist (shared power, clock, communication bus)

## Software Safety Concept Review

For ISO 26262 Part 6 software work products:

**Software Safety Requirements (SSR) completeness:**
- All Functional Safety Requirements (FSRs) allocated to software are covered
- SSRs are verifiable, unambiguous, and consistent
- Freedom from interference between ASIL elements and lower ASIL / QM software is addressed

**Software Architecture review:**
- Safety mechanisms (error detection, error handling, fail-safe transitions) are explicitly shown
- Data flows for safety-relevant signals are traceable from sensor to actuator
- Partitioning mechanisms are identified (MPU regions, OS application boundaries)
- Watchdog design (internal and external) is documented

**Implementation checklist (Part 6 Table 1):**
- Defensive programming measures match ASIL level (assertions, range checks, pointer validation)
- Use of language subsets or coding guidelines (MISRA C, AUTOSAR C++) is documented
- Dynamic memory allocation: avoided for ASIL C/D; justified and bounded for ASIL A/B
- Recursion: avoided for ASIL C/D; justified for ASIL A/B

**Verification checklist:**
- Unit tests cover all requirements allocated to the unit
- Structural coverage targets met: statement (ASIL A/B), branch (ASIL B/C), MC/DC (ASIL C/D)
- Static analysis results are reviewed and justified or resolved
- Back-to-back testing performed where applicable (model-based or generated code)

## Common Safety Mechanisms

| Mechanism | Applicable Failure Modes | Typical DC |
|-----------|--------------------------|------------|
| CRC / checksum | Data corruption in memory or communication | High (90–99%) |
| End-to-end (E2E) protection | Signal corruption on communication bus | High |
| Plausibility checks | Out-of-range sensor values | Medium–High |
| Dual-channel comparison | Systematic or random hardware faults | High |
| Watchdog (internal) | Software execution errors, CPU lockup | Medium |
| Watchdog (external) | CPU failure, power supply issues | High |
| RAM test (march test) | Memory faults (stuck-at, transition) | Medium–High |
| Flash CRC | ROM corruption | High |
| Stack monitoring | Stack overflow | Medium |
| Control flow monitoring | Incorrect execution order | Medium |
| Timeout monitoring | Missing message, communication loss | Medium |

## Prompt Examples

- "Perform a HARA for an autonomous emergency braking (AEB) function. The system applies brakes automatically when a collision is imminent."
- "Review this FMEA table for the motor control module. Are all failure modes covered and are diagnostic coverage values justified?"
- "We want to decompose ASIL D for our torque sensor plausibility check between the primary ECU and a safety monitor IC. What independence requirements must we meet?"
- "Generate a Software Safety Concept outline for an ASIL C battery management system."
- "What structural coverage level is required for ASIL D software and how do I measure MC/DC coverage with gcov?"
