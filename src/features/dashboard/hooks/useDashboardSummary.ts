import { useQuery } from '@tanstack/react-query'
import { getDashboardSummary } from '../api/dashboardApi'

export const DASHBOARD_SUMMARY_QUERY_KEY = ['dashboard', 'summary'] as const

export function useDashboardSummary() {
  return useQuery({
    queryKey: DASHBOARD_SUMMARY_QUERY_KEY,
    queryFn: getDashboardSummary,
  })
}
