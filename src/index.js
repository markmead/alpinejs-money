export default function (Alpine) {
  Alpine.directive(
    'money',
    (el, { expression, modifiers }, { evaluateLater, effect }) => {
      const [modLang, modCurrency] = modifiers

      const isDecimal = modifiers.includes('decimal')
      const isShopify = modifiers.includes('shopify')

      const formatLang = isShopify ? Shopify.locale : modLang
      const formatCurrency = isShopify ? Shopify.currency.active : modCurrency

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
