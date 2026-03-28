import { ArrowRightOutlined } from '@ant-design/icons'
import { Button, Card, Space, Tag, Typography } from 'antd'
import { Link } from 'react-router-dom'
import { formatBalance } from '../../../lib/formatCurrency'
import { ROUTES } from '../../../router/routes'
import { ACCOUNT_TYPE_ICONS, ACCOUNT_TYPE_LABELS, type Account } from '../types/AccountTypes'
import styles from './AccountCard.module.css'

const { Text } = Typography

interface AccountCardProps {
  account: Account
  onEdit: (account: Account) => void
  onArchive: (account: Account) => void
  isArchiving: boolean
}

function AccountCard({ account, onEdit, onArchive, isArchiving }: AccountCardProps) {
  return (
    <Card
      hoverable
      extra={
        <Link to={ROUTES.ACCOUNT_DETAIL(account.id)}>
          <ArrowRightOutlined />
        </Link>
      }
    >
      <Space direction="vertical" size={4}>
        <Space align="center">
          <Text className={styles.typeIcon}>{ACCOUNT_TYPE_ICONS[account.type]}</Text>
          <Text strong>{account.name}</Text>
          <Tag color="blue">{ACCOUNT_TYPE_LABELS[account.type]}</Tag>
          {account.isArchived && <Tag color="default">Archived</Tag>}
        </Space>

        <Text type="secondary">Current Balance</Text>
        <Text className={styles.balance}>
          {formatBalance(account.balance, account.currency)}
        </Text>

        <Space>
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
        </Space>
      </Space>
    </Card>
  )
}

export default AccountCard
