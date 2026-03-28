import { Button, Layout, Typography } from 'antd'
import { Outlet, useNavigate } from 'react-router-dom'
import { revokeToken } from '../../features/auth/api/authApi'
import { useAuthStore } from '../../features/auth/store/authStore'
import { ROUTES } from '../../router/routes'
import Sidebar from './Sidebar'
import styles from './AppLayout.module.css'

const { Sider, Content } = Layout
const { Text } = Typography

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
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={220} theme="light">
        <Sidebar />
      </Sider>

      <Layout>
        <header className={styles.header}>
          <Text type="secondary">{user?.email}</Text>
          <Button onClick={handleSignOut}>Sign out</Button>
        </header>

        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default AppLayout
