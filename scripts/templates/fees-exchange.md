## Exchange Fees

Venue fees are charged by the exchange, not by Kairos, and are on top of the
platform fee. Polymarket and Predict.fun charge **takers only** — a resting
maker order pays no exchange fee there. Kalshi is the exception.

### Polymarket

```text
fee = shares × rate × p × (1 − p)
```

`p` is the share price and `rate` is the market's category fee curve. The fee
peaks at `p = 0.50` and tapers toward both extremes, and the result is rounded
to five decimal places.

| Category                                   | Rate | Taker fee per 100 shares at 50¢ |
| ------------------------------------------ | ---- | ------------------------------- |
| Crypto                                     | 0.07 | $1.75                           |
| Sports, Economics, Culture, Weather, Other | 0.05 | $1.25                           |
| Finance, Politics, Mentions, Tech          | 0.04 | $1.00                           |
| Geopolitics                                | 0    | $0.00                           |

Markets with fees disabled charge nothing regardless of category. These rates
mirror Polymarket's published schedule and can change on their side.

<Warning>
**A resting Polymarket buy still needs balance headroom for a fee it may never
pay.** Polymarket's CLOB **reserves** the taker-fee estimate at placement even
for an order expected to rest. The fee quote reports this separately as the
venue reserve.
</Warning>

### Predict.fun

```text
fee = (feeRateBps / 10,000) × min(p, 1 − p) × shares
```

`feeRateBps` is per market and read from live market metadata. When it cannot
be resolved, the quote falls back to a 200 bps (2%) base and flags itself as an
estimate. Like Polymarket's curve, the fee peaks at `p = 0.50`.

### Kalshi

```text
fee = scale × contracts × p × (1 − p)
```

The `scale` depends on the market's series ticker — the part before the first
`-`. Unknown series fall back to Standard.

| Series tier                          | Maker scale | Taker scale | Taker fee per 100 contracts at 50¢ |
| ------------------------------------ | ----------- | ----------- | ---------------------------------- |
| Standard                             | 0           | 0.07        | $1.75                              |
| Non-standard (most sports and macro) | 0.07        | 0.0175      | $0.44                              |
| Index (S&P 500 / Nasdaq)             | 0           | 0.035       | $0.88                              |
| Fee-free series                      | 0           | 0           | $0.00                              |

> **On the non-standard series the inversion bites: the _maker_ pays the higher
> scale.** Resting an order there is the expensive side, not the cheap one.

> **Kalshi fee quotes are estimates.** Kalshi does not expose a fee API, so
> Kairos maintains this schedule by hand from Kalshi's published table. Confirm
> against Kalshi's published schedule for anything rate-sensitive.

## Fee Quotes

`GET /orders/fee-quote` prices a hypothetical order against the live book and
returns the platform fee, the exchange fee, the venue reserve, the total fee,
and the all-in cost — see [Fee Quote](/rest/orders#fee-quote). Fee quotes
are supported for `kalshi`, `polymarket`, and `predictfun`.

Quotes are marked as estimates: they price off a point-in-time book, and a
market order's realised average price (and therefore its fee) depends on what
the book looks like at execution.

For a live stream of quotes as you size an order, subscribe to
`subscribe_fee_quote` on the order-execution socket — see
[Fee Quote WebSocket](/websocket/fee-quote).

## Network Costs

Beyond exchange fees, on-chain venues can carry network costs and collateral
conversion steps that are not Kairos platform fees.

<Note>
**The fee quote's total cost covers the platform and exchange fees only** — it
does not include network or conversion costs.
</Note>
