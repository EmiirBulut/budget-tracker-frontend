import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { changePassword } from '../api/settingsApi'
import type { ChangePasswordRequest } from '../types/SettingsTypes'
import type { ApiErrorResponse } from '../../auth/types/AuthTypes'

export function useChangePassword() {
  return useMutation<void, AxiosError<ApiErrorResponse>, ChangePasswordRequest>({
    mutationFn: changePassword,
  })
}
