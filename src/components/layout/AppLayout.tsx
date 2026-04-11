import { MenuOutlined } from '@ant-design/icons'
import { Button, Drawer, Grid, Layout, Typography, theme } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { revokeToken } from '../../features/auth/api/authApi'
import { useAuthStore } from '../../features/auth/store/authStore'
import { useUiStore } from '../../features/settings/store/uiStore'
import { ROUTES } from '../../router/routes'
import Sidebar from './Sidebar'
import PwaUpdatePrompt from '../ui/PwaUpdatePrompt'
import QuickAddTransactionFab from '../ui/QuickAddTransactionFab'
import styles from './AppLayout.module.css'

const { Sider, Content, Header } = Layout
const { Text } = Typography
const { useBreakpoint } = Grid

function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, refreshToken, clearAuth } = useAuthStore()
  const { md } = useBreakpoint()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { isDarkMode } = useUiStore()
  const { token } = theme.useToken()
  const { t } = useTranslation()

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
        <Sider width={220} theme={isDarkMode ? 'dark' : 'light'}>
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
        <Header className={styles.header} style={{ background: token.colorBgContainer, borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
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
          <Button onClick={handleSignOut}>{t('common.signOut')}</Button>
        </Header>

        <Content className={styles.content}>
          <Outlet />
        </Content>

        <QuickAddTransactionFab />
      </Layout>
    </Layout>
  )
}

export default AppLayout
