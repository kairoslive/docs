Two separate charges can apply to a fill: the **Kairos platform fee**, set by your fee tier, and the **venue's own exchange fee**, set by the exchange. They are computed independently and reported separately. This page explains how each is calculated and where to read the live numbers.

<Warning>
**Never assume either charge is zero.** Price an order with the
[Fee Quote endpoint](/rest/orders#fee-quote), which returns both
components plus the all-in cost.
</Warning>

| Charge       | Set by                    | Basis                       | Where to read it                        |
| ------------ | ------------------------- | --------------------------- | --------------------------------------- |
| Platform fee | Kairos, via your fee tier | Basis points on notional    | `fees.getUserTier` / `fees.getFeeTiers` |
| Exchange fee | The venue                 | A per-venue formula (below) | Fee quote, or the venue's own schedule  |

## Kairos Platform Fee

Your platform fee uses the maker or taker schedule from the fee tier that
applies to you at fill time. A tier can use a flat rate:

```text
platform fee = notional × bps / 10,000
```

where `notional = fill quantity × fill price`. Maker and taker carry separate
rates, so a resting limit order and a marketable order on the same market can
be charged differently.

A curve tier instead stores ordered `{ price, feeBps }` control points for each
side. Kairos linearly interpolates the effective basis-point rate at the fill's
actual share price, then applies that rate to notional. Curves cover the complete
price range from `0` through `1`; the `makerFeeBps` and `takerFeeBps` fields on a
curve tier expose its peak rates for backwards-compatible displays. Read
`feeModel`, `makerFeeCurve`, and `takerFeeCurve` to price the full schedule.

A parabolic tier stores an edge rate and a center rate for each side. For a fill
price `p` between `0` and `1`, Kairos evaluates the exact symmetric schedule:

```text
effective bps = edge bps + 4 × (center bps − edge bps) × p × (1 − p)
```

The configured edge rate applies at `p = 0` and `p = 1`; the configured center
rate applies at `p = 0.50`. Read `makerFeeEdgeBps`, `makerFeeCenterBps`,
`takerFeeEdgeBps`, and `takerFeeCenterBps` when `feeModel` is `parabolic`.

### How volume tiers apply

Your rolling 7-day and 30-day matched volume determines your position on the
volume ladder. Tier changes take effect on the next fill, and volume tiers are
recomputed as your rolling volume changes.
