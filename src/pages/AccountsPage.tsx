import { Button } from 'antd'
import { useState } from 'react'
import type { Account } from '../features/accounts/types/AccountTypes'
import AddAccountModal from '../features/accounts/components/AddAccountModal'
import EditAccountModal from '../features/accounts/components/EditAccountModal'
import AccountList from '../features/accounts/components/AccountList'
import styles from './AccountsPage.module.css'

function AccountsPage() {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)

  const handleOpenAdd = (): void => {
    setIsAddOpen(true)
  }

  const handleCloseAdd = (): void => {
    setIsAddOpen(false)
  }

  const handleOpenEdit = (account: Account): void => {
    setEditingAccount(account)
  }

  const handleCloseEdit = (): void => {
    setEditingAccount(null)
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Accounts</h1>
          <p className={styles.description}>Manage bank accounts, cash, and e-wallet balances.</p>
        </div>

        <Button type="primary" onClick={handleOpenAdd}>
          Add account
        </Button>
      </header>

      <AccountList onEdit={handleOpenEdit} />

      <AddAccountModal isOpen={isAddOpen} onClose={handleCloseAdd} />
      <EditAccountModal isOpen={editingAccount !== null} account={editingAccount} onClose={handleCloseEdit} />
    </main>
  )
}

export default AccountsPage
