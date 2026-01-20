---
title: "Sui DeFi Ecosystem: A 2024 Overview"
date: 2024-09-05
categories:
  - DeFi
  - Ecosystem
tags:
  - sui
  - defi
  - ecosystem
  - protocols
excerpt: "An overview of the growing Sui DeFi ecosystem, covering major protocols, TVL trends, and what makes Sui unique for decentralized finance."
---

The Sui DeFi ecosystem has grown significantly since mainnet launch. This overview covers the major protocols, unique features, and opportunities for builders.

## Ecosystem Snapshot

As of late 2024, the Sui DeFi ecosystem includes:

| Category | Notable Protocols |
|----------|------------------|
| DEXs | Cetus, Turbos, Aftermath |
| Lending | Scallop, NAVI Protocol |
| Liquid Staking | Aftermath, Haedal |
| Derivatives | Bluefin |
| Stablecoins | USDC, USDT (native) |

## Why Sui for DeFi?

### 1. Parallel Transaction Execution

Sui's object model enables true parallelism. Different trading pairs on the same DEX can execute simultaneously:

```
Traditional DEX:          Sui DEX:
TX1 → TX2 → TX3          TX1 ─→
                         TX2 ─→  (parallel)
                         TX3 ─→
```

### 2. Sub-Second Finality

With ~400ms finality, Sui enables trading experiences impossible on slower chains:

- Real-time orderbook updates
- Instant position management
- Responsive liquidations

### 3. Low Transaction Costs

Average transaction costs on Sui remain consistently low, making high-frequency strategies viable.

## Major Protocol Deep Dives

### Cetus Protocol

Cetus is a concentrated liquidity DEX inspired by Uniswap v3:

- **Concentrated Liquidity**: LPs provide liquidity in specific price ranges
- **Multiple Fee Tiers**: 0.01%, 0.05%, 0.25%, 1%
- **Integration SDK**: Easy integration for other protocols

```move
// Cetus position example
public struct Position has key, store {
    id: UID,
    pool_id: ID,
    tick_lower: I32,
    tick_upper: I32,
    liquidity: u128,
}
```

### Scallop Lending

Scallop provides isolated lending markets with:

- **Isolated Markets**: Risk is contained per asset
- **Dynamic Interest Rates**: Utilization-based curves
- **sCoins**: Interest-bearing receipt tokens

### NAVI Protocol

NAVI focuses on capital efficiency:

- **Cross-collateral**: Use multiple assets as collateral
- **Flash Loans**: Single-transaction uncollateralized loans
- **Leverage Vaults**: Automated leveraged positions

## Building on Sui DeFi

### Composability Pattern

Sui's PTB (Programmable Transaction Blocks) enable powerful composability:

```typescript
const tx = new TransactionBlock();

// 1. Borrow from Scallop
const borrowed = tx.moveCall({
  target: '0xscallop::borrow',
  arguments: [pool, amount],
});

// 2. Swap on Cetus
const swapped = tx.moveCall({
  target: '0xcetus::swap',
  arguments: [borrowed, minOut],
});

// 3. Provide liquidity on Aftermath
tx.moveCall({
  target: '0xaftermath::add_liquidity',
  arguments: [swapped],
});

// All in one transaction!
await client.signAndExecuteTransactionBlock({ transactionBlock: tx });
```

### Integration Checklist

When integrating with Sui DeFi protocols:

1. **Check package versions**: Protocols upgrade frequently
2. **Handle shared object contention**: Retry on conflicts
3. **Test on devnet first**: Main networks have real value at stake
4. **Monitor events**: Use Sui's event system for tracking

## Opportunities

### Underserved Areas

- **Options/Structured Products**: Limited options protocols
- **Cross-chain Bridges**: Native Sui bridges still maturing
- **RWA Integration**: Real-world assets tokenization
- **Advanced Orderbooks**: Full CLOB implementations

### Developer Resources

- [Sui Documentation](https://docs.sui.io)
- [Move Book](https://move-book.com)
- [Sui Discord](https://discord.gg/sui)
- Protocol-specific docs and SDKs

## Conclusion

Sui's DeFi ecosystem is rapidly maturing with solid fundamentals. The combination of parallel execution, fast finality, and a growing protocol base creates opportunities for both users and builders.

Follow us for protocol-specific deep dives and integration tutorials.
