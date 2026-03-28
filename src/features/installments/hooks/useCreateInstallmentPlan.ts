import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { createInstallmentPlan } from '../api/installmentsApi'
import { INSTALLMENTS_QUERY_KEY } from './useInstallmentPlans'
import type { CreateInstallmentPlanRequest, InstallmentPlan } from '../types/InstallmentTypes'
import type { ApiErrorResponse } from '../../auth/types/AuthTypes'

export function useCreateInstallmentPlan() {
  const queryClient = useQueryClient()

  return useMutation<InstallmentPlan, AxiosError<ApiErrorResponse>, CreateInstallmentPlanRequest>({
    mutationFn: createInstallmentPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INSTALLMENTS_QUERY_KEY })
    },
  })
}
