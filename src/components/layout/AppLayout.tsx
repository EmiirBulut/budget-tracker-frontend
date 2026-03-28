import { Button } from 'antd'
import { Outlet, useNavigate } from 'react-router-dom'
import { revokeToken } from '../../features/auth/api/authApi'
import { useAuthStore } from '../../features/auth/store/authStore'
import { ROUTES } from '../../router/routes'
import Sidebar from './Sidebar'
import styles from './AppLayout.module.css'

function AppLayout() {
  const navigate = useNavigate()
  const { user, refreshToken, clearAuth } = useAuthStore()

  const handleSignOut = async (): Promise<void> => {
    if (refreshToken) {
      try {
        await revokeToken(refreshToken)
      } catch {
        // best-effort revoke; proceed with local logout regardless
      }
    }

    clearAuth()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  return (
    <div className={styles.layout}>
      <Sidebar />

      <div className={styles.mainArea}>
        <header className={styles.header}>
          <div className={styles.userEmail}>{user?.email}</div>
          <Button onClick={handleSignOut}>Sign out</Button>
        </header>

        <section className={styles.content}>
          <Outlet />
        </section>
      </div>
    </div>
  )
}

export default AppLayout
