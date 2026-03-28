import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'
import { login } from '../api/authApi'
import { useAuthStore } from '../store/authStore'
import { decodeUser } from '../../../lib/tokenUtils'
import { ROUTES } from '../../../router/routes'
import type { ApiErrorResponse, AuthResponse, LoginRequest } from '../types/AuthTypes'

export function useLogin() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation<AuthResponse, AxiosError<ApiErrorResponse>, LoginRequest>({
    mutationFn: login,
    onSuccess: (data) => {
      const user = decodeUser(data.accessToken)
      setAuth(user, data.accessToken, data.refreshToken)
      navigate(ROUTES.DASHBOARD)
    },
  })
}
