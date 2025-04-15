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

If this isn't set by default then you can set it like this.

```js
window.Shopify = {
  locale: 'en-CA',
  currency: {
    active: 'CAD',
  },
}
```

### With Flat Modifier

The `.flat` modifier only removes `.00` (or `,00` for some locales) when the
value is a whole number.

```html
<div x-data="{ priceInt: 6010 }">
  <!-- £60.10 -->
  <p x-money.en-GB.GBP="priceInt"></p>

  <!-- £60.10 (It doesn't make sense to remove `.10` here) -->
  <p x-money.en-GB.GBP.flat="priceInt"></p>
</div>
```

<div x-data="{ priceInt: 6000 }">
  <!-- £60.00 -->
  <p x-money.en-GB.GBP="priceInt"></p>

  <!-- £60 -->
  <p x-money.en-GB.GBP.flat="priceInt"></p>
</div>
```
