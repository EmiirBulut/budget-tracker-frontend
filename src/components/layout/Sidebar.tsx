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
import { Link, useLocation } from 'react-router-dom'
import { ROUTES } from '../../router/routes'
import styles from './Sidebar.module.css'

const { Text } = Typography

type MenuItem = Required<MenuProps>['items'][number]

const menuItems: MenuItem[] = [
  {
    key: ROUTES.DASHBOARD,
    icon: <DashboardOutlined />,
    label: <Link to={ROUTES.DASHBOARD}>Dashboard</Link>,
  },
  {
    key: ROUTES.ACCOUNTS,
    icon: <WalletOutlined />,
    label: <Link to={ROUTES.ACCOUNTS}>Accounts</Link>,
  },
  {
    key: ROUTES.CARDS,
    icon: <CreditCardOutlined />,
    label: <Link to={ROUTES.CARDS}>Cards</Link>,
  },
  {
    key: ROUTES.TRANSACTIONS,
    icon: <SwapOutlined />,
    label: <Link to={ROUTES.TRANSACTIONS}>Transactions</Link>,
  },
  {
    key: ROUTES.INSTALLMENTS,
    icon: <ScheduleOutlined />,
    label: <Link to={ROUTES.INSTALLMENTS}>Installments</Link>,
  },
  {
    key: ROUTES.REPORTS,
    icon: <BarChartOutlined />,
    label: <Link to={ROUTES.REPORTS}>Reports</Link>,
  },
  {
    key: ROUTES.SETTINGS,
    icon: <SettingOutlined />,
    label: <Link to={ROUTES.SETTINGS}>Settings</Link>,
  },
]

function getSelectedKey(pathname: string): string {
  if (pathname.startsWith(ROUTES.ACCOUNTS)) return ROUTES.ACCOUNTS
  if (pathname.startsWith(ROUTES.CARDS)) return ROUTES.CARDS
  if (pathname.startsWith(ROUTES.INSTALLMENTS)) return ROUTES.INSTALLMENTS
  return pathname
}

function Sidebar() {
  const location = useLocation()
  const selectedKey = getSelectedKey(location.pathname)

  return (
    <>
      <div className={styles.brand}>
        <Text strong>Budget Tracker</Text>
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
