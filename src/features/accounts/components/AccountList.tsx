import { Alert, Empty, Skeleton } from 'antd'
import { useArchiveAccount } from '../hooks/useArchiveAccount'
import { useAccounts } from '../hooks/useAccounts'
import type { Account } from '../types/AccountTypes'
import AccountCard from './AccountCard'
import styles from './AccountList.module.css'

interface AccountListProps {
  onEdit: (account: Account) => void
}

function AccountList({ onEdit }: AccountListProps) {
  const { data, isLoading, isError, error } = useAccounts()
  const { mutate: archive, isPending: isArchiving } = useArchiveAccount()

  const handleArchive = (account: Account): void => {
    archive(account.id)
  }

  if (isLoading) {
    return (
      <div className={styles.grid}>
        <Skeleton active paragraph={{ rows: 4 }} />
        <Skeleton active paragraph={{ rows: 4 }} />
      </div>
    )
  }

  if (isError) {
    const message = error.response?.data?.error ?? 'Failed to load accounts.'
    return <Alert type="error" message={message} showIcon />
  }

  if (!data || data.length === 0) {
    return <Empty description="No accounts yet" />
  }

  return (
    <div className={styles.grid}>
      {data.map((account) => (
        <AccountCard
          key={account.id}
          account={account}
          onEdit={onEdit}
          onArchive={handleArchive}
          isArchiving={isArchiving}
        />
      ))}
    </div>
  )
}

export default AccountList
