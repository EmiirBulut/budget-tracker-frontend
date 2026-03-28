import { Button } from 'antd'
import { useState } from 'react'
import AddTransactionModal from '../features/transactions/components/AddTransactionModal'
import TransactionFiltersBar from '../features/transactions/components/TransactionFiltersBar'
import TransactionList from '../features/transactions/components/TransactionList'
import type { TransactionsQueryParams } from '../features/transactions/types/TransactionTypes'
import styles from './AccountsPage.module.css'

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
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Transactions</h1>
          <p className={styles.description}>Log and filter all income, expenses, and installments.</p>
        </div>

        <Button type="primary" onClick={() => setIsAddOpen(true)}>
          Add transaction
        </Button>
      </header>

      <TransactionFiltersBar filters={filters} onFiltersChange={handleFiltersChange} />

      <TransactionList filters={filters} onPageChange={handlePageChange} />

      <AddTransactionModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </main>
  )
}

export default TransactionsPage
