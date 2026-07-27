// Modifiers that are flags rather than a locale or currency code. They have to be filtered out
// before the positional read below, or `x-money.decimal` would be treated as a locale.
const FLAG_MODIFIERS = ['decimal', 'shopify', 'global', 'flat']

export default function (Alpine) {
  Alpine.directive(
    'money',
    (el, { expression, modifiers }, { evaluateLater, effect }) => {
      const isDecimal = modifiers.includes('decimal')
      const isShopify = modifiers.includes('shopify')
      const isGlobal = modifiers.includes('global')
      const isFlat = modifiers.includes('flat')

      const [modifierLocale, modifierCurrency] = modifiers.filter(
        (modifier) => !FLAG_MODIFIERS.includes(modifier)
      )

      function resolveFormat() {
        if (isGlobal) {
          const { locale, currency } = globalThis.xMoney || {}

          return { locale, currency }
        }

        if (isShopify) {
          const { locale, currency } = globalThis.Shopify || {}

          return { locale, currency: currency?.active }
        }

        const { locale: dataLocale, currency: dataCurrency } = el.dataset

        return {
          locale: modifierLocale || dataLocale,
          currency: modifierCurrency || dataCurrency,
        }
      }

      // Constructing an Intl.NumberFormat is ~50x the cost of using one, so it is kept across
      // renders and only rebuilt when the locale or currency actually changes.
      let formatKey = ''
      let cachedFormat = null

      function getFormat(locale, currency) {
        const nextKey = `${locale}|${currency}`

        if (nextKey !== formatKey) {
          const formatter = new Intl.NumberFormat(locale, {
            style: 'currency',
            currency,
            ...(isFlat && { trailingZeroDisplay: 'stripIfInteger' }),
          })

          // A minor unit is not always a hundredth: JPY has no subunit at all, while KWD and
          // BHD have three decimal places. Intl knows the exponent per currency, so take it
          // from there instead of assuming /100.
          cachedFormat = {
            formatter,
            minorUnitDivisor: 10 ** formatter.resolvedOptions().maximumFractionDigits,
          }

          formatKey = nextKey
        }

        return cachedFormat
      }

      const getValue = evaluateLater(expression)

      effect(() => {
        getValue((moneyValue) => {
          if (moneyValue === null || moneyValue === undefined || moneyValue === '') {
            return
          }

          const { locale, currency } = resolveFormat()

          if (!locale || !currency) {
            return
          }

          const numericValue = Number(moneyValue)

          if (!Number.isFinite(numericValue)) {
            return
          }

          const { formatter, minorUnitDivisor } = getFormat(locale, currency)

          el.textContent = formatter.format(
            isDecimal ? numericValue : numericValue / minorUnitDivisor
          )
        })
      })
    }
  )
}
