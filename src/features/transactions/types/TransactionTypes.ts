export type TransactionType = 'Expense' | 'Income' | 'Installment'

export interface Transaction {
  id: string
  accountId: string | null
  cardId: string | null
  type: TransactionType
  amount: number
  category: string
  description: string
  date: string
  installmentPlanId: string | null
  createdAt: string
}

export interface TransactionsQueryParams {
  accountId?: string
  cardId?: string
  type?: TransactionType
  startDate?: string
  endDate?: string
  page?: number
  pageSize?: number
}

export interface PagedTransactions {
  items: Transaction[]
  totalCount: number
  page: number
  pageSize: number
}

export interface CreateTransactionRequest {
  accountId?: string | null
  cardId?: string | null
  type: TransactionType
  amount: number
  category: string
  description: string
  date: string
}

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  Expense: 'Expense',
  Income: 'Income',
  Installment: 'Installment',
}

export const TRANSACTION_TYPE_COLORS: Record<TransactionType, string> = {
  Expense: 'red',
  Income: 'green',
  Installment: 'blue',
}
