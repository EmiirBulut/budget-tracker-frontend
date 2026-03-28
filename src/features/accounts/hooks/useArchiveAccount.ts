import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { archiveAccount } from '../api/accountsApi'
import { ACCOUNTS_QUERY_KEY } from './useAccounts'
import { accountDetailQueryKey } from './useAccountDetail'
import type { ApiErrorResponse } from '../../auth/types/AuthTypes'

export function useArchiveAccount() {
  const queryClient = useQueryClient()

  return useMutation<void, AxiosError<ApiErrorResponse>, string>({
    mutationFn: archiveAccount,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: accountDetailQueryKey(id) })
    },
  })
}
