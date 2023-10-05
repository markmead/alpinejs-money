export default function (Alpine) {
  Alpine.directive(
    'money',
    (el, { expression, modifiers }, { evaluateLater, effect }) => {
      const [modLang, modCurrency] = modifiers || [false, false]

      const isDecimal = modifiers.includes('decimal')
      const isShopify = modifiers.includes('shopify')

      const dataLocale = el.dataset.locale
      const dataCurrency = el.dataset.currency

      const formatLang = isShopify ? Shopify.locale : modLang || dataLocale
      const formatCurrency = isShopify
        ? Shopify.currency.active
        : modCurrency || dataCurrency

      const getValue = evaluateLater(expression)

      effect(() => {
        getValue((moneyValue) => {
          const formattedMoney = isDecimal ? moneyValue : moneyValue / 100
          const formattedPrice = new Intl.NumberFormat(formatLang, {
            style: 'currency',
            currency: formatCurrency,
          }).format(formattedMoney)

          el.innerText = formattedPrice
        })
      })
    }
  )
}
