import { Alert, Button, Skeleton, Tag } from 'antd'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import EditAccountModal from '../features/accounts/components/EditAccountModal'
import { useAccountDetail } from '../features/accounts/hooks/useAccountDetail'
import { useArchiveAccount } from '../features/accounts/hooks/useArchiveAccount'
import { formatBalance } from '../lib/formatCurrency'
import { ROUTES } from '../router/routes'
import styles from './AccountDetailPage.module.css'

function AccountDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [isEditOpen, setIsEditOpen] = useState(false)

  const { data: account, isLoading, isError, error } = useAccountDetail(id)
  const { mutate: archive, isPending: isArchiving } = useArchiveAccount()

  const handleArchive = (): void => {
    if (!account || account.isArchived) {
      return
    }

    archive(account.id, {
      onSuccess: () => {
        navigate(ROUTES.ACCOUNTS)
      },
    })
  }

  if (isLoading) {
    return <Skeleton active paragraph={{ rows: 6 }} />
  }

  if (isError) {
    const message = error.response?.data?.error ?? 'Failed to load account detail.'
    return <Alert type="error" message={message} showIcon />
  }

  if (!account) {
    return <Alert type="warning" message="Account not found." showIcon />
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{account.name}</h1>
          <p className={styles.subtitle}>Account detail</p>
        </div>

        <div className={styles.actions}>
          <Button onClick={() => setIsEditOpen(true)} disabled={account.isArchived}>
            Edit
          </Button>
          <Button danger loading={isArchiving} onClick={handleArchive} disabled={account.isArchived}>
            Archive
          </Button>
        </div>
      </header>

      <section className={styles.summaryCard}>
        <p className={styles.balance}>{formatBalance(account.balance, account.currency)}</p>
        <div className={styles.metaRow}>
          <Tag color="blue">{account.type}</Tag>
          <Tag>{account.currency}</Tag>
          {account.isArchived && <Tag color="default">Archived</Tag>}
        </div>
      </section>

      <section className={styles.placeholder}>
        Transaction list for this account will be connected in the Transactions phase.
      </section>

      <EditAccountModal isOpen={isEditOpen} account={account} onClose={() => setIsEditOpen(false)} />
    </main>
  )
}

export default AccountDetailPage
