import { Alert, Empty, Pagination, Skeleton, Tag } from 'antd'
import { formatTotalBalance } from '../../../lib/formatCurrency'
import { useTransactions } from '../hooks/useTransactions'
import type { TransactionsQueryParams } from '../types/TransactionTypes'
import styles from './TransactionList.module.css'

interface TransactionListProps {
  filters: TransactionsQueryParams
  onPageChange: (page: number) => void
}

function TransactionList({ filters, onPageChange }: TransactionListProps) {
  const { data, isLoading, isError, error } = useTransactions(filters)

  if (isLoading) {
    return <Skeleton active paragraph={{ rows: 6 }} />
  }

  if (isError) {
    const message = error.response?.data?.error ?? 'Failed to load transactions.'
    return <Alert type="error" message={message} showIcon />
  }

  if (!data || data.items.length === 0) {
    return <Empty description="No transactions found" />
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.table}>
        {data.items.map((tx) => (
          <div key={tx.id} className={styles.row}>
            <div>
              <p className={styles.category}>{tx.category}</p>
              {tx.description && <p className={styles.description}>{tx.description}</p>}
            </div>
            <span className={styles.date}>{new Date(tx.date).toLocaleDateString()}</span>
            <Tag color={tx.type === 'Income' ? 'green' : tx.type === 'Expense' ? 'red' : 'blue'}>{tx.type}</Tag>
            <span
              className={`${styles.amount} ${tx.type === 'Income' ? styles.income : tx.type === 'Expense' ? styles.expense : styles.installment}`}
            >
              {tx.type === 'Income' ? '+' : '-'}
              {formatTotalBalance(tx.amount)}
            </span>
          </div>
        ))}
      </div>

      <div className={styles.pagination}>
        <Pagination
          current={data.page}
          pageSize={data.pageSize}
          total={data.totalCount}
          onChange={onPageChange}
          showSizeChanger={false}
          hideOnSinglePage
        />
      </div>
    </div>
  )
}

export default TransactionList
