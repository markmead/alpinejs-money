export default function (Alpine) {
  Alpine.directive(
    "money",
    (el, { expression, modifiers }, { evaluateLater, effect }) => {
      let { lang, currency } = el.dataset;
      let isShopify = modifiers.includes("shopify");
      let formatLang = isShopify ? Shopify.locale : lang;
      let formatCurrency = isShopify ? Shopify.currency.active : currency;
      let getValue = evaluateLater(expression);

      effect(() => {
        getValue((value) => {
          let money = value / 100;
          let formattedPrice = new Intl.NumberFormat(formatLang, {
            style: "currency",
            currency: formatCurrency,
          }).format(money);

          el.innerText = formattedPrice;
        });
      });
    }
  );
}
