export interface DashboardSummaryAccount {
  accountId: string
  accountName: string
  nativeCurrency: string
  nativeBalance: number
  convertedBalance: number
}

export interface DashboardSummary {
  totalBalance: number
  defaultCurrency: string
  ratesAsOf: string
  accounts: DashboardSummaryAccount[]
}
