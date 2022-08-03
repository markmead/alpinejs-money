# Alpine JS Money

Format money through Alpine JS into any language and currency 💸

## Install

### With a CDN

```html
<script
  defer
  src="https://unpkg.com/alpinejs-money@latest/dist/money.min.js"
></script>

<script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
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
<div x-data="{ price: 1299 }">
  <p x-money="price" data-lang="ja-JP" data-currency="JPY"></p>
</div>
```

### With Shopify

```html
<div x-data="{ price: 1299 }">
  <p x-money.shopify="price"></p>
</div>
```

This will look for `Shopify.locale` and `Shopify.currency.active` which is on the global `Shopify` object.

If this isn't set by default then you can set it like this.

```js
window.Shopify = {
  locale: 'en-CA',
  currency: {
    active: 'CAD',
  },
}
```

### Stats

![](https://img.shields.io/bundlephobia/min/alpinejs-money)
![](https://img.shields.io/npm/v/alpinejs-money)
![](https://img.shields.io/npm/dt/alpinejs-money)
![](https://img.shields.io/github/license/markmead/alpinejs-money)
