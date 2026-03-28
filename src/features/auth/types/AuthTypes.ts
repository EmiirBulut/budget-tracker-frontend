export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface User {
  id: string
  email: string
}

export interface ApiErrorResponse {
  status: number
  error: string
  details: string[]
}
