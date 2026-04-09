import { useQuery } from '@tanstack/react-query'
import { getPreferences } from '../api/settingsApi'

export const PREFERENCES_QUERY_KEY = ['preferences'] as const

export function usePreferences() {
  return useQuery({
    queryKey: PREFERENCES_QUERY_KEY,
    queryFn: getPreferences,
  })
}
