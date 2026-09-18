#!/usr/bin/env node
// Regenerates the parts of the Kairos docs that reflect live configuration:
//   - openapi/*.yaml            (from app.kairos.trade/openapi)
//   - trading/fees.mdx          (from the public fees.getFeeTiers RPC)
//   - compliance/geo-restrictions.mdx (from geo.getBlockedCountries)
// Runs in CI (see .github/workflows/sync-dynamic.yml); safe to run locally.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const RPC = "https://rpc.kairos.trade/api/rpc";
const SPEC_BASE = "https://app.kairos.trade/openapi";
const SPECS = ["market-data-api", "data-api", "execution", "agora"];

const centroids = JSON.parse(
  readFileSync(join(ROOT, "scripts/data/country-centroids.json"), "utf8"),
);

async function getJSON(url) {
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  const body = await res.json();
  if (body.error) throw new Error(`${url} -> ${JSON.stringify(body.error)}`);
  return body.result?.data ?? body.result ?? body;
}

async function getText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  return res.text();
}

function write(relPath, content) {
  const abs = join(ROOT, relPath);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, content);
  console.log(`wrote ${relPath} (${content.length}b)`);
}

const money = (v) =>
  v === 0
    ? "$0"
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(v);

const bps = (v) => `${Number.isInteger(v) ? v : v.toFixed(2)} bps`;

function feeBpsAtPrice(tier, side, price) {
  const p = Math.min(1, Math.max(0, price));
  if (tier.feeModel === "flat") {
    return side === "maker" ? tier.makerFeeBps : tier.takerFeeBps;
  }
  if (tier.feeModel === "parabolic") {
    const edge = side === "maker" ? tier.makerFeeEdgeBps : tier.takerFeeEdgeBps;
    const center =
      side === "maker" ? tier.makerFeeCenterBps : tier.takerFeeCenterBps;
    return edge + 4 * (center - edge) * p * (1 - p);
  }
  const points = [
    ...(side === "maker" ? tier.makerFeeCurve : tier.takerFeeCurve),
  ].sort((a, b) => a.price - b.price);
  const first = points[0];
  const last = points[points.length - 1];
  if (p <= first.price) return first.feeBps;
  if (p >= last.price) return last.feeBps;
  const upperIndex = points.findIndex((point) => point.price >= p);
  const lower = points[upperIndex - 1];
  const upper = points[upperIndex];
  if (upper.price === lower.price) return upper.feeBps;
  const progress = (p - lower.price) / (upper.price - lower.price);
  return lower.feeBps + progress * (upper.feeBps - lower.feeBps);
}

function feeFormula(tier, side) {
  if (tier.feeModel === "flat") {
    return `${side === "maker" ? tier.makerFeeBps : tier.takerFeeBps} bps`;
  }
  if (tier.feeModel === "curve") {
    return "linear interpolation between stored control points";
  }
  const edge = side === "maker" ? tier.makerFeeEdgeBps : tier.takerFeeEdgeBps;
  const center =
    side === "maker" ? tier.makerFeeCenterBps : tier.takerFeeCenterBps;
  return `${edge} + 4 × (${center} − ${edge}) × p × (1 − p) bps`;
}

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const modelLabel = (m) =>
  m === "parabolic" ? "Parabolic" : m === "curve" ? "Piecewise curve" : "Flat";

const overrideLabel = (o) =>
  o.feeModel === "flat"
    ? `${o.makerFeeBps} maker / ${o.takerFeeBps} taker bps`
    : o.feeModel === "parabolic"
      ? `${o.makerFeeEdgeBps}→${o.makerFeeCenterBps} maker / ${o.takerFeeEdgeBps}→${o.takerFeeCenterBps} taker bps`
      : "price-sensitive maker and taker curves";

const REFERENCE_PRICES = [0.1, 0.25, 0.5, 0.75, 0.9];

