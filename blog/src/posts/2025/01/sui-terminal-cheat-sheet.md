---
title: "The Sui Developer's Terminal Cheat Sheet: 33 Essential Commands"
date: 2025-01-20
categories:
  - Tutorials
  - DeFi
tags:
  - sui
  - cli
  - curl
  - json-rpc
  - defi
excerpt: "33 curl and CLI commands for Sui developers—check balances, query DeFi protocols, monitor liquidations, and track whales from your terminal."
---

Your terminal is a powerful DeFi dashboard. These 33 commands let you query Sui state, monitor protocols, and track on-chain activity without touching a browser.

## Core: Account & Asset Management

### Check All Token Balances

```bash
sui client balance --with-coins
```

Get a breakdown of all tokens held by your active CLI address.

### Merge Gas Coins to Reduce Dust

```bash
sui client merge-coins --primary-coin $(sui client gas --json | jq -r '.[0].gasCoinId') --coin-to-merge $(sui client gas --json | jq -r '.[1].gasCoinId')
```

Combine multiple gas objects into one. Fewer objects = cleaner wallet.

### Query Specific Sui Objects

```bash
sui client object 0x84030d26d85eaa7035084a057f2f11f701b7e2e4eda87551becbc7c97505ece1 --json | jq '.content.fields'
```

Inspect any object (like a Suilend obligation) by its ID to see raw field data.

### Check Reference Gas Price

```bash
curl -s 'https://fullnode.mainnet.sui.io:443' \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"suix_getReferenceGasPrice","params":[]}' \
  | jq '{gas_price_mist: .result, gas_price_sui: (.result | tonumber / 1e9)}'
```

Query the network's current reference gas price in Mist and SUI.

## DeFi Protocol Intelligence

### Fetch Pyth Price Feeds

```bash
curl -s "https://hermes.pyth.network/v2/updates/price/latest?ids[]=23d7315113f5b1d3ba7a83604c44b94d79f4fd69af77f804fc7f920a6dc65744" \
  | jq -r '"$" + (.parsed[0].price.price | tonumber * pow(10; .parsed[0].price.expo | tonumber) | tostring)'
```

Get real-time SUI/USD price from Pyth's Hermes API, formatted as a dollar amount.

### Multi-Asset Pyth Fetch

```bash
curl -s 'https://hermes.pyth.network/v2/updates/price/latest?ids[]=23d7315113f5b1d3ba7a83604c44b94d79f4fd69af77f804fc7f920a6dc65744&ids[]=eaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a' \
  | jq '.parsed[] | {id: .id[0:8], price: (.price.price | tonumber * pow(10; .price.expo | tonumber))}'
```

Fetch multiple assets (SUI + USDC) in one call.

### Top 10 Cetus Pools

```bash
curl -s 'https://api-sui.cetus.zone/v2/sui/pools_info' \
  | jq '.data.pools[:10] | .[] | {name, price: .current_sqrt_price, tvl: .tvl_in_usd}'
```

Retrieve names, prices, and TVL for the top pools from Cetus V2 API.

### Scallop Market Rates & TVL

```bash
curl -s "https://sui.apis.scallop.io/api/market" \
  | jq '{tvl: .tvl, sui_supply_apy: .pools.sui.supplyApy, sui_borrow_apy: .pools.sui.borrowApy}'
```

Query Scallop's TVL and current supply/borrow APYs for SUI.

### Scan High-Risk Obligations

```bash
curl -s 'https://sui.apis.scallop.io/api/obligations?page=1&limit=100' \
  | jq '.data[] | select(.riskLevel >= 0.95) | {id, riskLevel, collateral, debt}'
```

Find Scallop obligations with risk level ≥ 95%—positions near liquidation.

## Advanced JSON-RPC & Monitoring

### Subscribe to Mempool Swap Events

```bash
sui client subscribe --filter '{"MoveEventType":"0x1eabed72c53feb3805120a081dc15963c204dc8d091542592abaf7a35689b2fb::pool::SwapEvent"}'
```

Watch live swaps in specific liquidity pools using the Sui CLI subscribe command.

### Track Whale Wallet Objects

```bash
sui client objects --address 0xWHALE_ADDRESS --json \
  | jq '.[] | select(.content.type | contains("Coin")) | {type: .content.type, balance: .content.fields.balance}'
```

Monitor a specific address's coin objects and balances with type filtering.

### Export Transaction History

```bash
sui client history --limit 50 --json \
  | jq '[.[] | {digest, timestamp, gasUsed: .effects.gasUsed.computationCost}]' > tx_history.json
```

