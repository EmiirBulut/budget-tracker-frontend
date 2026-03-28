import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { getInstallmentPlanById } from '../api/installmentsApi'
import type { ApiErrorResponse } from '../../auth/types/AuthTypes'
import type { InstallmentPlan } from '../types/InstallmentTypes'

export const installmentDetailQueryKey = (id: string) => ['installments', id] as const

export function useInstallmentPlanDetail(id: string) {
  return useQuery<InstallmentPlan, AxiosError<ApiErrorResponse>>({
    queryKey: installmentDetailQueryKey(id),
    queryFn: () => getInstallmentPlanById(id),
    enabled: id.length > 0,
  })
}
