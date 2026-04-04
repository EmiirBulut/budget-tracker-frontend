import { PlusOutlined } from '@ant-design/icons'
import { Button, Card, Col, Flex, Row, Typography } from 'antd'
import { useMemo, useState } from 'react'
import AddTransactionModal from '../features/transactions/components/AddTransactionModal'
import TransactionFiltersBar from '../features/transactions/components/TransactionFiltersBar'
import TransactionList from '../features/transactions/components/TransactionList'
import { useTransactions } from '../features/transactions/hooks/useTransactions'
import type { TransactionsQueryParams } from '../features/transactions/types/TransactionTypes'
import { formatBalance } from '../lib/formatCurrency'
import styles from './TransactionsPage.module.css'

const { Title, Text } = Typography

const DEFAULT_PAGE_SIZE = 20
const STATS_PAGE_SIZE = 500

function TransactionsPage() {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [filters, setFilters] = useState<TransactionsQueryParams>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  })

  const { startDate, endDate } = useMemo(() => {
    const now = new Date()
    return {
      startDate: new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0],
      endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0],
    }
  }, [])

  const { data: incomeData } = useTransactions({ type: 'Income', startDate, endDate, pageSize: STATS_PAGE_SIZE })
  const { data: expenseData } = useTransactions({ type: 'Expense', startDate, endDate, pageSize: STATS_PAGE_SIZE })

  const totalIncome = incomeData?.items.reduce((sum, t) => sum + t.amount, 0) ?? 0
  const totalExpense = expenseData?.items.reduce((sum, t) => sum + t.amount, 0) ?? 0
  const net = totalIncome - totalExpense

  const handleFiltersChange = (next: TransactionsQueryParams): void => {
    setFilters(next)
  }

  const handlePageChange = (page: number): void => {
    setFilters((prev) => ({ ...prev, page }))
  }

  return (
    <main className={styles.page}>

      {/* ── Header ── */}
      <Flex justify="space-between" align="center">
        <Flex vertical gap={2}>
          <Title level={3} className={styles.pageTitle}>Transactions</Title>
          <Text type="secondary">Track all your income, expenses, and installments</Text>
        </Flex>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddOpen(true)}>
          Add Transaction
        </Button>
      </Flex>

      {/* ── Monthly summary ── */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card className={styles.statCard}>
            <Text type="secondary" className={styles.statLabel}>Income This Month</Text>
            <Title level={4} className={styles.statAmountIncome}>{formatBalance(totalIncome, 'USD')}</Title>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className={styles.statCard}>
            <Text type="secondary" className={styles.statLabel}>Expenses This Month</Text>
            <Title level={4} className={styles.statAmountExpense}>{formatBalance(totalExpense, 'USD')}</Title>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className={styles.statCard}>
            <Text type="secondary" className={styles.statLabel}>Net Balance</Text>
            <Title level={4} className={net >= 0 ? styles.statAmountIncome : styles.statAmountExpense}>
              {net >= 0 ? '+' : ''}{formatBalance(net, 'USD')}
            </Title>
          </Card>
        </Col>
      </Row>

      <TransactionFiltersBar filters={filters} onFiltersChange={handleFiltersChange} />

      <TransactionList filters={filters} onPageChange={handlePageChange} />

      <AddTransactionModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </main>
  )
}

export default TransactionsPage
