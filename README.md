# Path of Exile Log Events

![NPM Version](https://img.shields.io/npm/v/npm) ![LICENSE](https://img.shields.io/github/license/moepmoep12/poe-log-events) ![TOP LANGUAGE](https://img.shields.io/github/languages/top/moepmoep12/poe-log-events) ![ISSUES](https://img.shields.io/github/issues/moepmoep12/poe-log-events) ![TEST_WORKFLOW](https://img.shields.io/github/workflow/status/moepmoep12/poe-log-events/Test) [![codecov](https://codecov.io/gh/moepmoep12/poe-log-events/branch/master/graph/badge.svg?token=b82B6AxIpl)](https://codecov.io/gh/moepmoep12/poe-log-events)

## Table of Contents

- [Introduction](#introduction)
- [Overview](#overview)
- [Installation](#installation)
- [Getting started](#getting-started)
- [Handling errors](#handling-errors)
- [Events](#events)

## Introduction

The purpose of this library is to provide an easy to use event emitter for the game [Path of Exile](https://www.pathofexile.com/) (PoE) by Grinding Gear Games to be used by other applications listening to events. Therefore, this library monitors the log file of the PoE client and emits events when something interesting happens ingame.

> Note: This product isn't affiliated with or endorsed by Grinding Gear Games in any way.

## Overview

The key objectives of this library are:

- Provide an event emitter for the PoE log file
- Fire custom events with detailed event-specific data
- Support all languages

## Installation

Install the latest stable version of this library:

```bash
 npm install --save poe-log-events
```

## Getting started

```typescript
import { Language, LogOptions, PathOfExileLog } from "poe-log-events";

const logOptions: LogOptions = {
  // default path for windows
  logFilePath: "C:\\Program Files (x86)\\Grinding Gear Games\\Path of Exile\\logs\\Client.txt",
  // can be ignored by most applications
  ignoreDebug: true,
  language: Language.English,
};

const poeLog = new PathOfExileLog(logOptions);

// register event handlers

poeLog.on("areaChanged", (event) => {
  console.log(`Entered new area ${event.newArea} at ${event.date.toISOString()}`);
});

poeLog.on("buyItemWhisperSent", (event) => {
  console.log(
    `Sent buy request to buy ${event.item} for ${event.price} ${event.currency} from ${event.player}`
  );
});

poeLog.on("sellItemWhisperReceived", (event) => {
  console.log(
    `Received request to sell item ${event.item} for ${event.price} ${event.currency} to ${event.player}`
  );
});

poeLog.on("error", (err) => {
  console.error(err);
});
```

## Handling errors

Errors are emitted in the `error` event. Hence, add a listener to the `error` event:

```typescript
poeLog.on("error", (err) => {
  console.error(err);
});
```

## Events

The available events are defined by the interface [PathOfExileLogEvents](src/events/PathOfExileLogEvents.ts). See below for a list.

| **Name**                | **Description**                                          |
| ----------------------- | -------------------------------------------------------- |
| error                   | Error occured                                            |
| line                    | New line was parsed                                      |
| whisperReceived         | A whisper was received                                   |
| whisperSent             | A whisper was sent                                       |
| sellItemWhisperReceived | A trade whisper for selling an item was received         |
| buyItemWhisperSent      | A trade whisper for buying an item was sent              |
| sellBulkWhisperReceived | A trade whisper for selling an item in bulk was received |
| buyBulkWhisperSent      | A trade whisper for buying an item in bulk was sent      |
| areaChanged             | A new area was entered                                   |
| areaJoinedBy            | The current area was joined by another player            |
| areaLeftBy              | The current area was left by another player              |
| tradeAccepted           | A trade was completed                                    |
| tradeCancelled          | A trade was cancelled                                    |
| connected               | Client connected to the PoE server                       |
| afk                     | AFK mode started                                         |
| afkEnd                  | AFK mode ended                                           |
| dnd                     | DND mode started                                         |
| dndEnd                  | DND mode ended                                           |
| login                   | Client logged in                                         |
| chatJoined              | A chat channel was joined                                |
| deathCount              | /deaths command was executed                             |
| remainingMonster        | /remaining command was executed                          |
| slain                   | Player was slain                                         |
| level                   | Player leveled up/down                                   |
| playedQuery             | /played command was executed                             |
| createdQuery            | /age command was executed                                |
