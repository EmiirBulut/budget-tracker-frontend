import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { getInstallmentPlans } from '../api/installmentsApi'
import type { ApiErrorResponse } from '../../auth/types/AuthTypes'
import type { InstallmentPlan } from '../types/InstallmentTypes'

export const INSTALLMENTS_QUERY_KEY = ['installments'] as const

export function useInstallmentPlans() {
  return useQuery<InstallmentPlan[], AxiosError<ApiErrorResponse>>({
    queryKey: INSTALLMENTS_QUERY_KEY,
    queryFn: getInstallmentPlans,
  })
}
