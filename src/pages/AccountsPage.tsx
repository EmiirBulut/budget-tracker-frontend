import { PlusOutlined } from '@ant-design/icons'
import { Button, Card, Flex, Typography } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import AddAccountModal from '../features/accounts/components/AddAccountModal'
import AccountList from '../features/accounts/components/AccountList'
import { useAccounts } from '../features/accounts/hooks/useAccounts'
import { usePreferences } from '../features/settings/hooks/usePreferences'
import { formatTotalBalance } from '../lib/formatCurrency'
import styles from './AccountsPage.module.css'

const { Title, Text } = Typography

function AccountsPage() {
  const { t } = useTranslation()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const { data: accounts } = useAccounts()
  const { data: preferences } = usePreferences()
  const preferredCurrency = preferences?.defaultCurrency ?? 'USD'

  const activeAccounts = accounts?.filter((a) => !a.isArchived) ?? []
  const totalBalance = activeAccounts.reduce((sum, a) => sum + a.balance, 0)

  return (
    <main className={styles.page}>
      <Flex justify="space-between" align="center" className={styles.pageHeader}>
        <Flex vertical gap={2}>
          <Title level={3} style={{ marginBottom: 0 }}>{t('accounts.title')}</Title>
          <Text type="secondary">{t('accounts.subtitle')}</Text>
        </Flex>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddOpen(true)}>
          {t('accounts.addAccount')}
        </Button>
      </Flex>

      <Card variant="borderless" className={styles.balanceBanner}>
        <Text className={styles.bannerLabel}>{t('accounts.totalBalance')}</Text>
        <Title level={2} className={styles.bannerAmount}>{formatTotalBalance(totalBalance, preferredCurrency)}</Title>
        <Text className={styles.bannerMeta}>{activeAccounts.length} {t('accounts.activeAccounts')}</Text>
      </Card>

      <AccountList />

      <AddAccountModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </main>
  )
}

export default AccountsPage
