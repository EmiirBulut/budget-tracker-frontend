import { PlusOutlined } from '@ant-design/icons'
import { Button, Card, Flex, Typography } from 'antd'
import { useState } from 'react'
import AddAccountModal from '../features/accounts/components/AddAccountModal'
import AccountList from '../features/accounts/components/AccountList'
import { useAccounts } from '../features/accounts/hooks/useAccounts'
import { formatTotalBalance } from '../lib/formatCurrency'
import styles from './AccountsPage.module.css'

const { Title, Text } = Typography

function AccountsPage() {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const { data: accounts } = useAccounts()

  const activeAccounts = accounts?.filter((a) => !a.isArchived) ?? []
  const totalBalance = activeAccounts.reduce((sum, a) => sum + a.balance, 0)

  return (
    <main className={styles.page}>
      <Flex justify="space-between" align="center" className={styles.pageHeader}>
        <Flex vertical gap={2}>
          <Title level={3} style={{ marginBottom: 0 }}>Accounts</Title>
          <Text type="secondary">Manage your financial accounts</Text>
        </Flex>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddOpen(true)}>
          Add Account
        </Button>
      </Flex>

      <Card variant="borderless" className={styles.balanceBanner}>
        <Text className={styles.bannerLabel}>Total Balance</Text>
        <Title level={2} className={styles.bannerAmount}>{formatTotalBalance(totalBalance)}</Title>
        <Text className={styles.bannerMeta}>{activeAccounts.length} Active Accounts</Text>
      </Card>

      <AccountList />

      <AddAccountModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </main>
  )
}

export default AccountsPage
