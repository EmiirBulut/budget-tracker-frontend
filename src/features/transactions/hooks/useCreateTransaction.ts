import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { createTransaction } from '../api/transactionsApi'
import type { CreateTransactionRequest, Transaction } from '../types/TransactionTypes'
import type { ApiErrorResponse } from '../../auth/types/AuthTypes'

export function useCreateTransaction() {
  const queryClient = useQueryClient()

  return useMutation<Transaction, AxiosError<ApiErrorResponse>, CreateTransactionRequest>({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['report'] })
    },
  })
}
