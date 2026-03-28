import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '../features/auth/store/authStore'
import { ROUTES } from '../router/routes'
import type { AuthResponse } from '../features/auth/types/AuthTypes'

// Extend Axios config to carry a retry flag, preventing infinite 401 loops.
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retry?: boolean
  }
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

// ── Request interceptor: attach Bearer token ────────────────────────────────
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Response interceptor: handle 401 with token refresh ────────────────────
let isRefreshing = false
type QueueEntry = { resolve: (token: string) => void; reject: (error: unknown) => void }
let failedQueue: QueueEntry[] = []

function processQueue(error: unknown, token: string | null): void {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token!)
    }
  })
  failedQueue = []
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      // Queue this request until the in-flight refresh completes.
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return axiosInstance(originalRequest)
        })
        .catch((queueError: unknown) => Promise.reject(queueError))
    }

    originalRequest._retry = true
    isRefreshing = true

    const { refreshToken, clearAuth, setAuth, user } = useAuthStore.getState()

    if (!refreshToken) {
      clearAuth()
      window.location.replace(ROUTES.LOGIN)
      return Promise.reject(error)
    }

    try {
      // Use raw axios — not the intercepted instance — to avoid triggering this interceptor again.
      const response = await axios.post<AuthResponse>(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh`,
        { refreshToken },
      )

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data

      if (user) {
        setAuth(user, newAccessToken, newRefreshToken)
      }

      axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`
      processQueue(null, newAccessToken)

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
      return axiosInstance(originalRequest)
    } catch (refreshError: unknown) {
      processQueue(refreshError, null)
      clearAuth()
      window.location.replace(ROUTES.LOGIN)
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

export default axiosInstance
