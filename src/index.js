export default function (Alpine) {
  Alpine.directive(
    'money',
    (el, { expression, modifiers }, { evaluateLater, effect }) => {
      const [modLocale, modCurrency] = modifiers || [false, false]

      const isDecimal = modifiers.includes('decimal')
      const isShopify = modifiers.includes('shopify')
      const isGlobal = modifiers.includes('global')

      const {
        dataset: { locale: dataLocale, currency: dataCurrency },
      } = el

      let formatLang = ''
      let formatCurrency = ''

      if (isGlobal) {
        const { locale: globalLocale, currency: globalCurrency } =
          window?.xMoney || {}

        formatLang = globalLocale
        formatCurrency = globalCurrency
      }

      if (isShopify) {
        const {
          locale: shopifyLocale,
          currency: { active: shopifyCurrency },
        } = window?.Shopify || {}

        formatLang = shopifyLocale
        formatCurrency = shopifyCurrency
      }

      if (!isShopify && !isGlobal) {
        formatLang = modLocale || dataLocale
        formatCurrency = modCurrency || dataCurrency
      }

      const getValue = evaluateLater(expression)

      effect(() => {
        getValue((moneyValue) => {
          if (!moneyValue || !formatLang || !formatCurrency) {
            return
          }

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
