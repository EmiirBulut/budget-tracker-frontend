import { RightOutlined } from '@ant-design/icons'
import { Card, Flex, Tag, Typography } from 'antd'
import { Link } from 'react-router-dom'
import { formatBalance } from '../../../lib/formatCurrency'
import { ROUTES } from '../../../router/routes'
import {
  ACCOUNT_TYPE_ICONS,
  ACCOUNT_TYPE_LABELS,
  ACCOUNT_TYPE_TAG_COLORS,
  type Account,
} from '../types/AccountTypes'
import styles from './AccountCard.module.css'

const { Text } = Typography

interface AccountCardProps {
  account: Account
}

function AccountCard({ account }: AccountCardProps) {
  return (
    <Card hoverable className={styles.card}>
      <Flex justify="space-between" align="center" className={styles.cardHeader}>
        <Flex align="center" gap={8} wrap>
          <Text className={styles.typeIcon}>{ACCOUNT_TYPE_ICONS[account.type]}</Text>
          <Text strong>{account.name}</Text>
          <Tag color={ACCOUNT_TYPE_TAG_COLORS[account.type]}>
            {ACCOUNT_TYPE_LABELS[account.type]}
          </Tag>
          {account.isArchived && <Tag color="default">Archived</Tag>}
        </Flex>
        <Link to={ROUTES.ACCOUNT_DETAIL(account.id)}>
          <RightOutlined className={styles.arrow} />
        </Link>
      </Flex>
      <Flex vertical gap={6}>
        <Text type="secondary" className={styles.balanceLabel}>Current Balance</Text>
        <Flex justify="space-between" align="center">
          <Text className={styles.balanceAmount}>
            {formatBalance(account.balance, account.currency)}
          </Text>
          <Tag className={styles.currencyTag}>{account.currency}</Tag>
        </Flex>
      </Flex>
    </Card>
  )
}

export default AccountCard
