import {
  CreditCardOutlined,
  DashboardOutlined,
  FundProjectionScreenOutlined,
  SettingOutlined,
  SwapOutlined,
  WalletOutlined,
} from '@ant-design/icons'
import { Menu } from 'antd'
import type { MenuProps } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import { ROUTES } from '../../router/routes'
import styles from './Sidebar.module.css'

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
    icon: <FundProjectionScreenOutlined />,
    label: <Link to={ROUTES.INSTALLMENTS}>Installments</Link>,
  },
  {
    key: ROUTES.REPORTS,
    icon: <FundProjectionScreenOutlined />,
    label: <Link to={ROUTES.REPORTS}>Reports</Link>,
  },
  {
    key: ROUTES.SETTINGS,
    icon: <SettingOutlined />,
    label: <Link to={ROUTES.SETTINGS}>Settings</Link>,
  },
]

function Sidebar() {
  const location = useLocation()
  const selectedKey = location.pathname.startsWith(ROUTES.ACCOUNTS)
    ? ROUTES.ACCOUNTS
    : location.pathname

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>Budget Tracker</div>
      <Menu mode="inline" selectedKeys={[selectedKey]} items={menuItems} className={styles.menu} />
    </aside>
  )
}

export default Sidebar