Save the last 50 transactions to a file, including gas costs and timestamps.

### Real-Time Price Monitor with Alerts

```bash
while true; do
  P=$(curl -s "https://hermes.pyth.network/v2/updates/price/latest?ids[]=23d7315113f5b1d3ba7a83604c44b94d79f4fd69af77f804fc7f920a6dc65744" \
    | jq -r '.parsed[0].price.price | tonumber * 1e-8')
  echo "$(date +%T) SUI: \$$P"
  [ $(echo "$P < 1.49" | bc -l) -eq 1 ] && echo "🔴 LIQUIDATION ZONE" && say "liquidation"
  sleep 5
done
```

Poll Pyth every 5 seconds and trigger an alert (with macOS `say`) if price drops below a threshold.

### Query Recent Liquidation Events

```bash
curl -s -X POST https://fullnode.mainnet.sui.io:443 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"suix_queryEvents","params":[{"MoveEventModule":{"package":"0x6e641f0dca8aedab3101d047e96439178f16301bf0b57fe8745086ff1195eb3e","module":"liquidate"}},null,5,true]}' \
  | jq '.result.data[] | {tx: .id.txDigest, obligation: .parsedJson.obligation}'
```

Query the JSON-RPC for recent liquidation events from a lending protocol.

## Liquidator & Developer Tools

### Dry-Run Transactions

```bash
sui client dry-run <TX_BYTES> --json \
  | jq '{gasUsed: .effects.gasUsed, balanceChanges: .balanceChanges}'
```

Estimate gas consumption and predict balance changes before committing a transaction.

### Identify Top Liquidators

```bash
curl -s -X POST https://fullnode.mainnet.sui.io:443 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"suix_queryEvents","params":[{"MoveEventModule":{"package":"0x6e641f0dca8aedab3101d047e96439178f16301bf0b57fe8745086ff1195eb3e","module":"liquidate"}},null,50,true]}' \
  | jq '[.result.data[].parsedJson.liquidator] | group_by(.) | map({addr: .[0][0:16], count: length}) | sort_by(-.count)[:5]'
```

Find the most active liquidators by grouping and counting liquidation events.

### One-Shot On-Chain Scanner

```bash
npx tsx -e "import{SuiClient}from'@mysten/sui/client';const c=new SuiClient({url:'https://fullnode.mainnet.sui.io:443'});(async()=>{const e=await c.queryEvents({query:{MoveEventModule:{package:'0xefe8b36d5b2e43728cc323298626b83177803521d195cfb11e15b910e892fddf',module:'borrow'}},limit:50});const ids=[...new Set(e.data.map(x=>x.parsedJson?.obligation).filter(Boolean))];const o=await c.multiGetObjects({ids,options:{showContent:true}});o.filter(x=>x.data?.content?.fields?.liquidate_locked===false).forEach(x=>console.log('UNLOCKED:',x.data.objectId.slice(0,30)));})();"
```

Run an inline TypeScript script to query borrow events and identify unlocked obligations—no file needed.

### Watch Borrow Events

```bash
curl -s 'https://fullnode.mainnet.sui.io:443' \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"suix_queryEvents","params":[{"MoveEventType":"0xefe8b36d5b2e43728cc323298626b83177803521d195cfb11e15b910e892fddf::borrow::BorrowEvent"},null,20,true]}' \
  | jq '.result.data[] | {amount: .parsedJson.amount, asset: .parsedJson.asset | split("::") | last}'
```

Monitor large borrow events to spot new positions being opened.

## Quick Reference

| Task | Command |
|------|---------|
| SUI balance | `sui client balance` |
| Gas price | `suix_getReferenceGasPrice` |
| Pyth price | Hermes API + jq |
| Cetus pools | Cetus V2 API |
| Scallop TVL | Scallop API |
| Liquidations | `suix_queryEvents` |
| Whale tracking | `sui client objects --address` |

## Pro Tips

1. **Alias everything**: Add frequently-used commands to your `.bashrc`/`.zshrc`
2. **Pipe to `tee`**: Log output while watching: `command | tee -a log.txt`
3. **Use `watch`**: Repeat commands: `watch -n 30 'npx tsx scanner.ts'`
4. **Background jobs**: Run monitors in background: `npx tsx monitor.ts &`

## What's Missing?

These commands cover reads and monitoring. For writes (swaps, liquidations, deposits), you'll need:

- A funded wallet with the Sui CLI configured
- Transaction building with PTBs or the TypeScript SDK
- Proper error handling and gas estimation

That's a topic for another post.

---

*Bookmark this page. Your terminal is now a DeFi command center.*
