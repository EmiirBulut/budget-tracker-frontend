import { PlusOutlined } from '@ant-design/icons'
import { Button, Typography } from 'antd'
import { useState } from 'react'
import AddAccountModal from '../features/accounts/components/AddAccountModal'
import AccountList from '../features/accounts/components/AccountList'
import EditAccountModal from '../features/accounts/components/EditAccountModal'
import type { Account } from '../features/accounts/types/AccountTypes'
import styles from './AccountsPage.module.css'

const { Title, Text } = Typography

function AccountsPage() {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)

  const handleOpenAdd = (): void => setIsAddOpen(true)
  const handleCloseAdd = (): void => setIsAddOpen(false)
  const handleOpenEdit = (account: Account): void => setEditingAccount(account)
  const handleCloseEdit = (): void => setEditingAccount(null)

  return (
    <main className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <Title level={3} style={{ marginBottom: 0 }}>Accounts</Title>
          <Text type="secondary">Manage your financial accounts</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenAdd}>
          Add Account
        </Button>
      </div>

      <AccountList onEdit={handleOpenEdit} />

      <AddAccountModal isOpen={isAddOpen} onClose={handleCloseAdd} />
      <EditAccountModal isOpen={editingAccount !== null} account={editingAccount} onClose={handleCloseEdit} />
    </main>
  )
}

export default AccountsPage
