import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { getAccountById } from '../api/accountsApi'
import type { ApiErrorResponse } from '../../auth/types/AuthTypes'
import type { Account } from '../types/AccountTypes'

export const accountDetailQueryKey = (id: string) => ['accounts', id] as const

export function useAccountDetail(id: string) {
  return useQuery<Account, AxiosError<ApiErrorResponse>>({
    queryKey: accountDetailQueryKey(id),
    queryFn: () => getAccountById(id),
    enabled: id.length > 0,
  })
}
