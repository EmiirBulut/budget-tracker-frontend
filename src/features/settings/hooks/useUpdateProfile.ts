import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { updateProfile } from '../api/settingsApi'
import { useAuthStore } from '../../auth/store/authStore'
import type { UpdateProfileRequest } from '../types/SettingsTypes'
import type { ApiErrorResponse } from '../../auth/types/AuthTypes'

export function useUpdateProfile() {
  const { user, accessToken, refreshToken, setAuth } = useAuthStore()

  return useMutation<void, AxiosError<ApiErrorResponse>, UpdateProfileRequest>({
    mutationFn: updateProfile,
    onSuccess: (_, variables) => {
      if (user && accessToken && refreshToken) {
        setAuth({ ...user, email: variables.email }, accessToken, refreshToken)
      }
    },
  })
}
