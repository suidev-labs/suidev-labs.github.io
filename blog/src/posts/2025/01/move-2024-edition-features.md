---
title: "Move 2024 Edition: New Features and Migration Guide"
date: 2025-01-08
categories:
  - Move
  - Tutorials
tags:
  - move
  - sui
  - language-features
  - migration
excerpt: "Explore the new features in Move 2024 edition including method syntax, positional fields, loop labels, and how to migrate your existing packages."
---

The Move 2024 edition brings significant quality-of-life improvements for developers. This guide covers the new features and how to migrate existing packages.

## Enabling Move 2024

Update your `Move.toml`:

```toml
[package]
name = "my_package"
version = "1.0.0"
edition = "2024"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/mainnet" }
```

## New Features

### 1. Method Syntax

The biggest change: you can now call functions as methods on types:

```move
// Before (2023)
use sui::coin;
let value = coin::value(&my_coin);

// After (2024)
let value = my_coin.value();
```

Define methods using the `use fun` syntax:

```move
module example::token {
    public struct Token has key, store {
        id: UID,
        balance: u64,
    }

    // Declare as method
    public use fun get_balance as Token.balance;

    public fun get_balance(token: &Token): u64 {
        token.balance
    }
}

// Usage
let bal = my_token.balance();
```

### 2. Positional Struct Fields

Structs can now have unnamed positional fields:

```move
// Before: named fields only
public struct Wrapper {
    inner: u64,
}

// After: positional fields
public struct Wrapper(u64);

// Usage
let w = Wrapper(42);
let inner = w.0; // access by position
```

Useful for simple wrapper types:

```move
public struct Balance(u64);
public struct Timestamp(u64);
public struct Percentage(u64);
```

### 3. Index Syntax

Access vector and other indexable types with brackets:

```move
// Before
let item = *vector::borrow(&vec, 0);
*vector::borrow_mut(&mut vec, 0) = 42;

// After
let item = vec[0];
vec[0] = 42;
```

Works with custom types implementing index methods:

```move
public struct Map<K, V> has store {
    // ...
}

public use fun get as Map.index;
public use fun get_mut as Map.index_mut;

public fun get<K, V>(map: &Map<K, V>, key: &K): &V { /* ... */ }
public fun get_mut<K, V>(map: &mut Map<K, V>, key: &K): &mut V { /* ... */ }

// Usage
let value = map[&key];
map[&key] = new_value;
```

### 4. Loop Labels and Break with Value

Named loops and break expressions:

```move
// Loop labels
let result = 'outer: loop {
    let mut i = 0;
    loop {
        if condition {
            break 'outer 42; // break outer loop with value
        };
        if other_condition {
            break; // break inner loop
        };
        i = i + 1;
    };
};

// While loops with labels
'search: while (i < len) {
    if found {
        break 'search;
    };
    i = i + 1;
};
```

### 5. Automatic Referencing

The compiler now automatically adds `&` and `&mut` in many cases:

```move
public fun process(data: &Data) { /* ... */ }

let my_data = Data { /* ... */ };

// Before: explicit reference required
process(&my_data);

// After: automatic referencing
process(my_data); // compiler adds & automatically
```

### 6. Public(package) Visibility

New visibility level for package-internal functions:

```move
// Only callable within the same package
public(package) fun internal_helper() {
    // ...
}
```

## Migration Guide

### Step 1: Update Move.toml

```toml
edition = "2024"
```

### Step 2: Run the Migrator

```bash
sui move migrate
```

This automatically converts:
- `friend` declarations to `public(package)`
- Suggests method syntax opportunities

### Step 3: Manual Updates (Optional)

Adopt new syntax gradually:

```move
// Convert coin operations
let value = coin::value(&my_coin);  // old
let value = my_coin.value();         // new

// Convert vector access
let item = vector::borrow(&v, i);    // old
let item = &v[i];                     // new
```

### Step 4: Test Thoroughly

```bash
sui move test
```

## Breaking Changes

- **`friend` keyword deprecated**: Use `public(package)` instead
- **Some implicit copies removed**: May need explicit `copy` in rare cases

## Compatibility

- 2024 packages can depend on 2023 packages
- 2023 packages cannot use 2024 features
- No runtime differences—only syntax changes

## Best Practices

1. **Migrate new packages immediately**: Start fresh with 2024
2. **Migrate existing packages gradually**: No rush if stable
3. **Use method syntax for clarity**: `coin.value()` reads better
4. **Prefer positional fields for wrappers**: `Amount(100)` is cleaner

## Conclusion

Move 2024 edition is a significant step forward for developer experience. The method syntax alone makes code much more readable. Start using it in new projects today!

Resources:
- [Move 2024 RFC](https://github.com/MystenLabs/sui/blob/main/docs/move-2024-migration.md)
- [Sui Move Documentation](https://docs.sui.io/concepts/sui-move-concepts)
