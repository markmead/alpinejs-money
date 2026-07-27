// Filtered out before the positional read below, or `x-money.decimal` is treated as a locale.
const FLAG_MODIFIERS = ['decimal', 'shopify', 'global', 'flat']

export default function (Alpine) {
  Alpine.directive(
    'money',
    (moneyElement, { expression, modifiers }, { evaluateLater, effect }) => {
      const isDecimal = modifiers.includes('decimal')
      const isShopify = modifiers.includes('shopify')
      const isGlobal = modifiers.includes('global')
      const isFlat = modifiers.includes('flat')

      const [modifierLocale, modifierCurrency] = modifiers.filter(
        (modifierName) => !FLAG_MODIFIERS.includes(modifierName)
      )

      function resolveMoneyFormat() {
        if (isGlobal) {
          const { locale: globalLocale, currency: globalCurrency } = globalThis.xMoney || {}

          return { formatLocale: globalLocale, formatCurrency: globalCurrency }
        }

        if (isShopify) {
          const { locale: shopifyLocale, currency: shopifyCurrency } = globalThis.Shopify || {}

          return { formatLocale: shopifyLocale, formatCurrency: shopifyCurrency?.active }
        }

        const { locale: datasetLocale, currency: datasetCurrency } = moneyElement.dataset

        return {
          formatLocale: modifierLocale || datasetLocale,
          formatCurrency: modifierCurrency || datasetCurrency,
        }
      }

      // Building an Intl.NumberFormat costs ~50x using one, so it survives across renders.
      let cachedFormatKey = ''
      let cachedFormatter = null
      let cachedMinorUnitDivisor = 1

      function getCachedFormatter(formatLocale, formatCurrency) {
        const nextFormatKey = `${formatLocale}|${formatCurrency}`

        if (nextFormatKey !== cachedFormatKey) {
          cachedFormatter = new Intl.NumberFormat(formatLocale, {
            style: 'currency',
            currency: formatCurrency,
            ...(isFlat && { trailingZeroDisplay: 'stripIfInteger' }),
          })

          // A minor unit is not always a hundredth: JPY has no subunit, KWD and BHD have three.
          cachedMinorUnitDivisor =
            10 ** cachedFormatter.resolvedOptions().maximumFractionDigits

          cachedFormatKey = nextFormatKey
        }

        return cachedFormatter
      }

      const getMoneyValue = evaluateLater(expression)

      effect(() => {
        getMoneyValue((moneyValue) => {
          if (moneyValue === null || moneyValue === undefined || moneyValue === '') {
            return
          }

          const { formatLocale, formatCurrency } = resolveMoneyFormat()

          if (!formatLocale || !formatCurrency) {
            return
          }

          const numericValue = Number(moneyValue)

          if (!Number.isFinite(numericValue)) {
            return
          }

          const moneyFormatter = getCachedFormatter(formatLocale, formatCurrency)

          moneyElement.textContent = moneyFormatter.format(
            isDecimal ? numericValue : numericValue / cachedMinorUnitDivisor
          )
        })
      })
    }
  )
}
