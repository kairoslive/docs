# Source: https://docs.kairos.trade/

# API Reference

Every public Kairos API in one place — 155 endpoints. Click a row for full details, or hit **Test** to fire a live request from the docked tester. Endpoints marked free (and everything on the Market Data API) work without any signup.

Authentication, scopes, and rate limits: [Market Data API](https://app.kairos.trade/docs/market-data/authentication) · [Data & Execution APIs](https://app.kairos.trade/docs/guides/authentication)

Machine-readable specs: [agora.yaml](https://app.kairos.trade/openapi/agora.yaml) · [data-api.yaml](https://app.kairos.trade/openapi/data-api.yaml) · [execution.yaml](https://app.kairos.trade/openapi/execution.yaml) · [market-data-api.yaml](https://app.kairos.trade/openapi/market-data-api.yaml) · [kairos.json](https://app.kairos.trade/openapi/kairos.json)

/

## Agora Auction House API

`https://agora.kairos.trade`13 endpoints

General(13)

GET`/healthz`Process healthfree

GET`/readyz`Owner readinessfree

POST`/v1/auctions`Create and open a private auction

GET`/v1/auctions`List only auctions visible to the authenticated principal

POST`/v1/auctions/preflight`Verify originator capacity without reserving it

GET`/v1/auctions/{auctionID}`Get a role-filtered private auction view

GET`/v1/auctions/{auctionID}/events`Get the caller's complete role-filtered audit timeline

POST`/v1/auctions/{auctionID}/cancel`Cancel an open auction

POST`/v1/auctions/{auctionID}/quotes`Submit or revise one firm executable price and quantity

DELETE`/v1/auctions/{auctionID}/quotes`Withdraw the caller's active quote

POST`/v1/auctions/{auctionID}/quotes/preflight`Verify the invited maker's price-specific quote capacity

GET`/v1/stream`Private WebSocket event stream

GET`/v1/invitations`Read the authenticated participant's durable private invitation inbox

## Kairos Data API

`https://data.kairos.trade`68 endpoints

The full Kairos data plane — markets, candles, trades, search, discover, sports, trader analytics, and PnL.

Perpetuals(2)

GET`/perpetuals/venues`List perpetual venue capabilitiesfree

GET`/perpetuals/instruments`Discover perpetual instrumentsfree

Markets(13)

GET`/markets/active`Enumerate active markets for a provider (MMC cursor page)

POST`/markets/details`Fetch market details (name/category/status/ids)

POST`/markets/batch-prices`Batch fetch current prices for multiple markets

GET`/markets/tick-size`Get a market's current valid tick grid

GET`/markets/metadata`Get full market metadata (rules, images, contract spec)

POST`/markets/metadata/batch`Batch fetch market metadata for multiple contracts

GET`/markets/outcomes`Get all sibling outcomes for the event containing a market

GET`/markets/crypto`Get 5m/15m/1h crypto up-or-down prediction markets for a window

GET`/markets/crypto/oracle-history`Get historical oracle (spot) prices for crypto chart pre-population

GET`/markets/crypto/ptb`Get Price-to-Beat (PTB) values for crypto up/down contracts

GET`/markets/equity/snapshot`Get last-known prices for equity/forex/commodity symbols

GET`/arb-bets/`Cross-venue arbitrage opportunities from the Arb Bets feed

GET`/market-clusters`Cross-venue cluster membership for a set of markets

Candles(2)

GET`/candles`Fetch OHLCV candles for a single contract

POST`/candles/batch`Fetch candles for up to 200 contracts in one request

Trades(4)

GET`/trades/kalshi`Proxy Kalshi's public trade-history API for one market

GET`/trades/polymarket`Proxy Polymarket's public trade-history API for one market

GET`/trades/history`Fetch normalized, Kairos-ingested trade history for a contract

GET`/trades/metrics`Fetch volume and outcome-pressure metrics for a contract

Trader Analytics(5)

GET`/trader-stats/pnl-history/{wallet_address}`Get a trader's realized-PnL time seriesfree

GET`/trader-stats/positions/{wallet_address}`Get a trader's open/closed positions and derived performance statsfree

GET`/trader-stats/trades/{wallet_address}`Get a trader's recent trade/fill historyfree

GET`/top-holders`Get top token holders for one or more markets

GET`/search-traders`Search for a trader's public profile by wallet address

PnL(4)

GET`/pnl/providers`List available PnL providers

GET`/pnl/{user_id}`Get merged PnL data for a user across one or more wallets/providers

GET`/pnl/hover/{provider_id}/{wallet}/{contract_id}`Live per-market PnL for a (wallet, market) pair

GET`/pnl/wallet-totals/{provider_id}/{wallet}`Wallet-wide PnL totals across all markets

Search(7)

GET`/search/markets`Search markets by text query

GET`/search/markets-and-events`Search both markets and events with combined relevance scoring

GET`/search/simple`Fast simple search for navbar/autocomplete overlay

GET`/search/resolve-url`Resolve a pasted Polymarket/Kalshi/predict.fun market or event URL

GET`/search/suggest`Autocomplete suggestions for search-as-you-type

GET`/search/screener`Find markets by what their book and tape are doing

GET`/search/screener/presets`One-click screens the screener offers

Discover(9)

GET`/api/markets/discover/v2`Paginated, filtered, event-grouped market list for the Discover page

GET`/api/markets/discover/v2/search-index`Compact full market list for client-side instant search

GET`/api/markets/discover/v2/ticker`Top markets for the discover page ticker bar

GET`/api/markets/discover/v2/breaking`Market pulse — latest trending movers for the Pulse rail

GET`/api/markets/discover/v2/expiring`Markets expiring soonest, with actionable prices

GET`/api/markets/discover/v2/subcategories`Available subcategories (subtopics) for a topic category, with live market counts

GET`/api/sports/kalshi-live`Kalshi sports events matched against live Polymarket games

GET`/api/markets/trending`Trending markets by 1h volume

GET`/api/markets/trending/ws`Trending market ids for a live-price subscription

Providers(3)

GET`/providers/configs`List all active provider configurationsfree

GET`/providers/api-access`List providers available to API-key callersfree

GET`/providers/configs/{provider_id}`Get a single provider configuration by idfree

Sports(19)

GET`/sports/trending-matched`Top live/upcoming sports markets matched across Polymarket and Kalshifree

GET`/sports/matching-markets`Cross-platform matching-market records for a set of game slugsfree

GET`/sports/kalshi-filters`Kalshi Sport -> Competition -> Scope taxonomyfree

GET`/sports/live-events`Active sports games with urgency scores and cross-provider prices

GET`/sports/event-markets`All markets for a single sports event

GET`/sports/kalshi-live-games`Currently-live Kalshi sports games (NHL/NBA/MLB/NFL+UFL/soccer/esports)

GET`/sports/poly-kalshi-pairings`Live game pairings between Polymarket and Kalshi

GET`/sports/catalog`Enriched catalog of sport categories and leagues

GET`/sports/upcoming-events`Upcoming (not-yet-live) sports events within a time window

GET`/sports/futures`Season/tournament futures markets across sports

GET`/sports/tournament-bracket`Tournament bracket with live cross-provider prices per tie

GET`/sports/game-markets`Cross-venue market families for a single game, grouped by section

GET`/sports/combo-markets`Catalog of combo-eligible Polymarket markets

GET`/sports/metadata`Synced sports teams and leagues reference data

GET`/matched-markets/enriched`Matched markets with identifiers, outcomes, and current reference prices

GET`/matched-markets`Paginated catalog of verified cross-venue matched markets

GET`/txodds/fixtures`List sports fixtures with live status and win probabilities

GET`/txodds/fixtures/{fixture_id}`Score, timeline, and possession metrics for one fixture

GET`/txodds/fixtures/{fixture_id}/timeseries`Win-probability history and market read for one fixture

## Kairos Order Execution API

`https://execution.kairos.trade`59 endpoints

Order entry, cancellation, fee quotes, and live position exposure across venues.

Synthetic Books(4)

POST`/v1/synthetics`Create or join a Synthetic Book definition

POST`/v1/synthetics/subscriptions/{subscription_id}/refresh`Refresh a Synthetic Book lease

DELETE`/v1/synthetics/subscriptions/{subscription_id}`Release a Synthetic Book lease

GET`/v1/synthetics/{synthetic_id}`Inspect a Synthetic Book definition

Orders(14)

POST`/orders`Submit a new order

GET`/orders`List the authenticated user's orders

GET`/orders/{order_id}`Get a single order by internal id

POST`/orders/{order_id}/cancel`Cancel a single order

POST`/orders/cancel-batch`Cancel a specific set of orders atomically at the selection layer

POST`/orders/cancel-all`Cancel all of the authenticated user's open orders on an exchange

GET`/orders/fee-quote`Get a combined platform + exchange fee quote for a prospective trade

GET`/positions/exposure`Get the authenticated user's current live position exposure

POST`/v2/orders/intent`Build an unsigned EIP-712 order payload for self-custody signing (step 1 of 2)

POST`/v2/orders/submit`Submit your externally-signed order signature (step 2 of 2)

GET`/health`Shallow liveness probefree

POST`/v2/onchain/intent`Build pinned unsigned on-chain transactions for self-signing (step 1 of 2)

POST`/v2/onchain/submit`Broadcast your externally-signed on-chain transactions (step 2 of 2)

GET`/exchanges/kalshi/balance`Get the authenticated user's Kalshi account balance (self-custody / offchain lane)

Exchanges(7)

GET`/exchanges`List the venue ids this deployment has registered

GET`/exchanges/{exchange_id}`Get a venue's display info and full capability set

GET`/exchanges/{exchange_id}/capabilities`Get a venue's capability set

GET`/exchanges/{exchange_id}/allowances`Read the on-chain allowances the venue needs from your wallet

POST`/exchanges/{exchange_id}/allowances`Set the on-chain allowances the venue needs

POST`/credentials/invalidate`Drop the service's cached copy of your venue credentials

POST`/exchanges/{exchange_id}/prepare-wallet`Sponsor gas and set the venue's required allowances on a wallet

Routing(6)

GET`/orders/route-quote`Price a size across both legs of an approved cross-venue market link

GET`/orders/route-fees`Get the per-leg fee model for an approved cross-venue market link

POST`/orders/route-buy`Buy a size split across both legs of an approved cross-venue market link

POST`/orders/route-close`Close a routed position across both legs of a market link

GET`/orders/routes`List the caller's routed parent orders and their legs

POST`/orders/market-links`Create (or preview) a self-serve cross-venue market link

Combo(6)

POST`/combo/quote`Price a Polymarket combo (parlay) without executing it

POST`/combo/execute`Buy a Polymarket combo (parlay) via the RFQ gateway

GET`/combo/positions`List the authenticated user's Polymarket combo positions

POST`/combo/cash-out-quote`Price a combo cash-out (SELL) without executing it

POST`/combo/cash-out`Sell an open combo position back to pUSD

POST`/combo/redeem`Redeem a resolved, winning combo back to pUSD

Onboarding(7)

POST`/exchanges/polymarket/enable-trading`Provision Polymarket CLOB credentials and set on-chain approvals

POST`/exchanges/polymarket/enable-imported-trading`Provision CLOB credentials for an imported Polymarket wallet

POST`/exchanges/predictfun/enable-trading`Set the on-chain approvals Predict.fun needs

POST`/exchanges/opinion/enable-trading`Provision Opinion credentials and set the USDT allowance

POST`/exchanges/kalshi/enable-trading`Connect your own Kalshi account by storing its API credentials

GET`/exchanges/predictfun/account`Get the caller's Predict.fun account profile

POST`/polymarket/check-resolution`Check whether a Polymarket market has resolved

Hyperliquid(4)

POST`/exchanges/hyperliquid/withdraw/prepare`Build the typed data for a Hyperliquid withdrawal (step 1 of 2)

POST`/exchanges/hyperliquid/withdraw`Submit a signed Hyperliquid withdrawal (step 2 of 2)

POST`/exchanges/hyperliquid/transfer/prepare`Build the typed data for a Hyperliquid spot↔perp transfer (step 1 of 2)

POST`/exchanges/hyperliquid/transfer`Submit a signed Hyperliquid spot↔perp transfer (step 2 of 2)

Deposit wallet(8)

POST`/exchanges/polymarket/deposit-wallet/onboard`Deploy the caller's Polymarket deposit wallet and set its trading approvals

POST`/exchanges/polymarket/deposit-wallet/sync-balances`Refresh Polymarket's cached balance/allowance view of the deposit wallet

POST`/exchanges/polymarket/deposit-wallet/eoa-balances`Read USDC and pUSD balances on the owner EOA

POST`/exchanges/polymarket/deposit-wallet/safe-balances`Read USDC, USDC.e and pUSD balances on the deposit wallet

POST`/exchanges/polymarket/deposit-wallet/nonce`Read the relayer nonce for the caller's next signed batch

POST`/exchanges/polymarket/deposit-wallet/submit-signed-batch`Forward a client-signed deposit-wallet batch to Polymarket's relayer

POST`/exchanges/polymarket/deposit-wallet/signed-batch-status`Poll the outcome of a relayed deposit-wallet batch

POST`/exchanges/polymarket/imported/relay-info`Read the relayer nonce (and GSN relay) for an imported Polymarket wallet

CTF(3)

POST`/exchanges/{exchange_id}/ctf/split`Split collateral into a complete outcome-token set

POST`/exchanges/{exchange_id}/ctf/merge`Merge a complete outcome-token set back into collateral

POST`/exchanges/{exchange_id}/redeem`Redeem winning outcome tokens after resolution

## Kairos Market Data API

`https://md.kairos.trade`free — no key required15 endpoints

Read-only prediction and perpetual market data across venues.

Markets(4)

GET`/v1/markets/{provider}/{market_id}`Get one market's metadata

POST`/v1/markets/batch`Fetch multiple markets by id, one provider at a time

POST`/v1/market-identifiers/resolve`Resolve venue-specific identifiers to canonical Kairos market ids

GET`/v1/markets`Paginate active markets for one provider

Resolutions(3)

GET`/v1/resolutions`Batch resolution fractions for up to 200 markets

GET`/v1/markets/{provider}/{market_id}/resolution`Current resolution lifecycle snapshot for one market

GET`/v1/markets/{provider}/{market_id}/resolution/events`Full resolution lifecycle timeline for one market

Marks(1)

GET`/v1/marks`Latest mark (last trade price) for up to 200 contract/token pairs

Candles(2)

GET`/v1/candles`Get a single OHLCV candle series

POST`/v1/candles/batch`Get up to 200 candle series in one request

Trades(2)

GET`/v1/trades`Recent trade tape for a contract

GET`/v1/trades/metrics`Aggregate trade volume/pressure metrics for a contract window

Perpetuals(1)

GET`/v1/perpetuals/{venue}/{instrument}/snapshot`Get a live perpetual market-data snapshot

Status(2)

GET`/health`Liveness probe

GET`/ready`Readiness probe

Need live data instead?

Orderbooks, trades, and prices stream over WebSocket — see the [market-data WebSocket](https://app.kairos.trade/docs/websocket/market-data-websocket) and [protobuf reference](https://app.kairos.trade/docs/websocket/protobuf-reference).