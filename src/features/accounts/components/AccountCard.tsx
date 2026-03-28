import { Button, Tag } from 'antd'
import { Link } from 'react-router-dom'
import { formatBalance } from '../../../lib/formatCurrency'
import { ROUTES } from '../../../router/routes'
import { ACCOUNT_TYPE_ICONS, ACCOUNT_TYPE_LABELS, type Account } from '../types/AccountTypes'
import styles from './AccountCard.module.css'

interface AccountCardProps {
  account: Account
  onEdit: (account: Account) => void
  onArchive: (account: Account) => void
  isArchiving: boolean
}

function AccountCard({ account, onEdit, onArchive, isArchiving }: AccountCardProps) {
  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <h3 className={styles.name}>
          <span className={styles.icon}>{ACCOUNT_TYPE_ICONS[account.type]}</span>
          {account.name}
        </h3>
        {account.isArchived && <Tag color="default">Archived</Tag>}
      </header>

      <p className={styles.meta}>{ACCOUNT_TYPE_LABELS[account.type]}</p>
      <p className={styles.balance}>{formatBalance(account.balance, account.currency)}</p>

      <div className={styles.actions}>
        <Link to={ROUTES.ACCOUNT_DETAIL(account.id)} className={styles.linkButton}>
          View detail
        </Link>
        <Button size="small" onClick={() => onEdit(account)} disabled={account.isArchived}>
          Edit
        </Button>
        <Button
          size="small"
          danger
          onClick={() => onArchive(account)}
          loading={isArchiving}
          disabled={account.isArchived}
        >
          Archive
        </Button>
      </div>
    </article>
  )
}

export default AccountCard
