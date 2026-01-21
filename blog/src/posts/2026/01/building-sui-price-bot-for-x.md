---
title: "Building a SUI Price Bot for X: The Plan"
date: 2026-01-20
categories:
  - Projects
  - Tutorials
tags:
  - sui
  - twitter
  - bot
  - automation
excerpt: "I'm building a simple bot that posts SUI price updates to X every 3 hours, complete with trading signals. Here's the plan."
---

I'm building a SUI price bot that posts to X (Twitter) every 3 hours. The goal: automated price updates with a signal indicator, starting simple and evolving into something smarter.

## The Concept

Every 3 hours, the bot will:

1. Fetch the current SUI/USD price from an external API
2. Calculate price changes (3h, 24h)
3. Generate a signal (placeholder for now, real decision engine later)
4. Post to X

Example tweet format:

```text
SUI: $1.23 | 3h: -1.4% | Signal: WATCH | Next update in 3h
```

## Architecture

Keeping it minimal and extensible:

- **Price fetcher**: HTTP call to a crypto price API
- **Signal module**: Starts as fake/rule-based, swappable later
- **X poster**: Uses the X API v2 to publish tweets
- **Scheduler**: Cron job or GitHub Actions
- **State store**: Simple JSON file to track price history

## Placeholder Signal Logic

For v1, the signal is rule-based:

```python
def get_signal(change_3h):
    if change_3h <= -2:
        return "BUY THE DIP (experimental)"
    elif change_3h >= 2:
        return "TAKE PROFIT (experimental)"
    else:
        return "WATCH"
```

Later, I'll replace this with a real decision engine—moving averages, RSI, volatility regime detection, or something more sophisticated.

## X API: The Free Tier Reality

Good news: you can do this for free, with caveats.

The X Free tier allows:
- **500 posts/month** (write)
- **100 reads/month** (we won't need this—price data comes from external APIs)

Posting every 3 hours = ~240 posts/month. Fits comfortably under the cap.

### What You Need Before Writing Code

1. X account (I'm using `sui-dev`)
2. Verified email/phone + 2FA enabled
3. X Developer access via the [developer portal](https://developer.x.com)
4. Create a Project + App
5. Enable Write permissions
6. Generate and securely store credentials (API key/secret, access token/secret)
7. Pick a price data source (CoinGecko, Binance API, etc.)
8. Set up hosting + scheduler (cron on a VPS, or GitHub Actions)

## Can I Still Post Manually?

Yes. The bot authenticates via OAuth to the same account, but I can still post normally from the X mobile or web app. I'll give bot posts a consistent prefix like "SUI Update:" so they're distinguishable from my personal posts.

## Tech Stack

- **Language**: Python
- **Price API**: CoinGecko or similar (free tier)
- **X client**: `tweepy` or direct OAuth 2.0 calls
- **Scheduler**: Cron on my machine or GitHub Actions
- **Hosting**: Free—runs on my own box or a free CI runner

## Timeline

This should take under an hour to get a working v1:

1. Script to fetch price (~10 min)
2. Placeholder signal logic (~5 min)
3. X API integration (~20 min)
4. Cron setup (~10 min)
5. Testing (~15 min)

## What's Next

Once the basic bot is running:

1. Add price history tracking
2. Implement real technical indicators
3. Build out the decision engine with my state-binning edge approach
4. Maybe add chart images to tweets

Follow along as I build this out.

---

*This is part of my ongoing exploration of automated trading signals and DeFi tooling on Sui.*
