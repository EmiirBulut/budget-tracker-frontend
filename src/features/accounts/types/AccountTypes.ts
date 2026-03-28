export enum AccountType {
  BankAccount = 'BankAccount',
  Cash = 'Cash',
  EWallet = 'EWallet',
}

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  TRY = 'TRY',
  JPY = 'JPY',
  CHF = 'CHF',
  CAD = 'CAD',
  AUD = 'AUD',
  CNY = 'CNY',
  INR = 'INR',
}

export interface Account {
  id: string
  name: string
  type: AccountType
  currency: Currency
  balance: number
  isArchived: boolean
  createdAt: string
}

export interface CreateAccountRequest {
  name: string
  type: AccountType
  currency: Currency
  initialBalance: number
}

export interface UpdateAccountRequest {
  name: string
  type: AccountType
  currency: Currency
}

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  [AccountType.BankAccount]: 'Bank Account',
  [AccountType.Cash]: 'Cash',
  [AccountType.EWallet]: 'E-Wallet',
}

export const ACCOUNT_TYPE_ICONS: Record<AccountType, string> = {
  [AccountType.BankAccount]: '🏦',
  [AccountType.Cash]: '🪙',
  [AccountType.EWallet]: '📱',
}

export const CURRENCY_LABELS: Record<Currency, string> = {
  [Currency.USD]: 'USD ($)',
  [Currency.EUR]: 'EUR (€)',
  [Currency.GBP]: 'GBP (£)',
  [Currency.TRY]: 'TRY (₺)',
  [Currency.JPY]: 'JPY (¥)',
  [Currency.CHF]: 'CHF (Fr)',
  [Currency.CAD]: 'CAD (CA$)',
  [Currency.AUD]: 'AUD (AU$)',
  [Currency.CNY]: 'CNY (¥)',
  [Currency.INR]: 'INR (₹)',
}
