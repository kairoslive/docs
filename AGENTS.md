# Documentation project instructions

## About this project

- This is the Kairos documentation site, built on [Mintlify](https://mintlify.com).
- Pages are `.mdx` files with YAML frontmatter; configuration lives in `docs.json`.
- The site was migrated from the in-app docs under `services/web/content/docs` in the
  [kairoslive/kairos](https://github.com/kairoslive/kairos) monorepo. That directory is
  the source of truth for prose; keep this site at parity with it.
- Use the Mintlify MCP server, `https://mcp.mintlify.com`, to edit content and settings
  via MCP, or edit the files directly and open a PR.

## Structure

- `introduction`, `quickstart`, `authentication` — top-level get-started pages.
- `concepts/`, `learn/`, `guides/`, `perpetuals/`, `external-execution/`, `trading/`,
  `compliance/` — the Documentation tab.
- `rest/`, `market-data/`, `rpc/`, `rfq/`, `websocket/`, `krisis/` — hand-written API
  guides in the API Reference tab.
- `api-reference/` — **generated** endpoint pages from the OpenAPI specs in `openapi/`.
  Do not edit by hand; they are regenerated on build.
- `openapi/*.yaml` — vendored OpenAPI 3.1 specs. `openapi/overlays/` holds Mintlify-only
  overlays applied to those specs (e.g. removing the Agora WebSocket from the REST ref).
- `scripts/sync-dynamic.mjs` — regenerates `openapi/*.yaml`, `trading/fees.mdx`,
  `compliance/geo-restrictions.mdx`, and `changelog.mdx` from live Kairos sources. Run
  manually with `node scripts/sync-dynamic.mjs`.

## Dynamic content

Fees, geo restrictions, and the OpenAPI references are **generated, not hand-edited**:

- Fees — live `fees.getFeeTiers` tier ladder (`trading/fees.mdx`).
- Geo restrictions — live `geo.getBlockedCountries` list + dot map
  (`compliance/geo-restrictions.mdx`).
- API reference — OpenAPI specs synced from `https://app.kairos.trade/openapi`.
- Changelog — live `changelog.list` entries with an RSS feed (`changelog.mdx`).

`.github/workflows/sync-dynamic.yml` runs daily and commits changes, which triggers a
Mintlify deploy. Edit `scripts/` / `scripts/templates/` rather than the generated pages.

## Style preferences

- Use active voice and second person ("you").
- Keep sentences concise — one idea per sentence.
- Sentence case for headings.
- Bold for UI elements: Click **Settings**.
- Code formatting for file names, commands, paths, and code references.
- Prefer Mintlify components: `<Note>`, `<Warning>`, `<Tip>`, `<CardGroup>`, `<Steps>`,
  `<Tabs>`, `<Frame>`.

## Content boundaries

- This is the **public** docs site. Do not publish internal engineering docs from the
  monorepo's `docs/` tree (runbooks, security assessments, plans, specs, migrations).
- Do not document admin-only endpoints or internal service topology.
