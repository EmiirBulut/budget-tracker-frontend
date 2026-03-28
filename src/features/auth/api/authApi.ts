import axiosInstance from '../../../services/axiosInstance'
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/AuthTypes'

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await axiosInstance.post<AuthResponse>('/api/auth/login', data)
  return response.data
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await axiosInstance.post<AuthResponse>('/api/auth/register', data)
  return response.data
}

export async function refreshToken(token: string): Promise<AuthResponse> {
  const response = await axiosInstance.post<AuthResponse>('/api/auth/refresh', {
    refreshToken: token,
  })
  return response.data
}

export async function revokeToken(token: string): Promise<void> {
  await axiosInstance.post('/api/auth/revoke', { refreshToken: token })
}
