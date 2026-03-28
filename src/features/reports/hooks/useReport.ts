import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { getReport } from '../api/reportsApi'
import type { ApiErrorResponse } from '../../auth/types/AuthTypes'
import type { ReportParams, ReportSummary } from '../types/ReportTypes'

export const reportQueryKey = (params: ReportParams) => ['report', params] as const

export function useReport(params: ReportParams) {
  return useQuery<ReportSummary, AxiosError<ApiErrorResponse>>({
    queryKey: reportQueryKey(params),
    queryFn: () => getReport(params),
  })
}
