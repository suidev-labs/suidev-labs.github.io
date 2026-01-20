---
title: "Building an AMM on Sui: From Theory to Implementation"
date: 2024-06-10
categories:
  - DeFi
  - Tutorials
tags:
  - amm
  - defi
  - move
  - liquidity
excerpt: "A practical guide to building a constant product AMM (Automated Market Maker) on Sui, covering the math, Move implementation, and testing."
---

Automated Market Makers revolutionized DeFi by replacing order books with algorithmic pricing. In this tutorial, we'll build a constant product AMM similar to Uniswap v2, optimized for Sui's object model.

## The Math Behind AMMs

The constant product formula is elegantly simple:

```
x * y = k
```

Where:
- `x` = reserve of token A
- `y` = reserve of token B
- `k` = constant product (invariant)

When swapping `Δx` tokens in, you receive `Δy` tokens out:

```
(x + Δx) * (y - Δy) = k
Δy = y - k/(x + Δx)
Δy = y * Δx / (x + Δx)
```

## Project Structure

```
amm/
├── Move.toml
├── sources/
│   ├── pool.move
│   ├── lp_token.move
│   └── math.move
└── tests/
    └── pool_tests.move
```

## Core Types

First, define our pool and LP token:

```move
module amm::pool {
    use sui::balance::{Self, Balance};
    use sui::coin::{Self, Coin};

    /// The liquidity pool
    public struct Pool<phantom A, phantom B> has key {
        id: UID,
        reserve_a: Balance<A>,
        reserve_b: Balance<B>,
        lp_supply: u64,
        fee_bps: u64, // basis points (e.g., 30 = 0.3%)
    }

    /// LP token representing pool share
    public struct LPToken<phantom A, phantom B> has key, store {
        id: UID,
        amount: u64,
    }
}
```

## Creating a Pool

```move
public fun create_pool<A, B>(
    coin_a: Coin<A>,
    coin_b: Coin<B>,
    fee_bps: u64,
    ctx: &mut TxContext
): LPToken<A, B> {
    let amount_a = coin::value(&coin_a);
    let amount_b = coin::value(&coin_b);

    assert!(amount_a > 0 && amount_b > 0, EZeroLiquidity);

    // Initial LP tokens = sqrt(amount_a * amount_b)
    let lp_amount = math::sqrt(amount_a * amount_b);

    let pool = Pool<A, B> {
        id: object::new(ctx),
        reserve_a: coin::into_balance(coin_a),
        reserve_b: coin::into_balance(coin_b),
        lp_supply: lp_amount,
        fee_bps,
    };

    transfer::share_object(pool);

    LPToken<A, B> {
        id: object::new(ctx),
        amount: lp_amount,
    }
}
```

## The Swap Function

```move
public fun swap_a_for_b<A, B>(
    pool: &mut Pool<A, B>,
    coin_in: Coin<A>,
    min_out: u64,
    ctx: &mut TxContext
): Coin<B> {
    let amount_in = coin::value(&coin_in);
    assert!(amount_in > 0, EZeroInput);

    let reserve_a = balance::value(&pool.reserve_a);
    let reserve_b = balance::value(&pool.reserve_b);

    // Calculate output with fee
    let amount_in_with_fee = amount_in * (10000 - pool.fee_bps);
    let numerator = amount_in_with_fee * reserve_b;
    let denominator = (reserve_a * 10000) + amount_in_with_fee;
    let amount_out = numerator / denominator;

    assert!(amount_out >= min_out, ESlippageExceeded);

    // Update reserves
    balance::join(&mut pool.reserve_a, coin::into_balance(coin_in));
    let balance_out = balance::split(&mut pool.reserve_b, amount_out);

    coin::from_balance(balance_out, ctx)
}
```

## Adding Liquidity

```move
public fun add_liquidity<A, B>(
    pool: &mut Pool<A, B>,
    coin_a: Coin<A>,
    coin_b: Coin<B>,
    ctx: &mut TxContext
): LPToken<A, B> {
    let amount_a = coin::value(&coin_a);
    let amount_b = coin::value(&coin_b);

    let reserve_a = balance::value(&pool.reserve_a);
    let reserve_b = balance::value(&pool.reserve_b);

    // Calculate LP tokens to mint (proportional to contribution)
    let lp_amount = math::min(
        (amount_a * pool.lp_supply) / reserve_a,
        (amount_b * pool.lp_supply) / reserve_b
    );

    balance::join(&mut pool.reserve_a, coin::into_balance(coin_a));
    balance::join(&mut pool.reserve_b, coin::into_balance(coin_b));
    pool.lp_supply = pool.lp_supply + lp_amount;

    LPToken<A, B> {
        id: object::new(ctx),
        amount: lp_amount,
    }
}
```

## Testing

```move
#[test]
fun test_swap() {
    use sui::test_scenario;

    let admin = @0x1;
    let mut scenario = test_scenario::begin(admin);

    // Create pool with 1000:1000 ratio
    test_scenario::next_tx(&mut scenario, admin);
    {
        let coin_a = coin::mint_for_testing<COIN_A>(1000, ctx(&mut scenario));
        let coin_b = coin::mint_for_testing<COIN_B>(1000, ctx(&mut scenario));
        let lp = create_pool(coin_a, coin_b, 30, ctx(&mut scenario));
        transfer::public_transfer(lp, admin);
    };

    // Swap 100 A for B
    test_scenario::next_tx(&mut scenario, admin);
    {
        let mut pool = test_scenario::take_shared<Pool<COIN_A, COIN_B>>(&scenario);
        let coin_in = coin::mint_for_testing<COIN_A>(100, ctx(&mut scenario));

        let coin_out = swap_a_for_b(&mut pool, coin_in, 0, ctx(&mut scenario));

        // With 0.3% fee: ~90 tokens out
        assert!(coin::value(&coin_out) > 89 && coin::value(&coin_out) < 91, 0);

        coin::burn_for_testing(coin_out);
        test_scenario::return_shared(pool);
    };

    test_scenario::end(scenario);
}
```

## Gas Optimization Tips

1. **Minimize storage writes**: Batch reserve updates
2. **Use u64 math**: Avoid u128 when possible
3. **Cache values**: Read reserves once, not multiple times

## Next Steps

This basic AMM can be extended with:

- Multi-hop routing
- Concentrated liquidity (Uniswap v3 style)
- Oracle integration (TWAP)
- Governance and fee distribution

Check out our GitHub for the complete implementation with all edge cases handled.
