---
title: "Getting Started with Sui Move: A Developer's Guide"
date: 2024-01-15
categories:
  - Move
  - Tutorials
tags:
  - sui
  - move
  - smart-contracts
  - beginners
excerpt: "Learn the fundamentals of Move programming on Sui. This guide covers installation, project setup, and writing your first smart contract."
---

Move is a resource-oriented programming language originally developed at Meta (formerly Facebook) for the Diem blockchain. Sui has adopted and extended Move with unique features like object-centric data model and parallel transaction execution.

## Prerequisites

Before diving in, ensure you have:

- Rust installed (1.70+)
- Git
- A code editor (VS Code with Move extension recommended)

## Installing the Sui CLI

The Sui CLI is your primary tool for Move development. Install it using cargo:

```bash
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch main sui
```

Verify the installation:

```bash
sui --version
```

## Creating Your First Project

Initialize a new Move project:

```bash
sui move new hello_sui
cd hello_sui
```

This creates the following structure:

```
hello_sui/
├── Move.toml
├── sources/
│   └── hello_sui.move
└── tests/
```

## Writing Your First Module

Open `sources/hello_sui.move` and add:

```move
module hello_sui::greeting {
    use std::string::{Self, String};

    public struct Greeting has key, store {
        id: UID,
        message: String,
    }

    public fun create_greeting(message: vector<u8>, ctx: &mut TxContext): Greeting {
        Greeting {
            id: object::new(ctx),
            message: string::utf8(message),
        }
    }

    public fun get_message(greeting: &Greeting): &String {
        &greeting.message
    }
}
```

## Key Concepts

### Objects and Ownership

In Sui Move, everything is an object. Objects can be:

- **Owned**: Belong to a specific address
- **Shared**: Accessible by anyone
- **Immutable**: Cannot be modified after creation

### Abilities

The `has key, store` syntax declares abilities:

- `key`: Can be stored as a top-level object
- `store`: Can be stored inside other objects
- `copy`: Can be copied
- `drop`: Can be dropped/destroyed

## Building and Testing

Build your project:

```bash
sui move build
```

Run tests:

```bash
sui move test
```

## Next Steps

Now that you have the basics, explore:

1. Object transfers and ownership
2. Entry functions and transactions
3. Events and indexing
4. Package publishing

Stay tuned for more deep dives into Sui Move development!
