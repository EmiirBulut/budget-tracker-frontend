import axiosInstance from '../../../services/axiosInstance'
import type { CreateTransactionRequest, PagedTransactions, Transaction, TransactionsQueryParams } from '../types/TransactionTypes'

export async function getTransactions(params: TransactionsQueryParams = {}): Promise<PagedTransactions> {
  const response = await axiosInstance.get<PagedTransactions>('/api/transactions', { params })
  return response.data
}

export async function createTransaction(data: CreateTransactionRequest): Promise<Transaction> {
  const response = await axiosInstance.post<Transaction>('/api/transactions', data)
  return response.data
}
