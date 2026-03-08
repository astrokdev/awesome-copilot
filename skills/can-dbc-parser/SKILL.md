---
name: can-dbc-parser
description: Assists with reading, writing, and analyzing CAN DBC database files, generating signal handler boilerplate in C, and implementing message encoding and decoding logic for embedded ECUs.
---

# CAN DBC Parser

This skill helps you work with CAN DBC (Database CAN) files: understanding their syntax, extracting signal definitions, generating C code for message encoding/decoding, and implementing signal handler boilerplate for embedded ECUs.

## When to Use This Skill

Use this skill when you need to:

- Read and understand an existing `.dbc` file
- Generate C structs, encoding, and decoding functions from DBC signal definitions
- Implement a CAN receive handler for a specific message ID
- Convert between raw CAN frame bytes and physical signal values (scaling, offset, range)
- Validate a DBC file for consistency (signal bit positions, overlaps, value tables)
- Design a CAN signal database for a new ECU or feature

## DBC File Structure

A DBC file is a text file describing CAN messages and their signals.

**Basic structure:**

```
VERSION ""

NS_ :

BS_:

BU_: ECU_A ECU_B Gateway

BO_ 0x100 EngineStatus: 8 ECU_A
 SG_ EngineRPM : 0|16@1+ (0.25,0) [0|16000] "rpm" ECU_B,Gateway
 SG_ EngineTemp : 16|8@1+ (0.5,-40) [-40|215] "degC" ECU_B
 SG_ EngineRunning : 24|1@1+ (1,0) [0|1] "" Vector__XXX

VAL_ 0x100 EngineRunning 0 "Off" 1 "Running" ;
```

**Signal definition syntax:**

```
SG_ <SignalName> : <StartBit>|<Length>@<ByteOrder><ValueType> (<Factor>,<Offset>) [<Min>|<Max>] "<Unit>" <Receivers>
```

| Field | Description |
|-------|-------------|
| `StartBit` | Bit position of LSB (Intel/little-endian) or MSB (Motorola/big-endian) |
| `Length` | Number of bits |
| `@1` | Intel byte order (little-endian) |
| `@0` | Motorola byte order (big-endian) |
| `+` | Unsigned value |
| `-` | Signed value |
| `Factor` | Physical = Raw × Factor + Offset |
| `Offset` | See Factor |
| `Min|Max` | Physical value range |

## Signal Decoding — Concepts

### Intel (Little-Endian) Byte Order

Start bit is the LSB position, counting from bit 0 of byte 0. Bits are filled from LSB to MSB across bytes in increasing byte order.

### Motorola (Big-Endian) Byte Order

Start bit is the MSB position. Bits fill from MSB downward, crossing byte boundaries in a Motorola-specific pattern.

### Physical Value Conversion

```
physical_value = raw_value * factor + offset
raw_value = (physical_value - offset) / factor
```

Always validate that the raw value fits within the signal bit length before encoding.

## C Code Generation Patterns

### Message Struct

```c
/* Generated from DBC: BO_ 0x100 EngineStatus */
typedef struct {
    float   EngineRPM;        /* 0..16000 rpm, factor=0.25, offset=0 */
    float   EngineTemp;       /* -40..215 degC, factor=0.5, offset=-40 */
    uint8_t EngineRunning;    /* 0=Off, 1=Running */
} EngineStatus_t;

#define ENGINESTATUS_ID     0x100U
#define ENGINESTATUS_DLC    8U
```

### Decode Function (Intel byte order signals)

