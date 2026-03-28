import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { createAccount } from '../api/accountsApi'
import { ACCOUNTS_QUERY_KEY } from './useAccounts'
import type { Account, CreateAccountRequest } from '../types/AccountTypes'
import type { ApiErrorResponse } from '../../auth/types/AuthTypes'

export function useCreateAccount() {
  const queryClient = useQueryClient()

  return useMutation<Account, AxiosError<ApiErrorResponse>, CreateAccountRequest>({
    mutationFn: createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY })
    },
  })
}