function renderFees(tiers) {
  const sorted = [...tiers].sort((a, b) => a.sortOrder - b.sortOrder);
  const platform = readFileSync(
    join(ROOT, "scripts/templates/fees-platform.md"),
    "utf8",
  ).trimEnd();
  const exchange = readFileSync(
    join(ROOT, "scripts/templates/fees-exchange.md"),
    "utf8",
  ).trimEnd();
  const latest = sorted.reduce(
    (acc, t) => (t.updatedAt > acc ? t.updatedAt : acc),
    sorted[0]?.updatedAt ?? "",
  );

  const ladder = sorted
    .map(
      (t) =>
        `| [${t.displayName}](#${slugify(t.displayName)}) | ${money(t.minVolume7d)} | ${money(t.minVolume30d)} | ${modelLabel(t.feeModel)} | ${t.gasSponsored ? "Sponsored" : "User-paid"} |`,
    )
    .join("\n");

  const schedules = sorted
    .map((t) => {
      const rows = REFERENCE_PRICES.map((price) => {
        const maker = feeBpsAtPrice(t, "maker", price);
        const taker = feeBpsAtPrice(t, "taker", price);
        return `| ${Math.round(price * 100)}¢ | ${bps(maker)} | ${bps(taker)} | $${((100 * price * taker) / 10_000).toFixed(4)} |`;
      }).join("\n");
      const overrides = (t.exchangeOverrides ?? [])
        .map((o) => `| **${o.exchange}** | ${overrideLabel(o)} |`)
        .join("\n");
      return [
        `### ${t.displayName}`,
        "",
        `- **7-day volume** — ${money(t.minVolume7d)}`,
        `- **30-day volume** — ${money(t.minVolume30d)}`,
        `- **Network gas** — ${t.gasSponsored ? "Sponsored" : "Not sponsored"}`,
        `- **Maker rate** — \`${feeFormula(t, "maker")}\``,
        `- **Taker rate** — \`${feeFormula(t, "taker")}\``,
        overrides
          ? `\n| Exchange | Rate |\n| --- | --- |\n${overrides}\n`
          : "",
        "",
        "| Fill price | Maker rate | Taker rate | Taker fee on 100 shares |",
        "| --- | --- | --- | --- |",
        rows,
    ].join("\n");
    })
    .join("\n\n");

  return `---
title: "Fees"
description: "Kairos platform fee policy — live fee tiers, per-venue exchange fees, and fee quotes"
---

${platform}

## Live fee schedule

<Note>
  Rendered from the live \`fees.getFeeTiers\` configuration. Last schedule update: **${latest}**. Rates are configuration, not a fixed schedule — the fee quote shown before an order is authoritative.
</Note>

### Volume ladder

| Tier | 7-day volume | 30-day volume | Rate model | Gas |
| --- | --- | --- | --- | --- |
${ladder}

${schedules}

${exchange}
`;
}

function renderChangelog(data) {
  const entries = [...(data.entries ?? [])].sort((a, b) =>
    (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""),
  );
  const blocks = entries
    .map((e) => {
      const label = new Date(e.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      });
      const attrs = [`label=${JSON.stringify(label)}`];
      const desc = e.version ? `v${e.version}` : e.category;
      if (desc) attrs.push(`description=${JSON.stringify(String(desc))}`);
      const tags = [...new Set([e.category, ...(e.affectedAreas ?? [])].filter(Boolean))];
      if (tags.length) attrs.push(`tags={${JSON.stringify(tags)}}`);
      return `<Update ${attrs.join(" ")}>\n\n${(e.body ?? "").trim()}\n\n</Update>`;
    })
    .join("\n\n");

  return `---
title: "Changelog"
description: "Product updates and announcements across the Kairos APIs and app"
rss: true
---

${blocks}
`;
}

