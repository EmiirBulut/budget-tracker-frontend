import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { getTransactions } from '../api/transactionsApi'
import type { ApiErrorResponse } from '../../auth/types/AuthTypes'
import type { PagedTransactions, TransactionsQueryParams } from '../types/TransactionTypes'

export const transactionsQueryKey = (params: TransactionsQueryParams) => ['transactions', params] as const

export function useTransactions(params: TransactionsQueryParams = {}) {
  return useQuery<PagedTransactions, AxiosError<ApiErrorResponse>>({
    queryKey: transactionsQueryKey(params),
    queryFn: () => getTransactions(params),
  })
}
