import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { updateAccount } from '../api/accountsApi'
import { ACCOUNTS_QUERY_KEY } from './useAccounts'
import { accountDetailQueryKey } from './useAccountDetail'
import type { Account, UpdateAccountRequest } from '../types/AccountTypes'
import type { ApiErrorResponse } from '../../auth/types/AuthTypes'

interface UpdateAccountVariables {
  id: string
  data: UpdateAccountRequest
}

export function useUpdateAccount() {
  const queryClient = useQueryClient()

  return useMutation<Account, AxiosError<ApiErrorResponse>, UpdateAccountVariables>({
    mutationFn: ({ id, data }) => updateAccount(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: accountDetailQueryKey(variables.id) })
    },
  })
}
