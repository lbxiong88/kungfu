# Wingchun Framework Architecture Analysis

## Overview

Wingchun (咏春) is the strategy execution engine component of the Kungfu quantitative trading system. This document provides a comprehensive analysis of its main components and their relationships.

## Directory Structure

```
framework/core/src/libkungfu/wingchun/
├── basketorder/     # Advanced multi-instrument order management
├── book/           # Accounting and position management
├── broker/         # Market interface and broker abstraction
├── service/        # Framework services (ledger, bar data)
├── strategy/       # Strategy execution environment
└── util/           # Common utilities and helpers
```

## Component Architecture

```
                    ┌─────────────────────────────────────────────┐
                    │            WINGCHUN FRAMEWORK               │
                    │        (Strategy Execution Engine)         │
                    └─────────────────────────────────────────────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    │                    │                    │
            ┌───────▼──────┐    ┌───────▼──────┐    ┌───────▼──────┐
            │   STRATEGY   │    │    BROKER    │    │     BOOK     │
            │              │    │              │    │              │
            │ ┌──────────┐ │    │ ┌──────────┐ │    │ ┌──────────┐ │
            │ │ Context  │ │    │ │ Vendor   │ │    │ │   Book   │ │
            │ │          │ │    │ │          │ │    │ │          │ │
            │ │ - Timer  │ │    │ │ - Client │ │    │ │ - Asset  │ │
            │ │ - Orders │ │    │ │ - Trader │ │    │ │ - Pos'ns │ │
            │ │ - Subs   │ │    │ │ - MD     │ │    │ │ - Orders │ │
            │ └──────────┘ │    │ └──────────┘ │    │ │ - Trades │ │
            │              │    │              │    │ └──────────┘ │
            │ ┌──────────┐ │    │ ┌──────────┐ │    │              │
            │ │ Runtime  │ │    │ │ Service  │ │    │ ┌──────────┐ │
            │ │ Runner   │ │    │ │          │ │    │ │Bookkeeper│ │
            │ └──────────┘ │    │ │ - State  │ │    │ │          │ │
            └──────────────┘    │ │ - IO     │ │    │ │ - Acct'g │ │
                                │ └──────────┘ │    │ │ - Books  │ │
                                └──────────────┘    │ └──────────┘ │
                                                    └──────────────┘
                    │                    │                    │
            ┌───────▼──────┐    ┌───────▼──────┐    ┌───────▼──────┐
            │  BASKETORDER │    │   SERVICE    │    │     UTIL     │
            │              │    │              │    │              │
            │ ┌──────────┐ │    │ ┌──────────┐ │    │ ┌──────────┐ │
            │ │  Engine  │ │    │ │  Ledger  │ │    │ │ Common   │ │
            │ │          │ │    │ │          │ │    │ │ Helpers  │ │
            │ │ - Basket │ │    │ │ - Global │ │    │ │ Types    │ │
            │ │ - Orders │ │    │ │   Books  │ │    │ │ Utils    │ │
            │ │ - States │ │    │ │ - States │ │    │ └──────────┘ │
            │ └──────────┘ │    │ └──────────┘ │    └──────────────┘
            └──────────────┘    │              │
                                │ ┌──────────┐ │
                                │ │   Bar    │ │
                                │ │ (OHLCV)  │ │
                                │ └──────────┘ │
                                └──────────────┘

                        ┌─────────────────────────┐
                        │     DATA FLOW           │
                        └─────────────────────────┘
                                    │
        Market Data ────┐           │           ┌──── Strategy Events
                        │           │           │
        Trading Orders ─┼─────► BROKER ◄──────┼──── Book Updates
                        │           │           │
        Executions ─────┘           │           └──── Position Changes
                                    │
                                YIJINJING
                              (Time Series DB)
```

## Core Components

### 1. STRATEGY Module
**Location**: `strategy/`

**Purpose**: Provides the execution environment for trading strategies

**Key Classes**:
- **Context**: Main strategy interface providing:
  - Timer management (`add_timer`, `add_time_interval`)
  - Market data subscription (`subscribe`, `subscribe_all`)
  - Order management (`insert_order`, `cancel_order`)
  - Account management (`add_account`)
  - Book and position control

- **Runtime/Runner**: Strategy lifecycle management and execution

**File Locations**:
- `strategy/context.h` - Strategy context interface
- `strategy/context.cpp` - Context implementation
- `strategy/runtime.cpp` - Strategy runtime
- `strategy/runner.cpp` - Strategy runner

### 2. BROKER Module
**Location**: `broker/`

**Purpose**: Abstracts broker connections and market interfaces

**Key Classes**:
- **BrokerVendor**: Base broker abstraction inheriting from yijinjing apprentice
  - Handles broker lifecycle and state notifications
  - Connects to yijinjing event system

- **BrokerService**: Broker-specific service implementations
  - State management (`BrokerState`)
  - I/O device access
  - Configuration management

- **Client/Trader/MarketData**: Specialized broker communication interfaces

