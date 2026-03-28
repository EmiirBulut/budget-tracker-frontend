import {
  ArrowDownOutlined,
  ArrowRightOutlined,
  ArrowUpOutlined,
  ScheduleOutlined,
} from '@ant-design/icons'
import { Alert, Card, Col, List, Row, Skeleton, Statistic, Tag, Typography } from 'antd'
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

const { Title, Text } = Typography

const CHART_COLORS = ['#2563eb', '#7c3aed', '#059669', '#ea580c', '#dc2626', '#0891b2']

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
  const totalBalance = safeAccounts.reduce((sum, a) => sum + a.balance, 0)
  const recentAccounts = safeAccounts.slice(0, 4)
  const recentTransactions = transactionsData?.items ?? []

  const chartData = (report?.byCategory ?? []).slice(0, 6).map((item) => ({
    name: item.category,
    value: item.total,
  }))

  return (
    <main className={styles.page}>
      <div>
        <Title level={4} style={{ marginBottom: 0 }}>Dashboard</Title>
        <Text type="secondary">Welcome, {user?.email}</Text>
      </div>

      {isAccountsError && (
        <Alert type="warning" showIcon message="Accounts data is unavailable right now." />
      )}

      {/* Hero balance card */}
      <Card className={styles.balanceCard}>
        <Text className={styles.heroLabel}>Current Balance</Text>
        <Title level={2} className={styles.heroAmount}>
          {formatTotalBalance(totalBalance)}
        </Title>
        <Row gutter={12}>
          <Col span={12}>
            <Card className={styles.heroSubCard}>
              <Text className={styles.heroSubLabel}>Income</Text>
              <Title level={4} className={styles.heroSubAmount}>
                {formatTotalBalance(report?.totalIncome ?? 0)}
              </Title>
            </Card>
          </Col>
          <Col span={12}>
            <Card className={styles.heroSubCard}>
              <Text className={styles.heroSubLabel}>Expenses</Text>
              <Title level={4} className={styles.heroSubAmount}>
                {formatTotalBalance(report?.totalExpense ?? 0)}
              </Title>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* My Accounts */}
      <Card
        title={<Text strong>My Accounts</Text>}
        extra={<Link to={ROUTES.ACCOUNTS}>View All →</Link>}
        size="small"
      >
        {isAccountsLoading ? (
          <Skeleton active paragraph={{ rows: 2 }} />
        ) : recentAccounts.length === 0 ? (
          <Text type="secondary">No accounts yet.</Text>
        ) : (
          <Row gutter={[12, 12]}>
            {recentAccounts.map((account) => (
              <Col key={account.id} xs={24} sm={12} md={6}>
                <Link to={ROUTES.ACCOUNT_DETAIL(account.id)}>
                  <Card size="small" hoverable className={styles.accountMiniCard}>
                    <Text strong>{account.name}</Text>
                    <br />
                    <Tag color="blue">{ACCOUNT_TYPE_LABELS[account.type]}</Tag>
                    <br />
                    <Text type="secondary">Current Balance</Text>
                    <br />
                    <Text strong>{formatBalance(account.balance, account.currency)}</Text>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        )}
      </Card>

      {/* Stats row */}
      <Row gutter={[12, 12]}>
        <Col xs={24} sm={8}>
          <Card size="small">
            <Statistic
              title="Total Expenses"
              value={formatTotalBalance(report?.totalExpense ?? 0)}
              prefix={<ArrowDownOutlined />}
              valueStyle={{ color: '#dc2626' }}
            />
            <Text type="secondary">This month</Text>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small">
            <Statistic
              title="Total Income"
              value={formatTotalBalance(report?.totalIncome ?? 0)}
              prefix={<ArrowUpOutlined />}
              valueStyle={{ color: '#16a34a' }}
            />
            <Text type="secondary">This month</Text>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small">
            <Statistic
              title="Upcoming"
              value="—"
              prefix={<ScheduleOutlined />}
              valueStyle={{ color: '#f97316' }}
            />
            <Text type="secondary">Installments</Text>
          </Card>
        </Col>
      </Row>

      {/* Charts + Recent Transactions */}
      <Row gutter={[12, 12]}>
        <Col xs={24} md={12}>
          <Card title={<Text strong>Category Breakdown</Text>}>
            {isReportLoading ? (
              <Skeleton active paragraph={{ rows: 4 }} />
            ) : chartData.length === 0 ? (
              <Text type="secondary">No expenses yet this month.</Text>
            ) : (
              <div className={styles.chartWrap}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95}>
                      {chartData.map((entry, index) => (
                        <Cell key={`slice-${entry.name}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
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
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            title={<Text strong>Recent Transactions</Text>}
            extra={<Link to={ROUTES.TRANSACTIONS}>View All <ArrowRightOutlined /></Link>}
          >
            {isTransactionsLoading ? (
              <Skeleton active paragraph={{ rows: 5 }} />
            ) : (
              <List
                dataSource={recentTransactions}
                locale={{ emptyText: 'No transactions yet.' }}
                renderItem={(transaction) => (
                  <List.Item
                    extra={
                      <Text
                        className={
                          transaction.type === 'Income' ? styles.incomeAmount : styles.expenseAmount
                        }
                      >
                        {transaction.type === 'Income' ? '+' : '-'}
                        {formatTotalBalance(transaction.amount)}
                      </Text>
                    }
                  >
                    <List.Item.Meta
                      title={<Text strong>{transaction.category}</Text>}
                      description={new Date(transaction.date).toLocaleDateString()}
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>
    </main>
  )
}

export default DashboardPage
