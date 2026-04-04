import {
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ArrowUpOutlined,
  BankOutlined,
  DollarCircleOutlined,
  EditOutlined,
  InboxOutlined,
  MobileOutlined,
} from '@ant-design/icons'
import { Alert, Avatar, Button, Card, Col, Divider, Flex, Row, Skeleton, Tag, Typography } from 'antd'
import { useMemo, useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import EditAccountModal from '../features/accounts/components/EditAccountModal'
import { useAccountDetail } from '../features/accounts/hooks/useAccountDetail'
import { useArchiveAccount } from '../features/accounts/hooks/useArchiveAccount'
import { AccountType, ACCOUNT_TYPE_LABELS } from '../features/accounts/types/AccountTypes'
import { useTransactions } from '../features/transactions/hooks/useTransactions'
import type { TransactionType } from '../features/transactions/types/TransactionTypes'
import { formatBalance } from '../lib/formatCurrency'
import { ROUTES } from '../router/routes'
import styles from './AccountDetailPage.module.css'

const { Title, Text } = Typography

const headerTypeIcons: Record<AccountType, ReactNode> = {
  [AccountType.BankAccount]: <BankOutlined />,
  [AccountType.Cash]: <DollarCircleOutlined />,
  [AccountType.EWallet]: <MobileOutlined />,
}

const CATEGORY_EMOJIS: Record<string, string> = {
  food: '🍔', groceries: '🛒', transport: '🚗', gas: '🚗',
  salary: '💼', wages: '💼', shopping: '🛍️', clothing: '👗',
  entertainment: '🎬', movies: '🎬', bills: '💡', electricity: '💡',
  utilities: '⚡', freelance: '💻', website: '💻', tech: '💻',
  health: '🏥', doctor: '🏥', medical: '💊', travel: '✈️',
  restaurant: '🍽️', dining: '🍽️', gym: '🏋️', sports: '⚽',
}

function getCategoryEmoji(category: string): string {
  return CATEGORY_EMOJIS[category.toLowerCase()] ?? '💳'
}

function formatTxDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatTxAmount(amount: number, type: TransactionType, currency: string): string {
  const formatted = formatBalance(amount, currency)
  return type === 'Income' ? `+${formatted}` : `-${formatted}`
}

function AccountDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [isEditOpen, setIsEditOpen] = useState(false)

  const { data: account, isLoading, isError, error } = useAccountDetail(id)
  const { mutate: archive, isPending: isArchiving } = useArchiveAccount()

  const { startDate, endDate } = useMemo(() => {
    const now = new Date()
    return {
      startDate: new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0],
      endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0],
    }
  }, [])

  const { data: incomeData } = useTransactions({ accountId: id, type: 'Income', startDate, endDate })
  const { data: expenseData } = useTransactions({ accountId: id, type: 'Expense', startDate, endDate })
  const { data: recentData } = useTransactions({ accountId: id, pageSize: 10 })

  const totalIncome = incomeData?.items.reduce((sum, t) => sum + t.amount, 0) ?? 0
  const totalExpense = expenseData?.items.reduce((sum, t) => sum + t.amount, 0) ?? 0

  const handleArchive = (): void => {
    if (!account || account.isArchived) return
    archive(account.id, { onSuccess: () => navigate(ROUTES.ACCOUNTS) })
  }

  if (isLoading) return <Skeleton active paragraph={{ rows: 8 }} />

  if (isError) {
    const message = error.response?.data?.error ?? 'Failed to load account detail.'
    return <Alert type="error" message={message} showIcon />
  }

  if (!account) return <Alert type="warning" message="Account not found." showIcon />

  return (
    <main className={styles.page}>
      {/* Page header */}
      <Flex justify="space-between" align="center">
        <Flex align="center" gap={12}>
          <Button
            shape="circle"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(ROUTES.ACCOUNTS)}
          />
          <Title level={3} className={styles.pageTitle}>Account Details</Title>
        </Flex>
        <Flex gap={8}>
          <Button
            icon={<EditOutlined />}
            onClick={() => setIsEditOpen(true)}
            disabled={account.isArchived}
          >
            Edit
          </Button>
          <Button
            icon={<InboxOutlined />}
            loading={isArchiving}
            onClick={handleArchive}
            disabled={account.isArchived}
          >
            Archive
          </Button>
        </Flex>
      </Flex>

      {/* Blue account header card */}
      <Card variant="borderless" className={styles.headerCard}>
        <Flex align="center" gap={16} className={styles.headerTop}>
          <Text className={styles.headerTypeIcon}>{headerTypeIcons[account.type]}</Text>
          <Flex vertical gap={6}>
            <Title level={4} className={styles.headerName}>{account.name}</Title>
            <Tag className={styles.headerTypeTag}>{ACCOUNT_TYPE_LABELS[account.type]}</Tag>
          </Flex>
        </Flex>
        <Divider className={styles.headerDivider} />
        <Flex justify="space-between" align="flex-end">
          <Flex vertical gap={4}>
            <Text className={styles.headerBalanceLabel}>Current Balance</Text>
            <Title level={2} className={styles.headerBalanceAmount}>
              {formatBalance(account.balance, account.currency)}
            </Title>
          </Flex>
          <Tag className={styles.currencyBadge}>{account.currency}</Tag>
        </Flex>
      </Card>

      {/* Income / Expense summary */}
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Card>
            <Flex align="center" gap={10} className={styles.summaryHeader}>
              <Avatar className={styles.incomeAvatar} icon={<ArrowDownOutlined />} size={32} />
              <Text type="secondary">Income</Text>
            </Flex>
            <Title level={3} className={styles.summaryAmount}>
              {formatBalance(totalIncome, account.currency)}
            </Title>
            <Text type="secondary" className={styles.summaryPeriod}>This month</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card>
            <Flex align="center" gap={10} className={styles.summaryHeader}>
              <Avatar className={styles.expenseAvatar} icon={<ArrowUpOutlined />} size={32} />
              <Text type="secondary">Expenses</Text>
            </Flex>
            <Title level={3} className={styles.summaryAmount}>
              {formatBalance(totalExpense, account.currency)}
            </Title>
            <Text type="secondary" className={styles.summaryPeriod}>This month</Text>
          </Card>
        </Col>
      </Row>

      {/* Recent Transactions */}
      <Card
        title={<Text strong>Recent Transactions</Text>}
        extra={<Link to={ROUTES.TRANSACTIONS}><Text className={styles.viewAll}>View All</Text></Link>}
      >
        {!recentData || recentData.items.length === 0 ? (
          <Text type="secondary">No transactions for this account yet.</Text>
        ) : (
          <Flex vertical>
            {recentData.items.map((tx) => (
              <Flex key={tx.id} align="center" justify="space-between" className={styles.txRow}>
                <Flex align="center" gap={12}>
                  <Avatar className={styles.txAvatar} size={40}>
                    {getCategoryEmoji(tx.category)}
                  </Avatar>
                  <Flex vertical gap={2}>
                    <Text className={styles.txName}>{tx.description}</Text>
                    <Text className={styles.txDate}>{formatTxDate(tx.date)}</Text>
                  </Flex>
                </Flex>
                <Text className={tx.type === 'Income' ? styles.txAmountIncome : styles.txAmountExpense}>
                  {formatTxAmount(tx.amount, tx.type, account.currency)}
                </Text>
              </Flex>
            ))}
          </Flex>
        )}
      </Card>

      <EditAccountModal isOpen={isEditOpen} account={account} onClose={() => setIsEditOpen(false)} />
    </main>
  )
}

export default AccountDetailPage
