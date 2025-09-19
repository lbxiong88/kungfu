# Yijinjing Architecture Analysis

## Overview

Yijinjing (易筋经) is the ultra-low latency time-series memory database component of the Kungfu trading system. It provides nanosecond-precision data storage and retrieval specifically designed for financial trading applications. The name "Yijinjing" refers to a legendary martial arts technique for internal energy cultivation, reflecting the system's focus on internal performance optimization.

## Core Purpose

Ultra-low latency time-series memory database for financial trading data with nanosecond precision timestamp accuracy and microsecond-level system response times.

## Component Breakdown

### 1. Core Infrastructure Layer

#### **util/** - System Utilities
- **Memory Management**: Memory mapping utilities for direct hardware access
- **Hashing**: MurmurHash3 implementation for fast, collision-resistant hashing
- **Debugging**: Stack tracing and crash reporting for production diagnostics
- **OS Abstraction**: Cross-platform compatibility layer

#### **time.h** - Temporal Foundation
- **Nanosecond Precision**: Hardware-level timestamp generation
- **Trading Hours**: Market time zone and session management
- **Time Calculations**: Efficient temporal arithmetic operations

#### **common.h** - Core Abstractions
- **Resource Management**: Base classes for system resources
- **Event System**: Publisher/observer pattern implementation
- **RxCpp Integration**: Reactive programming framework bindings
- **Location System**: Universal addressing and identification

### 2. Journal System (Core Data Layer)

#### **journal/journal.h** - Memory Access Abstraction
- **Continuous Memory**: Seamless access across memory boundaries
- **Page Management**: Automatic page loading and unloading
- **Lazy Loading**: On-demand resource allocation
- **Multi-destination Support**: Concurrent writing to multiple targets

#### **journal/frame.h** - Atomic Data Unit
- **Memory Layout**: Header + data body structure
- **Timestamp Precision**: Generation and trigger time tracking
- **Source/Destination**: Message routing information
- **Type Safety**: Template-based data access

#### **journal/page.h** - Memory Page Management
- **Fixed-size Pages**: Predictable memory allocation
- **Memory Mapping**: Direct file system integration
- **Page Chaining**: Linked page navigation
- **Address Management**: Pointer arithmetic abstraction

#### **journal/reader.h** - Multi-source Reading
- **Journal Aggregation**: Reading from multiple sources simultaneously
- **Time-based Seeking**: Jump to specific timestamps
- **Event Streaming**: Continuous data flow generation
- **Subscription Management**: Dynamic source addition/removal

#### **journal/writer.h** - Thread-safe Writing
- **Template API**: Type-safe data operations
- **Atomic Operations**: Concurrent write safety
- **Publisher Integration**: Event notification system
- **Frame Management**: Memory allocation and lifecycle

#### **journal/assemble.h** - Journal Coordination
- **Multi-journal Operations**: Coordinated reading/writing
- **Synchronization**: Cross-journal timing alignment
- **Assembly Logic**: Data aggregation and ordering

### 3. Practice Layer (Application Framework)

#### **practice/hero.h** - Application Base Class
- **Event Processing**: Core event loop and handling
- **Writer Management**: Multiple destination writing
- **RxCpp Streams**: Reactive event processing
- **Time Control**: Begin/end time management
- **Location Tracking**: Component registration and discovery

#### **practice/master.h** - Central Coordinator
- **System Orchestration**: Overall system coordination
- **Location Management**: Component registration and discovery
- **Channel Management**: Communication pathway setup
- **Session Lifecycle**: Application session tracking
- **Timer Tasks**: Scheduled operation management
- **Trading Day Management**: Market session coordination

#### **practice/apprentice.h** - Client Applications
- **Master Registration**: Automatic system integration
- **Event Subscription**: Selective data reception
- **State Management**: Application-specific state tracking
- **Data Processing**: Business logic implementation

#### **practice/profile.h** - Performance Monitoring
- **Resource Tracking**: Memory and CPU utilization
- **Performance Metrics**: Latency and throughput measurement
- **Profiling Data**: Runtime performance analysis
- **Monitoring Integration**: System health reporting

### 4. I/O and Networking Layer

