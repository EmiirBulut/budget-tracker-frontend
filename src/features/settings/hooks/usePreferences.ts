import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../../auth/store/authStore'
import { getPreferences } from '../api/settingsApi'

export const PREFERENCES_QUERY_KEY = ['preferences'] as const

export function usePreferences() {
  const accessToken = useAuthStore((s) => s.accessToken)

  return useQuery({
    queryKey: PREFERENCES_QUERY_KEY,
    queryFn: getPreferences,
    enabled: !!accessToken,
    retry: false,
    refetchOnWindowFocus: false,
  })
}
