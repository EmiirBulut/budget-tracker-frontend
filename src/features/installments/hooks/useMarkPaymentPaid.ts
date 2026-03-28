import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { markPaymentPaid } from '../api/installmentsApi'
import { installmentDetailQueryKey } from './useInstallmentPlanDetail'
import type { ApiErrorResponse } from '../../auth/types/AuthTypes'

interface MarkPaymentPaidVariables {
  planId: string
  paymentId: string
}

export function useMarkPaymentPaid() {
  const queryClient = useQueryClient()

  return useMutation<void, AxiosError<ApiErrorResponse>, MarkPaymentPaidVariables>({
    mutationFn: ({ planId, paymentId }) => markPaymentPaid(planId, paymentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: installmentDetailQueryKey(variables.planId) })
      queryClient.invalidateQueries({ queryKey: ['installments'] })
    },
  })
}