**File Locations**:
- `broker/broker.h/.cpp` - Core broker abstractions
- `broker/client.h/.cpp` - Broker client interface
- `broker/trader.h/.cpp` - Trading interface
- `broker/marketdata.h/.cpp` - Market data interface

### 3. BOOK Module
**Location**: `book/`

**Purpose**: Accounting and position management system

**Key Classes**:
- **Book**: Core data structure containing:
  - `Asset` - Account asset information
  - `PositionMap` - Long/short positions by instrument
  - `OrderMap` - Active orders
  - `TradeMap` - Executed trades
  - Position and frozen price calculations

- **Bookkeeper**: Multi-account book management
  - Maintains books for multiple accounts
  - Applies accounting rules
  - Asset-specific calculations

**Accounting Modules** (`book/accounting/`):
- `stock.hpp` - Stock accounting
- `future.hpp` - Futures accounting
- `crypto.hpp` - Cryptocurrency accounting
- `bond.hpp` - Bond accounting
- `repo.hpp` - Repo accounting

**File Locations**:
- `book/book.h/.cpp` - Core book data structure
- `book/bookkeeper.h/.cpp` - Multi-book management
- `book/accounting.cpp` - Accounting engine

### 4. SERVICE Module
**Location**: `service/`

**Purpose**: Framework-level services

**Key Classes**:
- **Ledger**: Global state management service
  - Consolidates all account books
  - Maintains broker state map
  - Provides unified position view
  - Inherits from yijinjing apprentice

- **Bar**: OHLCV data aggregation service
  - Processes tick data into bars
  - Multiple timeframe support

**File Locations**:
- `service/ledger.h/.cpp` - Global ledger service
- `service/bar.cpp` - Bar data aggregation

### 5. BASKETORDER Module
**Location**: `basketorder/`

**Purpose**: Advanced multi-instrument order management

**Key Classes**:
- **BasketOrderEngine**: Manages complex multi-leg orders
  - Basket order state tracking
  - Individual order coordination
  - State restoration capabilities

**Data Structures**:
- `BasketMap` - Basket definitions
- `BasketInstrumentMap` - Basket components
- `BasketOrderStateMap` - Order execution states

**File Locations**:
- `basketorder/basketorderengine.h/.cpp` - Main basket engine
- `basketorder/basketorder.h/.cpp` - Basket order types

### 6. UTIL Module
**Location**: `util/`

**Purpose**: Common utilities and type definitions

Contains shared utilities, helper functions, and common type definitions used across the wingchun framework.

## Data Flow Architecture

### Event-Driven Processing
The wingchun framework follows an event-driven architecture built on top of the yijinjing time-series database:

1. **Market Data Flow**:
   - Market data arrives via broker connections
   - Processed through yijinjing event system
   - Delivered to subscribed strategies

2. **Order Flow**:
   - Strategies submit orders via Context
   - Orders flow through broker abstraction
   - Executions update books and positions

3. **State Management**:
   - All state changes persist to yijinjing
   - Ledger service maintains global state
   - Books track account-specific state

### Integration Points

**Yijinjing Integration**:
- All major components inherit from `yijinjing::practice::apprentice`
- Event-driven processing with nanosecond precision
- Persistent state management

**Longfist Integration**:
- Uses longfist data types for financial data
- Consistent data format across all components
- Serialization support for persistence

## Key Design Patterns

### 1. **Apprentice Pattern**
Most components inherit from `yijinjing::practice::apprentice` providing:
- Event-driven lifecycle management
- Automatic state persistence
- Low-latency message processing

### 2. **Service Abstraction**
Broker functionality split into:
- **Vendor**: Framework integration
- **Service**: Implementation-specific logic

### 3. **Book-keeping Pattern**
Clear separation between:
- **Book**: Raw data structure
- **Bookkeeper**: Business logic and rules
- **Accounting**: Asset-specific calculations

### 4. **Context Pattern**
Strategy execution isolated through Context interface providing:
- Controlled access to framework services
- Timer and subscription management
- Order and account lifecycle

## Dependencies

### Internal Dependencies
- **yijinjing**: Time-series database and event system
- **longfist**: Financial data type definitions
- **RxCpp**: Reactive programming for event handling

### Component Dependencies
- Strategy Context → Broker Client, Book Bookkeeper
- Broker Service → yijinjing apprentice
- Ledger → Bookkeeper, Broker Client
- BasketOrder Engine → yijinjing apprentice

## Performance Characteristics

### Ultra-Low Latency Design
- Nanosecond-precision timestamps
- Zero-copy message passing via yijinjing
- Memory-mapped data structures
- Event-driven processing

### Scalability Features
- Multi-account support via Bookkeeper
- Parallel strategy execution
- Efficient state management
- Basket order coordination

## Summary

The wingchun framework provides a comprehensive strategy execution environment optimized for ultra-low latency quantitative trading. Its modular architecture separates concerns while maintaining tight integration through the yijinjing event system, enabling both simple and complex trading strategies to execute with microsecond-level precision.