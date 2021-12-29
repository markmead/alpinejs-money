# Apline JS money

Alpine JS plugin `x-money` allows you to update the document `money` dynamically 🥳

## Example 👀

### Base 🧱

```html
<div x-data="{ price: 1299 }">
  <p x-money="price" data-lang="ja-JP" data-currency="JPY"></p>
</div>
```

### Shopify 💰

```html
<div x-data="{ price: 1299 }">
  <p x-money.shopify="price"></p>
</div>
```

This will look for `Shopify.locale` and `Shopify.currency.active` which is on the global Shopify object.

If this isn't set by default (very unlikely) then you can set it like this.

```js
window.Shopify = {
  locale: "en-CA",
  currency: {
    active: "CAD",
  },
};
```

## Install 🌟

It's very easy to install Alpine JS plugins! 🙌

### CDN

```html
<script src="https://unpkg.com/alpinejs-money@1.0.0/dist/money.min.js"></script>
<script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

### NPM/Yarn

```shell
npm i -D alpinejs-money

yarn add -D alpinejs-money
```

Then you can register the plugin.

```js
import Alpine from "alpinejs";
import money from "alpinejs-money";

Alpine.plugin(money);

window.Alpine = Alpine;

Alpine.start();
```

### Stats 📊

Here's some stats about the Alpine JS money package! As you can see, it's tiny 🤏

![](https://img.shields.io/bundlephobia/min/alpinejs-money)
![](https://img.shields.io/npm/v/alpinejs-money)
![](https://img.shields.io/npm/dt/alpinejs-money)
![](https://img.shields.io/github/license/markmead/alpinejs-money)