function renderGeo(data) {
  const countries = data.countries ?? [];
  const exchanges = data.exchanges ?? [];
  const globals = countries.filter((c) => c.globalBlocked);
  const specific = countries.filter((c) => !c.globalBlocked);
  const W = 720;
  const H = 360;
  const project = (lat, lng) => [
    ((lng + 180) / 360) * W,
    ((90 - lat) / 180) * H,
  ];

  const dots = [];
  for (const c of countries) {
    const geo = centroids[c.code];
    if (!geo) continue;
    const [x, y] = project(geo.lat, geo.lng);
    const blocked = c.globalBlocked
      ? "Global block — " + (c.globalReason || "restricted")
      : `${geo.name} — ${Object.entries(c.exchangeBlocks ?? {})
          .filter(([, b]) => b.blocked)
          .map(([id, b]) => `${id}: ${b.reason}`)
          .join(", ")}`;
    const color = c.globalBlocked ? "#ef4444" : "#f59e0b";
    dots.push(
      `  <g><title>${blocked}</title><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.2" fill="${color}" fill-opacity="0.9" stroke="#0a0a0f" stroke-width="0.6"/></g>`,
    );
  }

  const grid = [];
  for (let lng = -180; lng <= 180; lng += 30) {
    const [x] = project(0, lng);
    grid.push(
      `  <line x1="${x.toFixed(1)}" y1="0" x2="${x.toFixed(1)}" y2="${H}" stroke="#2a2a3a" stroke-width="0.5"/>`,
    );
  }
  for (let lat = -60; lat <= 60; lat += 30) {
    const [, y] = project(lat, 0);
    grid.push(
      `  <line x1="0" y1="${y.toFixed(1)}" x2="${W}" y2="${y.toFixed(1)}" stroke="#2a2a3a" stroke-width="0.5"/>`,
    );
  }

  const svg = `<svg width="100%" viewBox="0 0 ${W} ${H}" role="img" aria-label="Map of geo-restricted countries" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" rx="10" fill="#0a0a0f"/>
  ${grid.join("\n")}
${dots.join("\n")}
  <g transform="translate(14,${H - 46})">
    <rect width="360" height="36" rx="6" fill="#111113" stroke="#27272a"/>
    <circle cx="16" cy="18" r="4" fill="#ef4444"/><text x="28" y="22" fill="#a1a1aa" font-family="system-ui,sans-serif" font-size="11">Globally blocked</text>
    <circle cx="150" cy="18" r="4" fill="#f59e0b"/><text x="162" y="22" fill="#a1a1aa" font-family="system-ui,sans-serif" font-size="11">Exchange-specific block</text>
  </g>
</svg>`;

  const globalRows = globals
    .map((c) => `| ${centroids[c.code]?.name ?? c.code} | \`${c.code}\` | ${c.globalReason || "—"} |`)
    .join("\n");

  const specRows = specific
    .flatMap((c) =>
      Object.entries(c.exchangeBlocks ?? {})
        .filter(([, b]) => b.blocked)
        .map(
          ([id, b]) =>
            `| ${centroids[c.code]?.name ?? c.code} | \`${c.code}\` | ${exchanges.find((e) => e.id === id)?.name ?? id} | ${b.reason || "—"} |`,
        ),
    )
    .join("\n");

  return `---
title: "Geo Restrictions"
description: "Countries blocked from accessing Kairos exchanges — generated from the live gating configuration"
---

Kairos enforces geo restrictions at both the account level and the exchange level, so the list in force changes over time. Everything below is generated from the live \`geo.getBlockedCountries\` configuration.

${svg}

## Globally blocked countries

Accounts in these countries are blocked from every Kairos venue.

| Country | Code | Reason |
| --- | --- | --- |
${globalRows}

## Exchange-specific blocks

These countries can use Kairos, but are blocked from the listed venues.

| Country | Code | Exchange | Reason |
| --- | --- | --- | --- |
${specRows || "| — | — | — | — |"}

<Note>
  Exchanges currently evaluated for gating: ${exchanges.map((e) => e.name).join(", ") || "—"}. Access is denied **server-side** on every request and fails closed.
</Note>
`;
}

async function main() {
  for (const name of SPECS) {
    write(`openapi/${name}.yaml`, await getText(`${SPEC_BASE}/${name}.yaml`));
  }
  const tiers = await getJSON(`${RPC}/fees.getFeeTiers`);
  write("trading/fees.mdx", renderFees(tiers));
  const geo = await getJSON(`${RPC}/geo.getBlockedCountries`);
  write("compliance/geo-restrictions.mdx", renderGeo(geo));
  const changelog = await getJSON(`${RPC}/changelog.list`);
  write("changelog.mdx", renderChangelog(changelog));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