#### **io.h** - I/O Device Abstraction
- **Device Types**: Master, client, and console variants
- **Resource Management**: Connection lifecycle management
- **URL Factory**: Network endpoint generation
- **Socket Integration**: Low-level networking interface

#### **socket/** - Network Communication
- **Cross-platform Sockets**: epoll (Linux) / kqueue (macOS/BSD)
- **Asynchronous I/O**: Non-blocking network operations
- **Timeout Management**: Connection reliability
- **Protocol Abstraction**: Multiple transport protocols

#### **nanomsg/** - Inter-process Communication
- **Message Patterns**: Pub/sub, req/rep, pipeline patterns
- **Protocol Handling**: Message serialization and routing
- **URL Management**: Network address abstraction
- **Error Handling**: Robust communication error recovery

### 5. Caching and Persistence Layer

#### **cache/backend.h** - Persistent Storage
- **SQLite Integration**: Relational data persistence
- **ORM Mapping**: Object-relational mapping layer
- **State Management**: Application state persistence
- **Profile Data**: Performance data storage
- **Session Data**: Historical session information

#### **cache/cached.h** - Memory Caching
- **Hot Data Management**: Frequently accessed data optimization
- **Cache Policies**: LRU and other eviction strategies
- **Memory Efficiency**: Optimal memory utilization
- **Cache Coherency**: Consistency across cache levels

#### **cache/runtime.h** - Runtime Optimization
- **Dynamic Caching**: Adaptive caching strategies
- **Performance Tuning**: Runtime optimization adjustments
- **Memory Pool**: Pre-allocated memory management
- **Resource Optimization**: Dynamic resource allocation

#### **cache/ringqueue.h** - Lock-free Data Structures
- **Atomic Operations**: Lock-free concurrent access
- **Producer/Consumer**: High-performance data exchange
- **Memory Barriers**: Hardware-level synchronization
- **Performance Critical**: Ultra-low latency operations

### 6. Session Management

#### **index/session.h** - Session Lifecycle
- **Session Tracking**: Application session management
- **Metadata Management**: Session-related information
- **Lifecycle Events**: Session start/stop/pause operations
- **Index Management**: Session data indexing and retrieval

