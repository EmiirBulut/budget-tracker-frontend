/**
 * Formats a balance amount using the given ISO 4217 currency code.
 * Example: formatBalance(12750, 'USD') → '$12,750.00'
 */
export function formatBalance(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Formats a raw number as a dollar-sign-prefixed amount.
 * Used for the total balance banner which aggregates across currencies.
 */
export function formatTotalBalance(amount: number): string {
  return (
    '$' +
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  )
}
