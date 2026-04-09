import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import type { ApiErrorResponse } from '../../auth/types/AuthTypes'
import { updatePreferences } from '../api/settingsApi'
import type { UpdatePreferencesRequest } from '../types/SettingsTypes'
import { PREFERENCES_QUERY_KEY } from './usePreferences'

export function useUpdatePreferences() {
  const queryClient = useQueryClient()

  return useMutation<void, AxiosError<ApiErrorResponse>, UpdatePreferencesRequest>({
    mutationFn: updatePreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PREFERENCES_QUERY_KEY })
    },
  })
}
