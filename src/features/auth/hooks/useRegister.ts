import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'
import { register } from '../api/authApi'
import { ROUTES } from '../../../router/routes'
import type { ApiErrorResponse, AuthResponse, RegisterRequest } from '../types/AuthTypes'

export function useRegister() {
  const navigate = useNavigate()

  return useMutation<AuthResponse, AxiosError<ApiErrorResponse>, RegisterRequest>({
    mutationFn: register,
    onSuccess: () => {
      navigate(ROUTES.LOGIN)
    },
  })
}
