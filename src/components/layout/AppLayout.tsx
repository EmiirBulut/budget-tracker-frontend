import { MenuOutlined } from '@ant-design/icons'
import { Button, Drawer, Grid, Layout, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { revokeToken } from '../../features/auth/api/authApi'
import { useAuthStore } from '../../features/auth/store/authStore'
import { ROUTES } from '../../router/routes'
import Sidebar from './Sidebar'
import PwaUpdatePrompt from '../ui/PwaUpdatePrompt'
import styles from './AppLayout.module.css'

const { Sider, Content } = Layout
const { Text } = Typography
const { useBreakpoint } = Grid

function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, refreshToken, clearAuth } = useAuthStore()
  const { md } = useBreakpoint()
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Close drawer on navigation
  useEffect(() => {
    setDrawerOpen(false)
  }, [location.pathname])

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
      <PwaUpdatePrompt />

      {/* Desktop sidebar — visible on md and above */}
      {md && (
        <Sider width={220} theme="light">
          <Sidebar />
        </Sider>
      )}

      {/* Mobile navigation drawer */}
      <Drawer
        placement="left"
        open={!md && drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={220}
        styles={{ body: { padding: 0 } }}
        closable={false}
      >
        <Sidebar />
      </Drawer>

      <Layout>
        <header className={styles.header}>
          {/* Hamburger — visible on mobile only */}
          {!md && (
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setDrawerOpen(true)}
              className={styles.menuBtn}
            />
          )}
          <Text type="secondary" className={styles.userEmail}>{user?.email}</Text>
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
