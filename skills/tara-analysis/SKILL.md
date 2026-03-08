---
name: tara-analysis
description: Guides automotive Threat Analysis and Risk Assessment (TARA) following ISO 21434 and MITRE TARA methodology, covering asset identification, threat enumeration, vulnerability scoring, and remediation planning.
---

# TARA Analysis

This skill guides you through Threat Analysis and Risk Assessment (TARA) for automotive systems and components, following the ISO/SAE 21434 cybersecurity standard and the MITRE TARA methodology.

## When to Use This Skill

Use this skill when you need to:

- Perform a cybersecurity TARA for an ECU, system, or vehicle function
- Identify and enumerate cyber threats for a new feature or interface
- Score threat scenarios using Attack Feasibility Rating (AFR) and Impact Rating
- Determine Cybersecurity Assurance Levels (CAL 1–4) for components
- Map threats to security controls and generate remediation recommendations
- Document TARA results in a structured format for ISO 21434 work products

## TARA Process Overview

TARA is a structured methodology to identify threats, assess their risk, and define appropriate countermeasures. The process follows these phases:

```
1. Asset Identification
       ↓
2. Threat Scenario Enumeration (using STRIDE or MITRE ATT&CK for Vehicles)
       ↓
3. Impact Assessment (damage scenarios + impact rating)
       ↓
4. Attack Feasibility Rating (AFR)
       ↓
5. Risk Determination (Impact × Feasibility → Risk Value)
       ↓
6. Risk Treatment Decision (accept / mitigate / transfer / avoid)
       ↓
7. Security Control Definition
       ↓
8. Residual Risk Verification
```

## Phase 1 — Asset Identification

Define what needs to be protected. For each item under analysis, identify:

**Asset categories:**

| Category | Examples |
|----------|----------|
| Data assets | Calibration data, cryptographic keys, diagnostic session credentials, VIN, odometer values |
| Functional assets | Remote start, OTA update capability, gateway routing, ADAS control commands |
| Communication assets | CAN bus, Ethernet backbone, V2X interfaces, Bluetooth/Wi-Fi pairing |
| Hardware assets | HSM, secure boot chain, ECU flash memory |

**For each asset, define:**
- Security properties at risk: **Confidentiality**, **Integrity**, **Availability**, **Authenticity**, **Non-repudiation**
- Cybersecurity goal: "The integrity of OTA firmware update packages shall be guaranteed"

## Phase 2 — Threat Scenario Enumeration

Apply the **STRIDE** model or **MITRE ATT&CK for ICS/Vehicles** to systematically enumerate threats.

**STRIDE categories:**

| Threat | Property Violated | Automotive Example |
|--------|------------------|--------------------|
| **S**poofing | Authenticity | Impersonating a legitimate ECU on the CAN bus |
| **T**ampering | Integrity | Modifying calibration data via OBD-II port |
| **R**epudiation | Non-repudiation | Erasing event logs after a cyberattack |
| **I**nformation Disclosure | Confidentiality | Extracting private keys via JTAG |
| **D**enial of Service | Availability | Flooding CAN bus to disable safety functions |
| **E**levation of Privilege | Authorization | Exploiting a diagnostic service to gain full ECU control |

**Threat scenario statement format:**

> "An attacker [who/from where] uses [attack method] to [threat action] affecting [asset], violating [security property], leading to [damage scenario]."

Example:

> "An attacker with physical access to the OBD-II port uses a replay attack on the UDS SecurityAccess service (0x27) to unlock programming session, allowing unauthorized firmware flashing, violating integrity of the software supply chain, potentially leading to vehicle malfunction or safety hazard."

## Phase 3 — Impact Assessment

Define damage scenarios and rate their severity.

**Damage scenario categories (ISO 21434 / SAE J3061):**

| Category | Description |
|----------|-------------|
| Safety | Physical harm to vehicle occupants, road users, or bystanders |
| Financial | Economic damage to vehicle owner, OEM, or supply chain |
| Operational | Degraded vehicle functionality, unintended activation of systems |
| Privacy | Unauthorized access to personal or location data |

**Impact Rating scale:**

| Rating | Value | Description |
|--------|-------|-------------|
| Severe | 3 | Life-threatening injury or death; severe financial loss; mass personal data breach |
| Major | 2 | Serious injury; significant financial loss; significant data exposure |
| Moderate | 1 | Minor injury; limited financial impact; limited data exposure |
| Negligible | 0 | No significant impact |

Rate each damage scenario across all applicable categories. Use the **worst-case** category rating as the overall impact.

