import { Alert, Card, Empty, List, Pagination, Skeleton, Tag, Typography } from 'antd'
import { formatTotalBalance } from '../../../lib/formatCurrency'
import { useTransactions } from '../hooks/useTransactions'
import { TRANSACTION_TYPE_COLORS, type TransactionsQueryParams } from '../types/TransactionTypes'
import styles from './TransactionList.module.css'

const { Text } = Typography

interface TransactionListProps {
  filters: TransactionsQueryParams
  onPageChange: (page: number) => void
}

function TransactionList({ filters, onPageChange }: TransactionListProps) {
  const { data, isLoading, isError, error } = useTransactions(filters)

  if (isLoading) return <Skeleton active paragraph={{ rows: 6 }} />

  if (isError) {
    const message = error.response?.data?.error ?? 'Failed to load transactions.'
    return <Alert type="error" message={message} showIcon />
  }

  if (!data || data.items.length === 0) {
    return <Empty description="No transactions found" />
  }

  return (
    <Card>
      <List
        dataSource={data.items}
        renderItem={(tx) => (
          <List.Item
            extra={
              <Text
                className={
                  tx.type === 'Income'
                    ? styles.incomeAmount
                    : tx.type === 'Expense'
                      ? styles.expenseAmount
                      : styles.installmentAmount
                }
              >
                {tx.type === 'Income' ? '+' : '-'}
                {formatTotalBalance(tx.amount)}
              </Text>
            }
          >
            <List.Item.Meta
              title={
                <Text>
                  <Text strong>{tx.category}</Text>
                  {' '}
                  <Tag color={TRANSACTION_TYPE_COLORS[tx.type]}>{tx.type}</Tag>
                </Text>
              }
              description={
                <>
                  <Text type="secondary">{new Date(tx.date).toLocaleDateString()}</Text>
                  {tx.description && <Text type="secondary"> · {tx.description}</Text>}
                </>
              }
            />
          </List.Item>
        )}
      />

      {data.totalCount > data.pageSize && (
        <Pagination
          current={data.page}
          pageSize={data.pageSize}
          total={data.totalCount}
          onChange={onPageChange}
          showSizeChanger={false}
          align="end"
        />
      )}
    </Card>
  )
}

export default TransactionList
