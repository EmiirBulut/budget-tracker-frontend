import {
  BarChartOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  ScheduleOutlined,
  SettingOutlined,
  SwapOutlined,
  WalletOutlined,
} from '@ant-design/icons'
import { Menu, Typography } from 'antd'
import type { MenuProps } from 'antd'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { ROUTES } from '../../router/routes'
import styles from './Sidebar.module.css'

const { Text } = Typography

type MenuItem = Required<MenuProps>['items'][number]

function getSelectedKey(pathname: string): string {
  if (pathname.startsWith(ROUTES.ACCOUNTS)) return ROUTES.ACCOUNTS
  if (pathname.startsWith(ROUTES.CARDS)) return ROUTES.CARDS
  if (pathname.startsWith(ROUTES.INSTALLMENTS)) return ROUTES.INSTALLMENTS
  return pathname
}

function Sidebar() {
  const location = useLocation()
  const selectedKey = getSelectedKey(location.pathname)
  const { t } = useTranslation()

  const menuItems: MenuItem[] = [
    {
      key: ROUTES.DASHBOARD,
      icon: <DashboardOutlined />,
      label: <Link to={ROUTES.DASHBOARD}>{t('nav.dashboard')}</Link>,
    },
    {
      key: ROUTES.ACCOUNTS,
      icon: <WalletOutlined />,
      label: <Link to={ROUTES.ACCOUNTS}>{t('nav.accounts')}</Link>,
    },
    {
      key: ROUTES.CARDS,
      icon: <CreditCardOutlined />,
      label: <Link to={ROUTES.CARDS}>{t('nav.cards')}</Link>,
    },
    {
      key: ROUTES.TRANSACTIONS,
      icon: <SwapOutlined />,
      label: <Link to={ROUTES.TRANSACTIONS}>{t('nav.transactions')}</Link>,
    },
    {
      key: ROUTES.INSTALLMENTS,
      icon: <ScheduleOutlined />,
      label: <Link to={ROUTES.INSTALLMENTS}>{t('nav.installments')}</Link>,
    },
    {
      key: ROUTES.REPORTS,
      icon: <BarChartOutlined />,
      label: <Link to={ROUTES.REPORTS}>{t('nav.reports')}</Link>,
    },
    {
      key: ROUTES.SETTINGS,
      icon: <SettingOutlined />,
      label: <Link to={ROUTES.SETTINGS}>{t('nav.settings')}</Link>,
    },
  ]

  return (
    <>
      <div className={styles.brand}>
        <Text strong>{t('nav.appName')}</Text>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        className={styles.menu}
      />
    </>
  )
}

export default Sidebar