## ASCII Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          YIJINJING ARCHITECTURE                     │
│                  (Ultra-Low Latency Trading Database)               │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   APPLICATION   │    │   APPLICATION   │    │   APPLICATION   │
│     LAYER       │    │     LAYER       │    │     LAYER       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        PRACTICE LAYER                               │
├─────────────────┬─────────────────┬─────────────────┬───────────────┤
│     MASTER      │     APPRENTICE  │      HERO       │    PROFILE    │
│  (Coordinator)  │   (Client App)  │  (Base Class)   │  (Metrics)    │
│                 │                 │                 │               │
│ • Locations     │ • Event Sub.    │ • Event Loop    │ • Performance │
│ • Channels      │ • Data Proc.    │ • Writers Map   │ • Resources   │
│ • Sessions      │ • State Mgmt    │ • RxCpp Stream  │ • Monitoring  │
│ • Timer Tasks   │ • Registration  │ • Time Control  │ • Profiling   │
└─────────────────┴─────────────────┴─────────────────┴───────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          I/O LAYER                                  │
├─────────────────┬─────────────────┬─────────────────┬───────────────┤
│   IO_DEVICE     │     SOCKET      │    NANOMSG      │   OBSERVER/   │
│                 │                 │                 │  PUBLISHER    │
│ • Master        │ • Epoll/Kqueue  │ • IPC Messages  │               │
│ • Client        │ • Cross-platform│ • Notifications │ • Event Pub   │
│ • Console       │ • Async I/O     │ • URL Factory   │ • Observation │
│ • URL Factory   │ • Timeout Mgmt  │ • Protocol Abs  │ • Wait/Notify │
└─────────────────┴─────────────────┴─────────────────┴───────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        JOURNAL LAYER                                │
├─────────────────┬─────────────────┬─────────────────┬───────────────┤
│     JOURNAL     │      READER     │      WRITER     │     FRAME     │
│  (Memory Abs)   │   (Multi-src)   │  (Thread-safe)  │ (Memory Unit) │
│                 │                 │                 │               │
│ • Continuous    │ • Multi-journal │ • Template API  │ • Header      │
│ • Memory Access │ • Time Seeking  │ • Atomic Ops    │ • Data Body   │
│ • Page Mgmt     │ • Event Stream  │ • Type Safety   │ • Timestamps  │
│ • Lazy Loading  │ • Subscription  │ • Publisher Int │ • Source/Dest │
└─────────────────┴─────────────────┴─────────────────┴───────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      STORAGE/CACHE LAYER                            │
├─────────────────┬─────────────────┬─────────────────┬───────────────┤
│     CACHE       │      BACKEND    │    RINGQUEUE    │     PAGE      │
│   (Memory)      │   (SQLite)      │  (Lock-free)    │  (Memory)     │
│                 │                 │                 │               │
│ • Ring Buffer   │ • State Persist │ • Atomic Ops    │ • mmap Files  │
│ • Hot Data      │ • Profile Data  │ • Producer/Cons │ • Fixed Size  │
│ • Runtime Opt   │ • Session Data  │ • Memory Barrier│ • Page Chain  │
│ • Cached Objs   │ • ORM Mapping   │ • Performance   │ • Address Mgmt│
└─────────────────┴─────────────────┴─────────────────┴───────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       UTILITY LAYER                                 │
├─────────────────┬─────────────────┬─────────────────┬───────────────┤
│      TIME       │      UTIL       │      HASH       │   STACKTRACE  │
│                 │                 │                 │               │
│ • Nanosecond    │ • Memory Map    │ • MurmurHash3   │ • Debug Info  │
│ • Precision     │ • OS Abstraction│ • 32/64-bit     │ • Error Track │
│ • Trading Hours │ • Path Utils    │ • Fast Hashing  │ • Crash Report│
│ • Time Zones    │ • String Utils  │ • Collision Res │ • Performance │
└─────────────────┴─────────────────┴─────────────────┴───────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    FOUNDATION LAYER                                  │
├─────────────────┬─────────────────┬─────────────────┬───────────────┤
│     COMMON      │      RXCPP      │    LONGFIST     │    LOCATION   │
│                 │                 │    (Types)      │               │
│ • Core Defs     │ • Event Stream  │ • Data Formats  │ • Identity    │
│ • Abstractions  │ • Reactive Prog │ • Type Safety   │ • Addressing  │
│ • Error Types   │ • Operators     │ • Serialization │ • Locator     │
│ • Base Classes  │ • Subscription  │ • Trading Types │ • Unique IDs  │
└─────────────────┴─────────────────┴─────────────────┴───────────────┘

FLOW DIRECTION:
┌─────┐  Write   ┌─────┐  Store   ┌─────┐  Persist  ┌─────┐
│Apps │ ──────► │Journ│ ──────► │Cache│ ────────► │Disk │
└─────┘         └─────┘         └─────┘           └─────┘
   ▲                               │                  │
   │              Read             │       Restore    │
   └───────────────────────────────┴──────────────────┘

