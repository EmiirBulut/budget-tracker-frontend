import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { getAccounts } from '../api/accountsApi'
import type { ApiErrorResponse } from '../../auth/types/AuthTypes'
import type { Account } from '../types/AccountTypes'

export const ACCOUNTS_QUERY_KEY = ['accounts'] as const

export function useAccounts() {
  return useQuery<Account[], AxiosError<ApiErrorResponse>>({
    queryKey: ACCOUNTS_QUERY_KEY,
    queryFn: getAccounts,
  })
}
