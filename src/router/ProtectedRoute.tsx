import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../features/auth/store/authStore'
import { ROUTES } from './routes'

function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
