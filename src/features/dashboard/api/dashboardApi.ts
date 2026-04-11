import axiosInstance from '../../../services/axiosInstance'
import type { DashboardSummary } from '../types/DashboardTypes'

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const response = await axiosInstance.get<DashboardSummary>('/api/dashboard/summary')
  return response.data
}
