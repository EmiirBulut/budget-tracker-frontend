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
 * Formats a total balance amount using the given ISO 4217 currency code.
 * Used for aggregate totals displayed in the user's preferred currency.
 */
export function formatTotalBalance(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}
