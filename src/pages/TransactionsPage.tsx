import { Button, Typography } from 'antd'
import { useState } from 'react'
import AddTransactionModal from '../features/transactions/components/AddTransactionModal'
import TransactionFiltersBar from '../features/transactions/components/TransactionFiltersBar'
import TransactionList from '../features/transactions/components/TransactionList'
import type { TransactionsQueryParams } from '../features/transactions/types/TransactionTypes'
import styles from './TransactionsPage.module.css'

const { Title, Text } = Typography

const DEFAULT_PAGE_SIZE = 20

function TransactionsPage() {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [filters, setFilters] = useState<TransactionsQueryParams>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  })

  const handleFiltersChange = (next: TransactionsQueryParams): void => {
    setFilters(next)
  }

  const handlePageChange = (page: number): void => {
    setFilters((prev) => ({ ...prev, page }))
  }

  return (
    <main className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <Title level={3} style={{ margin: 0 }}>Transactions</Title>
          <Text type="secondary">Log and filter all income, expenses, and installments.</Text>
        </div>
        <Button type="primary" size="large" onClick={() => setIsAddOpen(true)}>
          Add transaction
        </Button>
      </div>

      <TransactionFiltersBar filters={filters} onFiltersChange={handleFiltersChange} />

      <TransactionList filters={filters} onPageChange={handlePageChange} />

      <AddTransactionModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </main>
  )
}

export default TransactionsPage
