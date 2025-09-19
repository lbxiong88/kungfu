# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kungfu (功夫) is an open-source quantitative trading execution system designed for ultra-low latency trading. It supports both Python 3 and C++ strategy development with microsecond-level system response times and nanosecond-precision data storage.

### Core Architecture

**Backend Core (C++)**
- `longfist` - Financial data format definitions with serialization support for C++/Python/JavaScript/SQLite
- `yijinjing` - Ultra-low latency time-series memory database with nanosecond precision for trading data
- `wingchun` - Strategy execution engine providing real-time account and position maintenance

**Strategy Interfaces**
- C++: Uses RxCpp for reactive event processing of trading data
- Python: Native numpy/pandas environment for quantitative analysis

**Frontend UI**
- Electron-based cross-platform desktop application
- Vue.js UI framework for trading interface

### Repository Structure

This is a Lerna-managed monorepo with yarn workspaces:

- `framework/` - Core framework components
  - `core/` - C++ core library with Node.js bindings
  - `api/` - JavaScript/TypeScript API
  - `app/` - Electron desktop application
  - `cli/` - Command-line interface
- `extensions/` - Broker integrations (sim, xtp)
- `examples/` - Strategy examples in Python and C++
- `developer/` - SDK and development toolchain
- `artifact/` - Final packaged application

## Development Commands

### Build System

Primary build commands (run from project root):
```bash
# Full build process
yarn install --frozen-lockfile
yarn build
yarn package

# Clean rebuild
yarn rebuild
yarn package

# Clean temporary files
yarn clean
```

### Development Commands

```bash
# Run development server with webpack
yarn dev

# Run application in development mode
yarn app

# Run CLI tools
yarn cli

# Format code
yarn format
```

### Core-Specific Commands

```bash
# Core library builds
yarn build:core
yarn rebuild:core

# Python environment management
yarn poetry:clear
yarn poetry:lock

# Development tools
yarn workspace @kungfu-trader/kungfu-core kfc    # Core CLI
yarn workspace @kungfu-trader/kungfu-core kfs    # Framework CLI
```

### Individual Component Commands

```bash
# Build specific components
yarn build:app
yarn build:cli
yarn build:core

# Package application
yarn package:app
```

## Technology Stack

**Languages**: C++20, Python 3.9, TypeScript/JavaScript, Vue.js 3
**Build Tools**: CMake, yarn workspaces, Lerna, cmake-js
**Python**: pipenv/poetry for dependency management
**Desktop**: Electron 19.x
**Testing**: Cypress (for API testing)

## Development Environment Requirements

- C++20 compatible compiler
- CMake (>=3.15)
- Node.js (^14.x)
- yarn (^1.x)
- Python 3.9
- pipenv (>=2023.9.1)

## Key Configuration Files

- `lerna.json` - Monorepo version management
- `package.json` - Root workspace configuration
- `framework/core/package.json` - Core library with Python bindings
- `artifact/package.json` - Final application packaging

## Strategy Development

**Python Strategies**: Located in `examples/strategy-python-*`
- Use `pyproject.toml` for Python package management
- Import kungfu APIs for trading functionality

**C++ Strategies**: Located in `examples/strategy-cpp-*`
- Use CMake build system
- Link against kungfu core libraries

## Important Notes

- This is a financial trading system - security and precision are critical
- Git repository information is required for builds (use `git clone`, not archive downloads)
- Build artifacts are stored in `$HOME/.conan`, `$HOME/.cmake-js`, and `$HOME/.virtualenvs`
- The system supports multiple broker connections via extensions
- All trading data is stored with nanosecond precision timestamps