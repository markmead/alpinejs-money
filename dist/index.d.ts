/**
 * Alpine.js plugin registering the `x-money` directive.
 *
 * Typed against a structural subset of Alpine rather than `alpinejs` itself, so consumers
 * are not forced to install the Alpine types to use this package.
 */
declare function money(Alpine: {
  directive(
    name: string,
    callback: (
      el: HTMLElement,
      directive: { expression: string; modifiers: string[] },
      utilities: {
        evaluateLater: <T>(expression: string) => (callback: (value: T) => void) => void
        effect: (callback: () => void) => void
      }
    ) => void
  ): void
}): void

export default money
