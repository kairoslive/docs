# Kairos Docs

Public documentation for [Kairos](https://kairos.trade), built on
[Mintlify](https://mintlify.com). Published at `kairos-c5456474.mintlify.site`
(custom domain pending).

## Development

Install the Mintlify CLI and run a local preview from the repository root:

```bash
npm i -g mint
mint dev
```

Preview at `http://localhost:3000`.

Validate the build and check links before opening a PR:

```bash
mint validate
mint broken-links
```

## Dynamic content

These pages are generated from live Kairos services and should not be edited by hand:

| Page | Source |
| --- | --- |
| `openapi/*.yaml` | `https://app.kairos.trade/openapi/*.yaml` |
| `trading/fees.mdx` | `fees.getFeeTiers` on the public RPC (`rpc.kairos.trade`) |
| `compliance/geo-restrictions.mdx` | `geo.getBlockedCountries` on the public RPC |

Regenerate them with:

```bash
node scripts/sync-dynamic.mjs
```

`.github/workflows/sync-dynamic.yml` runs this daily and commits any changes, which
triggers a Mintlify deployment.
