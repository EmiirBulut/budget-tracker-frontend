import axiosInstance from '../../../services/axiosInstance'
import type { ReportParams, ReportSummary } from '../types/ReportTypes'

export async function getReport(params: ReportParams): Promise<ReportSummary> {
  const response = await axiosInstance.get<ReportSummary>('/api/reports', { params })
  return response.data
}
