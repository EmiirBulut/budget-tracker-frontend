import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { createTransaction } from '../api/transactionsApi'
import { DASHBOARD_SUMMARY_QUERY_KEY } from '../../dashboard/hooks/useDashboardSummary'
import type { CreateTransactionRequest, Transaction } from '../types/TransactionTypes'
import type { ApiErrorResponse } from '../../auth/types/AuthTypes'

export function useCreateTransaction() {
  const queryClient = useQueryClient()

  return useMutation<Transaction, AxiosError<ApiErrorResponse>, CreateTransactionRequest>({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['report'] })
      queryClient.invalidateQueries({ queryKey: DASHBOARD_SUMMARY_QUERY_KEY })
    },
  })
}