```c
/**
 * Decode CAN frame 0x100 EngineStatus from raw 8-byte payload.
 * @param data  Pointer to 8-byte CAN frame payload
 * @param msg   Output struct — populated on return
 */
void EngineStatus_Decode(const uint8_t data[8], EngineStatus_t *msg)
{
    uint16_t raw_rpm;
    uint8_t  raw_temp;
    uint8_t  raw_running;

    /* EngineRPM: bits 0..15, Intel, unsigned, factor=0.25, offset=0 */
    raw_rpm = (uint16_t)data[0] | ((uint16_t)data[1] << 8U);
    msg->EngineRPM = (float)raw_rpm * 0.25f;

    /* EngineTemp: bits 16..23, Intel, unsigned, factor=0.5, offset=-40 */
    raw_temp = data[2];
    msg->EngineTemp = (float)raw_temp * 0.5f + (-40.0f);

    /* EngineRunning: bit 24, Intel, unsigned, factor=1, offset=0 */
    raw_running = (data[3] >> 0U) & 0x01U;
    msg->EngineRunning = raw_running;
}
```

### Encode Function

```c
/**
 * Encode EngineStatus struct into 8-byte CAN frame payload.
 * @param msg   Input struct with physical values
 * @param data  Output 8-byte buffer (caller must zero-initialize)
 */
void EngineStatus_Encode(const EngineStatus_t *msg, uint8_t data[8])
{
    uint16_t raw_rpm;
    uint8_t  raw_temp;

    /* Clamp and scale EngineRPM */
    float rpm_clamped = msg->EngineRPM;
    if (rpm_clamped < 0.0f)     rpm_clamped = 0.0f;
    if (rpm_clamped > 16000.0f) rpm_clamped = 16000.0f;
    raw_rpm = (uint16_t)(rpm_clamped / 0.25f);
    data[0] = (uint8_t)(raw_rpm & 0xFFU);
    data[1] = (uint8_t)((raw_rpm >> 8U) & 0xFFU);

    /* Clamp and scale EngineTemp */
    float temp_clamped = msg->EngineTemp;
    if (temp_clamped < -40.0f) temp_clamped = -40.0f;
    if (temp_clamped > 215.0f) temp_clamped = 215.0f;
    raw_temp = (uint8_t)((temp_clamped - (-40.0f)) / 0.5f);
    data[2] = raw_temp;

    /* EngineRunning: single bit */
    data[3] = (uint8_t)(msg->EngineRunning & 0x01U);
}
```

### CAN Receive Handler Boilerplate

```c
/* Can_Dispatch.c — route incoming CAN frames to decode functions */
#include "Can_Dispatch.h"
#include "EngineStatus.h"

static EngineStatus_t g_EngineStatus;

void Can_RxIndication(uint32_t id, uint8_t dlc, const uint8_t *data)
{
    switch (id)
    {
        case ENGINESTATUS_ID:
            if (dlc >= ENGINESTATUS_DLC)
            {
                EngineStatus_Decode(data, &g_EngineStatus);
                EngineStatus_OnReceive(&g_EngineStatus);  /* application callback */
            }
            break;

        /* Add more message handlers here */

        default:
            /* Unhandled message ID */
            break;
    }
}
```

## DBC Validation Checklist

When reviewing a DBC file:

- Signal bit ranges do not overlap within the same message
- Start bit + length does not exceed the message DLC (8 bytes = 64 bits for classic CAN)
- Motorola start bit interpretation is consistent with the toolchain (CANdb++ vs. Vector style)
- Factor and offset produce physical values within the Min/Max range for all raw values
- Value tables (`VAL_`) cover all possible raw values for enum-style signals
- Message IDs are unique across the network
- Sender (`Transmitter`) is specified for each message
- Multiplexed signals (`MUX`) have a valid multiplexer signal and consistent mux IDs

## Prompt Examples

- "Parse this DBC file and generate C decode/encode functions for message 0x200."
- "I have a Motorola byte order signal starting at bit 23, length 12. Show me how to extract it from an 8-byte CAN frame."
- "Generate a CAN receive dispatcher for these five message IDs from my DBC."
- "Check this DBC signal definition for bit overlap with neighboring signals in the same message."
- "Convert this physical value (95.5 °C) to a raw CAN signal value given factor=0.5, offset=-40."
