import { Alert, Skeleton } from 'antd'
import { Link } from 'react-router-dom'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { useAccounts } from '../features/accounts/hooks/useAccounts'
import { ACCOUNT_TYPE_LABELS } from '../features/accounts/types/AccountTypes'
import { useAuthStore } from '../features/auth/store/authStore'
import { useReport } from '../features/reports/hooks/useReport'
import { useTransactions } from '../features/transactions/hooks/useTransactions'
import { formatBalance, formatTotalBalance } from '../lib/formatCurrency'
import { ROUTES } from '../router/routes'
import styles from './DashboardPage.module.css'

function DashboardPage() {
  const { user } = useAuthStore()
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const { data: accounts, isLoading: isAccountsLoading, isError: isAccountsError } = useAccounts()
  const { data: transactionsData, isLoading: isTransactionsLoading } = useTransactions({ page: 1, pageSize: 10 })
  const { data: report, isLoading: isReportLoading } = useReport({
    from: monthStart.toISOString(),
    to: monthEnd.toISOString(),
  })

  const safeAccounts = accounts ?? []
  const totalBalance = safeAccounts.reduce((total, account) => total + account.balance, 0)
  const activeAccountsCount = safeAccounts.filter((account) => !account.isArchived).length
  const recentAccounts = safeAccounts.slice(0, 4)
  const recentTransactions = transactionsData?.items ?? []

  const chartData = (report?.byCategory ?? []).slice(0, 6).map((item) => ({
    name: item.category,
    value: item.total,
  }))

  const chartColors = ['#2563eb', '#7c3aed', '#059669', '#ea580c', '#dc2626', '#0891b2']

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Dashboard</h1>
      <p className={styles.welcome}>Welcome, {user?.email}</p>

      {isAccountsError && (
        <Alert type="warning" showIcon message="Accounts data is unavailable right now." className={styles.alert} />
      )}

      <section className={styles.summaryGrid}>
        <article className={styles.summaryCard}>
          <h2 className={styles.summaryLabel}>Total Balance</h2>
          <p className={styles.summaryValue}>{formatTotalBalance(totalBalance)}</p>
        </article>
        <article className={styles.summaryCard}>
          <h2 className={styles.summaryLabel}>Active Accounts</h2>
          <p className={styles.summaryValue}>{activeAccountsCount}</p>
        </article>
        <article className={styles.summaryCard}>
          <h2 className={styles.summaryLabel}>This Month Income</h2>
          <p className={styles.summaryValue}>{formatTotalBalance(report?.totalIncome ?? 0)}</p>
        </article>
        <article className={styles.summaryCard}>
          <h2 className={styles.summaryLabel}>This Month Expense</h2>
          <p className={styles.summaryValue}>{formatTotalBalance(report?.totalExpense ?? 0)}</p>
        </article>
      </section>

      <section className={styles.grid}>
        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Account Snapshot</h2>
            <Link to={ROUTES.ACCOUNTS}>View all</Link>
          </div>

          {isAccountsLoading ? (
            <Skeleton active paragraph={{ rows: 4 }} />
          ) : recentAccounts.length === 0 ? (
            <p className={styles.emptyText}>No accounts yet.</p>
          ) : (
            <ul className={styles.list}>
              {recentAccounts.map((account) => (
                <li key={account.id} className={styles.row}>
                  <div>
                    <Link to={ROUTES.ACCOUNT_DETAIL(account.id)} className={styles.rowTitle}>
                      {account.name}
                    </Link>
                    <p className={styles.rowSub}>{ACCOUNT_TYPE_LABELS[account.type]}</p>
                  </div>
                  <span className={styles.rowAmount}>{formatBalance(account.balance, account.currency)}</span>
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Recent Transactions</h2>
            <Link to={ROUTES.TRANSACTIONS}>View all</Link>
          </div>

          {isTransactionsLoading ? (
            <Skeleton active paragraph={{ rows: 4 }} />
          ) : recentTransactions.length === 0 ? (
            <p className={styles.emptyText}>No transactions available.</p>
          ) : (
            <ul className={styles.list}>
              {recentTransactions.map((transaction) => (
                <li key={transaction.id} className={styles.row}>
                  <div>
                    <p className={styles.rowTitle}>{transaction.category}</p>
                    <p className={styles.rowSub}>{new Date(transaction.date).toLocaleDateString()}</p>
                  </div>
                  <span
                    className={
                      transaction.type === 'Income' ? styles.incomeAmount : styles.expenseAmount
                    }
                  >
                    {transaction.type === 'Income' ? '+' : '-'}
                    {formatTotalBalance(transaction.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>Spending by Category (This Month)</h2>
          <Link to={ROUTES.REPORTS}>Open reports</Link>
        </div>

        {isReportLoading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : chartData.length === 0 ? (
          <p className={styles.emptyText}>No category data for this month.</p>
        ) : (
          <div className={styles.chartWrap}>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95}>
                  {chartData.map((entry, index) => (
                    <Cell key={`slice-${entry.name}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => {
                    const numericValue = typeof value === 'number' ? value : Number(value ?? 0)
                    return formatTotalBalance(Number.isFinite(numericValue) ? numericValue : 0)
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>
    </main>
  )
}

export default DashboardPage
