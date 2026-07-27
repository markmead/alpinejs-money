# Alpine JS Money

Alpine JS plugin for formatting currency values in multiple languages and
currencies 💸

![](https://img.shields.io/bundlephobia/min/alpinejs-money)
![](https://img.shields.io/npm/v/alpinejs-money)
![](https://img.shields.io/npm/dt/alpinejs-money)
![](https://img.shields.io/github/license/markmead/alpinejs-money)

## Install

### With a CDN

```html
<script
  defer
  src="https://unpkg.com/alpinejs-money@latest/dist/cdn.min.js"
></script>

<script defer src="https://unpkg.com/alpinejs@latest/dist/cdn.min.js"></script>
```

### With a Package Manager

```shell
pnpm add -D alpinejs-money

npm install -D alpinejs-money

yarn add -D alpinejs-money
```

```js
import Alpine from 'alpinejs'
import money from 'alpinejs-money'

Alpine.plugin(money)

Alpine.start()
```

## Example

### Basic

```html
<div x-data="{ priceInt: 9999, priceDec: 99.99 }">
  <p x-money.en-GB.GBP="priceInt"></p>
  <p x-money.ja-JP.JPY="priceInt"></p>
  <p x-money.en-US.USD="priceInt"></p>

  <!-- Decimal -->
  <p x-money.en-GB.GBP.decimal="priceDec"></p>
  <p x-money.ja-JP.JPY.decimal="priceDec"></p>
  <p x-money.en-US.USD.decimal="priceDec"></p>
</div>
```

### Minor Units

By default the value is treated as **minor units** and divided by the number of
decimal places the currency actually has, which `Intl` knows per currency.

```html
<div x-data="{ priceInt: 9999 }">
  <!-- £99.99 - GBP has 2 decimal places, so 9999 / 100 -->
  <p x-money.en-GB.GBP="priceInt"></p>

  <!-- ￥9,999 - JPY has no subunit, so no division -->
  <p x-money.ja-JP.JPY="priceInt"></p>

  <!-- BHD 9.999 - BHD has 3 decimal places, so 9999 / 1000 -->
  <p x-money.en-US.BHD="priceInt"></p>
</div>
```

Use the `.decimal` modifier when the value is already a major-unit decimal and
should not be divided at all.

### With Data Attributes

```html
<div x-data="{ priceInt: 9999, priceDec: 99.99 }">
  <p x-money="priceInt" data-locale="en-GB" data-currency="GBP"></p>
  <p x-money="priceInt" data-locale="ja-JP" data-currency="JPY"></p>
  <p x-money="priceInt" data-locale="en-US" data-currency="USD"></p>

  <!-- Decimal -->
  <p x-money.decimal="priceDec" data-locale="en-GB" data-currency="GBP"></p>
  <p x-money.decimal="priceDec" data-locale="ja-JP" data-currency="JPY"></p>
  <p x-money.decimal="priceDec" data-locale="en-US" data-currency="USD"></p>
</div>
```

### With Global

```html
<div x-data="{ priceInt: 9999, priceDec: 99.99 }">
  <p x-money.global="priceInt"></p>
  <p x-money.global.decimal="priceDec"></p>
</div>
```

This will look for `locale` and `currency` which is on the global `xMoney`
object.

```js
window.xMoney = {
  locale: 'en-CA',
  currency: 'CAD',
}
```

### With Shopify

```html
<div x-data="{ priceInt: 9999, priceDec: 99.99 }">
  <p x-money.shopify="priceInt"></p>
  <p x-money.shopify.decimal="priceDec"></p>
</div>
```

This will look for `Shopify.locale` and `Shopify.currency.active` which is on
the global `Shopify` object.

Most themes set this for you. If yours doesn't, set it yourself.

```js
window.Shopify = {
  locale: 'en-CA',
  currency: {
    active: 'CAD',
  },
}
```

### With Flat Modifier

The `.flat` modifier drops the decimal part when the value is a whole number,
and leaves it alone otherwise. It works for currencies with any number of
decimal places, so `BHD 60.000` flattens to `BHD 60` too.

```html
<div x-data="{ priceInt: 6010 }">
  <!-- £60.10 -->
  <p x-money.en-GB.GBP="priceInt"></p>

  <!-- £60.10 (It doesn't make sense to remove `.10` here) -->
  <p x-money.en-GB.GBP.flat="priceInt"></p>
</div>

<div x-data="{ priceInt: 6000 }">
  <!-- £60.00 -->
  <p x-money.en-GB.GBP="priceInt"></p>

  <!-- £60 -->
  <p x-money.en-GB.GBP.flat="priceInt"></p>
</div>
```

## When Nothing Renders

The element is left untouched, rather than erroring or showing a placeholder,
when any of these are true.

- The locale or currency can't be resolved. With `.shopify` or `.global` this
  usually means the global object isn't on the page yet.
- The value is `null`, `undefined` or an empty string. Note that `0` does
  render, as `£0.00`.
- The value isn't a finite number, so `"abc"` renders nothing rather than
  `£NaN`.

## Upgrading from v1

### Minor units are per currency

v1 always divided by 100. v2 divides by the number of decimal places the
currency actually has, so zero-decimal and three-decimal currencies changed.

| Value  | Currency | v1          | v2          |
| ------ | -------- | ----------- | ----------- |
| `9999` | GBP      | `£99.99`    | `£99.99`    |
| `9999` | JPY      | `￥100`     | `￥9,999`   |
| `9999` | BHD      | `BHD 99.990` | `BHD 9.999` |

Two-decimal currencies are unaffected. If you were compensating for the old
behaviour on JPY, KWD or BHD, drop the compensation.

### Modifier order no longer matters

In v1 the first two modifiers were read as locale and currency whatever they
were, so `x-money.decimal` with `data-locale` passed `decimal` to `Intl` as
the locale. It didn't error, it just quietly used the browser's default
locale. v2 recognises `decimal`, `flat`, `global` and `shopify` as modifiers
and reads the locale and currency from what's left.
