import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import { Alert, Avatar, Card, Empty, Flex, Pagination, Skeleton, Tag, Typography } from 'antd'
import { useAccounts } from '../../accounts/hooks/useAccounts'
import { useCards } from '../../cards/hooks/useCards'
import { formatBalance } from '../../../lib/formatCurrency'
import { useTransactions } from '../hooks/useTransactions'
import type { Transaction, TransactionsQueryParams } from '../types/TransactionTypes'
import styles from './TransactionList.module.css'

const { Text } = Typography

const CATEGORY_EMOJIS: Record<string, string> = {
  food: '🍔', groceries: '🛒', transport: '🚗', gas: '🚗',
  salary: '💼', wages: '💼', shopping: '🛍️', clothing: '👗',
  entertainment: '🎬', movies: '🎬', bills: '💡', electricity: '💡',
  utilities: '⚡', freelance: '💻', website: '💻', tech: '💻',
  health: '🏥', doctor: '🏥', medical: '💊', travel: '✈️',
  restaurant: '🍽️', dining: '🍽️', gym: '🏋️', sports: '⚽',
  rent: '🏠', housing: '🏠',
}

function getCategoryEmoji(category: string): string {
  return CATEGORY_EMOJIS[category.toLowerCase()] ?? '💳'
}

function formatTxDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

interface TransactionRowProps {
  tx: Transaction
  accountName?: string
  cardName?: string
}

function TransactionRow({ tx, accountName, cardName }: TransactionRowProps) {
  const isIncome = tx.type === 'Income'
  const isInstallment = tx.type === 'Installment'

  const amountText = isIncome
    ? `+${formatBalance(tx.amount, 'USD')}`
    : `-${formatBalance(tx.amount, 'USD')}`

  const source = accountName ?? cardName

  return (
    <Flex align="center" justify="space-between" className={styles.txRow}>
      <Flex align="center" gap={12} className={styles.txLeft}>
        <Avatar className={styles.txAvatar} size={44}>
          {getCategoryEmoji(tx.category)}
        </Avatar>
        <Flex vertical gap={3}>
          <Text strong className={styles.txDescription}>
            {tx.description || tx.category}
          </Text>
          <Flex align="center" gap={6} wrap>
            <Text type="secondary" className={styles.txMeta}>{tx.category}</Text>
            <Text type="secondary" className={styles.txMetaDot}>·</Text>
            <Text type="secondary" className={styles.txMeta}>{formatTxDate(tx.date)}</Text>
            {source && (
              <>
                <Text type="secondary" className={styles.txMetaDot}>·</Text>
                <Text type="secondary" className={styles.txMeta}>{source}</Text>
              </>
            )}
          </Flex>
        </Flex>
      </Flex>

      <Flex align="center" gap={10} className={styles.txRight}>
        <Flex vertical align="flex-end" gap={4}>
          <Text className={isIncome ? styles.amountIncome : isInstallment ? styles.amountInstallment : styles.amountExpense}>
            {amountText}
          </Text>
          <Tag
            color={isIncome ? 'green' : isInstallment ? 'blue' : 'red'}
            className={styles.typeTag}
          >
            {tx.type}
          </Tag>
        </Flex>
        <span className={isIncome ? styles.iconIncome : isInstallment ? styles.iconInstallment : styles.iconExpense}>
          {isIncome && <ArrowDownOutlined />}
          {isInstallment && <ClockCircleOutlined />}
          {!isIncome && !isInstallment && <ArrowUpOutlined />}
        </span>
      </Flex>
    </Flex>
  )
}

interface TransactionListProps {
  filters: TransactionsQueryParams
  onPageChange: (page: number) => void
}

function TransactionList({ filters, onPageChange }: TransactionListProps) {
  const { data, isLoading, isError, error } = useTransactions(filters)
  const { data: accounts } = useAccounts()
  const { data: cards } = useCards()

  if (isLoading) return <Skeleton active paragraph={{ rows: 8 }} />

  if (isError) {
    const message = error.response?.data?.error ?? 'Failed to load transactions.'
    return <Alert type="error" message={message} showIcon />
  }

  if (!data || data.items.length === 0) {
    return <Empty description="No transactions found" />
  }

  const getAccountName = (id: string | null): string | undefined =>
    id ? accounts?.find((a) => a.id === id)?.name : undefined

  const getCardName = (id: string | null): string | undefined => {
    if (!id) return undefined
    const card = cards?.find((c) => c.id === id)
    return card ? `${card.name} ···· ${card.last4Digits}` : undefined
  }

  return (
    <Card className={styles.listCard}>
      <Flex vertical>
        {data.items.map((tx) => (
          <TransactionRow
            key={tx.id}
            tx={tx}
            accountName={getAccountName(tx.accountId)}
            cardName={getCardName(tx.cardId)}
          />
        ))}
      </Flex>

      {data.totalCount > data.pageSize && (
        <Flex justify="flex-end" className={styles.paginationRow}>
          <Pagination
            current={data.page}
            pageSize={data.pageSize}
            total={data.totalCount}
            onChange={onPageChange}
            showSizeChanger={false}
            showTotal={(total, range) => `${range[0]}–${range[1]} of ${total}`}
          />
        </Flex>
      )}
    </Card>
  )
}

export default TransactionList
