# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

An Alpine.js plugin exposing a single directive, `x-money`, that formats a
numeric value as currency via `Intl.NumberFormat` and writes the result to the
element's `innerText`.

## Commands

```shell
npm install
npm run build    # esbuild -> dist/cdn.min.js and dist/esm.min.js
```

There is no test suite, linter, or dev server. Manual testing is done with a
local `index.html` at the repo root — it is gitignored precisely for this, so
create one that loads `dist/cdn.min.js` plus Alpine from a CDN when you need to
verify behaviour in a browser.

## Architecture

Three layers, all tiny:

- `src/index.js` — the entire plugin. A default-exported function taking
  `Alpine` and registering the `money` directive.
- `builds/cdn.js` and `builds/module.js` — thin entry points wrapping `src`.
  The CDN build self-registers on `alpine:init`; the module build just
  re-exports so consumers call `Alpine.plugin(money)` themselves.
- `scripts/build.js` — esbuild config. The ESM build uses
  `platform: 'neutral'`.

`dist/` and `builds/` are committed to the repo (the CDN install path in the
README serves `dist/cdn.min.js` straight from unpkg), so **run `npm run build`
and commit the regenerated `dist/` alongside any `src/` change**.

## How the directive resolves locale and currency

Order matters, and this is the part most likely to trip you up:

1. `.global` reads `window.xMoney.{locale,currency}`.
2. `.shopify` reads `window.Shopify.locale` and
   `window.Shopify.currency.active`.
3. Otherwise it falls back to positional modifiers, then `data-locale` /
   `data-currency` attributes.

Positional parsing is unconditional: `modifiers[0]` and `modifiers[1]` are
taken as locale and currency regardless of what they actually are. So in
`x-money.decimal="price"` with `data-locale`, the string `"decimal"` becomes
the locale and `Intl` silently falls back to the browser default. Keep
locale/currency first when mixing modifiers, and be aware of this when
touching the modifier logic.

Value semantics: input is assumed to be **minor units** (pence/cents) and is
divided by 100. The `.decimal` modifier means "the value is already a decimal"
and skips that division. `.flat` strips a trailing `.00`/`,00` from the
formatted string so whole amounts render without decimals.

The directive no-ops (leaving `innerText` untouched) when the value is
nullish or the locale/currency could not be resolved. Note `0` is explicitly
allowed through — a past bug fix — so preserve the `moneyValue !== 0` check in
that guard.

## Conventions

No semicolons, single quotes, 2-space indent. Bump `version` in
`package.json` as part of the change when publishing.
