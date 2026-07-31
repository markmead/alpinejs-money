# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

An Alpine.js plugin exposing a single directive, `x-money`, that formats a
numeric value as currency via `Intl.NumberFormat` and writes the result to the
element's `textContent`.

## Commands

```shell
pnpm install
pnpm build    # esbuild -> dist/cdn.min.js and dist/esm.min.js
```

pnpm is required, not just preferred — `pnpm-workspace.yaml` carries two
settings the project depends on: `minimumReleaseAge: 2880` holds back packages
published in the last 48h, and `allowBuilds: esbuild` is needed because pnpm
blocks postinstall scripts by default and esbuild fetches its platform binary
in one.

There is no test suite, linter, or dev server. Two ways to verify a change:

- In a browser, via a local `index.html` at the repo root. It is gitignored
  precisely for this, so create one that loads `dist/cdn.min.js` plus Alpine
  from a CDN.
- In Node, by importing `dist/esm.min.js` and calling the default export with a
  stub `{ directive }`. The directive handler takes
  `(element, { expression, modifiers }, { evaluateLater, effect })`, so a fake
  element of `{ dataset: {}, textContent: '' }`, an `evaluateLater` returning
  `(callback) => callback(value)` and an `effect` that just invokes its callback
  are enough to assert on formatted output. This is the fastest way to cover the
  input-guard and per-currency-divisor cases.

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
README serves `dist/cdn.min.js` straight from unpkg), so **run `pnpm build`
and commit the regenerated `dist/` alongside any `src/` change**. The `files`
allowlist in `package.json` keeps everything else out of the published tarball.

## How the directive resolves locale and currency

1. `.global` reads `globalThis.xMoney.{locale,currency}`.
2. `.shopify` reads `globalThis.Shopify.locale` and
   `globalThis.Shopify.currency.active`.
3. Otherwise positional modifiers, then `data-locale` / `data-currency`
   attributes.

`FLAG_MODIFIERS` (`decimal`, `shopify`, `global`, `flat`) is filtered out
*before* the positional read, so modifier order does not matter and
`x-money.decimal` with `data-locale` works. This was a v1 bug — `decimal` was
passed to `Intl` as a locale and silently fell back to the browser default — so
if you add a new flag modifier, add it to `FLAG_MODIFIERS` or you reintroduce
that bug for that flag.

## Value semantics

Input is assumed to be **minor units** and is divided by
`10 ** maximumFractionDigits` for the resolved currency, so JPY (no subunit)
divides by 1 and BHD/KWD (three places) by 1000. Do not reintroduce a hardcoded
`/ 100`; v1 did that and the v2 division is the headline breaking change
documented in the README's upgrade table.

`.decimal` means "the value is already a major unit" and skips the division.
`.flat` is `trailingZeroDisplay: 'stripIfInteger'` on the formatter — it is not
string manipulation, so it works for any number of decimal places.

The formatter is cached per directive instance, keyed on `locale|currency`,
because constructing an `Intl.NumberFormat` costs far more than using one. Note
the coupling: `cachedMinorUnitDivisor` is assigned as a side effect of
`getCachedFormatter`, so it is only correct *after* that call. Keep the format
call above the division.

## When the directive no-ops

It leaves `textContent` untouched rather than erroring, when the locale or
currency can't be resolved, or when the value fails the input guard.

The guard is deliberately type-based rather than a truthiness or `Number()`
check, because `Number` reads `false`, `'   '` and `[]` as `0` and would render
a real `£0.00` for a garbage value. Only numbers and non-blank strings get
through, then a `Number.isFinite` check rejects `'abc'` and `Infinity`.

`0` must keep rendering as `£0.00` — that was a reported bug (#9) and is easy
to break by "simplifying" the guard back to a falsy test.

## Conventions

No semicolons, single quotes, 2-space indent.

Names are at least two words and state the thing's role — `moneyElement` not
`el`, `cachedFormatter` not `formatter` — in every scope, including `.filter()`
callbacks. Booleans read as a yes/no question (`isFlat`, `isNumericInput`).
Comments are reserved for genuinely surprising behaviour or a non-obvious
"why"; don't narrate what the code does.

Bump `version` in `package.json` as part of the change when publishing. Note it
currently reads `1.2.0` while the README documents v2 and its breaking changes,
so the next publish needs `2.0.0`.