## Phase 4 — Attack Feasibility Rating (AFR)

Rate how feasible it is for a threat actor to carry out the attack.

**AFR factors (ISO 21434 Annex E method):**

| Factor | Sub-factors |
|--------|------------|
| **Elapsed time** | Time required to perform the attack |
| **Specialist expertise** | Proficiency required (layman, proficient, expert, multiple experts) |
| **Knowledge of item** | Public, restricted, confidential, strictly confidential |
| **Window of opportunity** | Unlimited, easy, moderate, difficult |
| **Equipment** | Standard, specialized, bespoke, multiple bespoke |

Sum the scores for each factor. Map to feasibility rating:

| Score Range | Feasibility | Meaning |
|-------------|-------------|---------|
| 0–9 | High | Attack is easily feasible |
| 10–13 | Medium | Attack requires moderate effort |
| 14–19 | Low | Attack requires significant expertise and resources |
| ≥20 | Very Low | Attack is technically possible but impractical |

## Phase 5 — Risk Determination

Combine Impact and Attack Feasibility to determine risk:

| | **High Feasibility** | **Medium Feasibility** | **Low Feasibility** | **Very Low Feasibility** |
|---|---|---|---|---|
| **Severe Impact** | Critical | High | Medium | Low |
| **Major Impact** | High | Medium | Medium | Low |
| **Moderate Impact** | Medium | Medium | Low | Negligible |
| **Negligible Impact** | Low | Negligible | Negligible | Negligible |

This risk level determines the **Cybersecurity Assurance Level (CAL)**:

| Risk | CAL |
|------|-----|
| Critical | CAL 4 |
| High | CAL 3 |
| Medium | CAL 2 |
| Low | CAL 1 |
| Negligible | No CAL required |

## Phase 6 — Risk Treatment

For each threat scenario with risk above the acceptance threshold:

| Treatment | When to Apply |
|-----------|--------------|
| **Mitigate** | Implement security controls to reduce feasibility or impact |
| **Transfer** | Shift risk to another party (insurance, supplier responsibility) |
| **Avoid** | Remove the feature or interface that introduces the risk |
| **Accept** | Risk is within acceptance threshold; document rationale |

## Phase 7 — Security Control Definition

For each mitigated threat, define specific controls:

**Security control template:**

```
Control ID:       SC-001
Threat addressed: [Threat scenario ID]
Control type:     Preventive / Detective / Corrective
Description:      Implement secure boot using HSM to verify firmware signature
                  before execution. Use SHA-256 with RSA-2048 or ECDSA-256.
Verification:     Penetration test — attempt to boot unsigned firmware image.
                  Requirement: boot must fail and log security event.
Residual risk:    Low (after control implementation)
```

**Common automotive security controls by threat:**

| Threat | Controls |
|--------|----------|
| Firmware tampering | Secure boot, code signing, anti-rollback counter |
| CAN bus spoofing | MAC-based message authentication (SecOC, AUTOSAR), gateway filtering |
| Diagnostic exploitation | Session timeout, seed-key hardening, rate limiting, HSM-backed access |
| Key extraction | HSM key storage, debug port disabling in production, anti-tampering |
| OTA compromise | TLS mutual authentication, package signature verification, delta integrity checks |
| DoS on safety bus | Bus load monitoring, message rate limiting, bus-off recovery strategy |

## TARA Document Structure

A complete TARA work product (required by ISO 21434) includes:

1. **Item Definition** — system boundaries, interfaces, operational environment
2. **Asset List** — assets and their security properties
3. **Threat Scenario Table** — enumerated threats with STRIDE category and affected asset
4. **Damage Scenario Table** — damage scenarios with impact ratings
5. **Attack Path Analysis** — attack trees or step-by-step attack paths
6. **AFR Table** — feasibility scores per threat scenario
7. **Risk Determination Table** — risk matrix results and CAL assignment
8. **Risk Treatment Decisions** — accept/mitigate/transfer/avoid with rationale
9. **Security Control List** — controls with verification criteria
10. **Residual Risk Statement** — confirmed residual risk after controls

## Prompt Examples

- "Perform a TARA for an OTA update ECU interface. The ECU connects to the vehicle Ethernet backbone and receives signed firmware packages from a cloud backend."
- "Enumerate STRIDE threats for a Bluetooth key-fob pairing interface on a body control module."
- "Score the attack feasibility for a threat where an attacker with CAN bus access replays brake command messages."
- "What security controls should I apply to a UDS diagnostic interface to reach CAL 3?"
- "Generate a TARA threat scenario table for a V2X communication module that receives ETSI ITS messages."