KEY RELATIONSHIPS:
• Master ←→ Apprentice: Registration, coordination, lifecycle
• Hero → Writer/Reader: Data I/O operations
• Journal → Page → Frame: Memory hierarchy
• Cache ←→ Backend: Memory ↔ Persistent storage
• RxCpp: Event streaming throughout all layers
• Location: Universal addressing across components
```

## Key Design Patterns

### Event-Driven Architecture
- **RxCpp Integration**: Reactive programming streams flow through all layers
- **Publisher/Observer**: Decoupled event notification system
- **Event Filtering**: Type-safe event routing and processing
- **Asynchronous Processing**: Non-blocking event handling

### Memory-Mapped Storage
- **Direct Hardware Access**: Bypass kernel for maximum performance
- **Nanosecond Precision**: Hardware timestamp generation
- **Zero-Copy Operations**: Eliminate memory copying overhead
- **Memory Hierarchy**: Efficient page and frame management

### Master-Apprentice Pattern
- **Centralized Coordination**: Master orchestrates all system components
- **Distributed Clients**: Apprentices handle specific business logic
- **Registration System**: Dynamic component discovery and management
- **Lifecycle Management**: Coordinated startup and shutdown procedures

### Template-Based Type Safety
- **Compile-time Optimization**: Template metaprogramming for performance
- **Type-safe Operations**: Prevent runtime type errors
- **Generic Data Handling**: Uniform interface for all data types
- **Zero-overhead Abstractions**: Performance without runtime cost

### Multi-tier Caching
- **Memory Cache**: Ring buffers for ultra-fast access
- **Persistent Cache**: SQLite for durability
- **Cache Coherency**: Consistency across all cache levels
- **Adaptive Strategies**: Runtime cache optimization

## Critical Relationships

### Component Dependencies
1. **Applications → Hero**: All trading applications inherit from hero base class
2. **Master ↔ Apprentice**: Bidirectional registration and coordination
3. **Hero → Journal**: Applications use journal system for data I/O
4. **Journal → Page → Frame**: Memory hierarchy for data storage
5. **Cache ↔ Backend**: Memory and persistent storage synchronization

### Data Flow Patterns
1. **Write Path**: Apps → Writer → Journal → Cache → Disk
2. **Read Path**: Apps ← Reader ← Journal ← Cache ← Disk
3. **Event Flow**: Publisher → Observer → RxCpp → Event Handlers
4. **Network Flow**: Apps ↔ IO Device ↔ Socket ↔ Network

### Performance Optimization Points
1. **Lock-free Structures**: Ring queues and atomic operations
2. **Memory Mapping**: Direct file system integration
3. **Template Specialization**: Compile-time code generation
4. **Event Streaming**: Continuous data flow without polling
5. **Lazy Loading**: On-demand resource allocation

## Technical Specifications

### Performance Characteristics
- **Latency**: Microsecond-level system response
- **Precision**: Nanosecond timestamp accuracy
- **Throughput**: High-frequency trading capable
- **Concurrency**: Lock-free multi-threaded operations

### Memory Management
- **Page Size**: Fixed-size memory pages for predictability
- **Memory Mapping**: Direct file system integration
- **Zero-Copy**: Eliminate memory copying overhead
- **NUMA Awareness**: Non-uniform memory access optimization

### Network Architecture
- **Protocol Support**: Multiple transport protocols
- **Message Patterns**: Pub/sub, req/rep, pipeline
- **Asynchronous I/O**: Non-blocking network operations
- **Cross-platform**: Linux epoll, macOS/BSD kqueue

### Data Persistence
- **SQLite Integration**: Embedded database for metadata
- **Memory-mapped Files**: Direct file system access
- **Crash Recovery**: Robust error handling and recovery
- **Backup Strategies**: Multiple persistence layers

## Usage Patterns

### Application Development
1. Inherit from `hero` base class
2. Implement required virtual methods
3. Register with master for system integration
4. Use template APIs for type-safe data operations

### Performance Optimization
1. Use lock-free ring queues for critical paths
2. Leverage template specialization for compile-time optimization
3. Minimize memory allocations in hot paths
4. Implement proper cache strategies for data access

### System Integration
1. Configure master for central coordination
2. Set up apprentice instances for business logic
3. Establish communication channels between components
4. Monitor performance through profile system

## Security and Reliability

### Error Handling
- **Stack Traces**: Comprehensive crash reporting
- **Exception Safety**: RAII and exception-safe code
- **Resource Management**: Automatic cleanup and lifecycle management
- **Graceful Degradation**: System continues operating during partial failures

### Data Integrity
- **Atomic Operations**: Consistent data modifications
- **Transaction Safety**: All-or-nothing data operations
- **Checksum Validation**: Data corruption detection
- **Backup and Recovery**: Multiple recovery strategies

### Performance Monitoring
- **Real-time Metrics**: Live performance monitoring
- **Resource Tracking**: Memory and CPU utilization
- **Latency Analysis**: End-to-end timing measurements
- **Bottleneck Detection**: Performance issue identification

This architecture represents a sophisticated system optimized for the extreme performance requirements of high-frequency trading, with careful attention to both speed and reliability.