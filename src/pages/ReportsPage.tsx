import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  ExportOutlined,
  SwapOutlined,
} from '@ant-design/icons'
import { Avatar, Button, Card, Col, Divider, Empty, Flex, Row, Skeleton, Tag, Typography } from 'antd'
import { type ReactNode, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useReport } from '../features/reports/hooks/useReport'
import { usePreferences } from '../features/settings/hooks/usePreferences'
import { useTransactions } from '../features/transactions/hooks/useTransactions'
import { formatTotalBalance } from '../lib/formatCurrency'
import styles from './ReportsPage.module.css'

const { Title, Text } = Typography

// ── Period ────────────────────────────────────────────────────────────────────

type PeriodKey = 'daily' | 'weekly' | 'monthly' | 'yearly'

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const CATEGORY_EMOJIS: Record<string, string> = {
  Food: '🍔',
  Transportation: '🚗',
  Shopping: '🛍️',
  Entertainment: '🎬',
  Bills: '💡',
  Healthcare: '💊',
  Other: '📝',
  Salary: '💼',
  Freelance: '💻',
  Investment: '📈',
}

function toDateStr(d: Date): string {
  return d.toISOString().split('T')[0]
}

function getPeriodRange(period: PeriodKey): { from: string; to: string } {
  const now = new Date()
  const y = now.getFullYear()
  const mo = now.getMonth()
  const d = now.getDate()

  switch (period) {
    case 'daily':
      return { from: toDateStr(now), to: toDateStr(now) }
    case 'weekly': {
      const diffToMon = (now.getDay() + 6) % 7
      return {
        from: toDateStr(new Date(y, mo, d - diffToMon)),
        to: toDateStr(new Date(y, mo, d - diffToMon + 6)),
      }
    }
    case 'monthly':
      return {
        from: toDateStr(new Date(y, mo, 1)),
        to: toDateStr(new Date(y, mo + 1, 0)),
      }
    case 'yearly':
      return {
        from: toDateStr(new Date(y, 0, 1)),
        to: toDateStr(new Date(y, 11, 31)),
      }
  }
}

function getPrevPeriodRange(period: PeriodKey): { from: string; to: string } {
  const now = new Date()
  const y = now.getFullYear()
  const mo = now.getMonth()
  const d = now.getDate()

  switch (period) {
    case 'daily': {
      const prev = new Date(y, mo, d - 1)
      return { from: toDateStr(prev), to: toDateStr(prev) }
    }
    case 'weekly': {
      const diffToMon = (now.getDay() + 6) % 7
      return {
        from: toDateStr(new Date(y, mo, d - diffToMon - 7)),
        to: toDateStr(new Date(y, mo, d - diffToMon - 1)),
      }
    }
    case 'monthly':
      return {
        from: toDateStr(new Date(y, mo - 1, 1)),
        to: toDateStr(new Date(y, mo, 0)),
      }
    case 'yearly':
      return {
        from: toDateStr(new Date(y - 1, 0, 1)),
        to: toDateStr(new Date(y - 1, 11, 31)),
      }
  }
}

// ── Chart helpers ─────────────────────────────────────────────────────────────

function buildChartData(
  period: PeriodKey,
  byMonth: Array<{ year: number; month: number; income: number; expense: number }>,
): Array<{ label: string; Income: number; Expense: number }> {
  if (period === 'yearly') {
    return byMonth.map((item) => ({
      label: MONTH_NAMES[item.month - 1],
      Income: item.income,
      Expense: item.expense,
    }))
  }

  if (period === 'monthly') {
    const now = new Date()
    const y = now.getFullYear()
    const mo = now.getMonth()
    const daysInMonth = new Date(y, mo + 1, 0).getDate()
    const weeks: Array<{ label: string; Income: number; Expense: number }> = []
    for (let week = 1; week <= Math.ceil(daysInMonth / 7); week++) {
      weeks.push({ label: `Week ${week}`, Income: 0, Expense: 0 })
    }
    if (byMonth.length === 1) {
      weeks[0].Income = byMonth[0].income
      weeks[0].Expense = byMonth[0].expense
    }
    return weeks
  }

  if (period === 'weekly') {
    return DAY_NAMES.slice(1).concat(DAY_NAMES[0]).map((day) => ({
      label: day,
      Income: 0,
      Expense: 0,
    }))
  }

  if (byMonth.length > 0) {
    return [{ label: 'Today', Income: byMonth[0].income, Expense: byMonth[0].expense }]
  }
  return [{ label: 'Today', Income: 0, Expense: 0 }]
}

// ── ReportsPage ───────────────────────────────────────────────────────────────

function ReportsPage() {
  const { t } = useTranslation()
  const [period, setPeriod] = useState<PeriodKey>('monthly')
  const { data: preferences } = usePreferences()
  const preferredCurrency = preferences?.defaultCurrency ?? 'USD'

  const PERIOD_LABELS: Record<PeriodKey, string> = {
    daily: t('reports.daily'),
    weekly: t('reports.weekly'),
    monthly: t('reports.monthly'),
    yearly: t('reports.yearly'),
  }

  const PERIOD_COMPARE_LABELS: Record<PeriodKey, string> = {
    daily: t('reports.vsYesterday'),
    weekly: t('reports.vsLastWeek'),
    monthly: t('reports.vsLastMonth'),
    yearly: t('reports.vsLastYear'),
  }

  const { from, to } = useMemo(() => getPeriodRange(period), [period])
  const prevRange = useMemo(() => getPrevPeriodRange(period), [period])
  const compareLabel = PERIOD_COMPARE_LABELS[period]

  const { data, isLoading } = useReport({
    from: new Date(from).toISOString(),
    to: new Date(to).toISOString(),
  })

  const { data: prevData } = useReport({
    from: new Date(prevRange.from).toISOString(),
    to: new Date(prevRange.to).toISOString(),
  })

  const { data: txData, isLoading: txLoading } = useTransactions({
    startDate: from,
    endDate: to,
    pageSize: 20,
    page: 1,
  })

  const chartData = useMemo(
    () => buildChartData(period, data?.byMonth ?? []),
    [period, data],
  )

  const incomeDiff = (data?.totalIncome ?? 0) - (prevData?.totalIncome ?? 0)
  const expenseDiff = (data?.totalExpense ?? 0) - (prevData?.totalExpense ?? 0)
  const netDiff = (data?.netBalance ?? 0) - (prevData?.netBalance ?? 0)

  return (
    <main className={styles.page}>

      {/* ── Header ── */}
      <Flex justify="space-between" align="center">
        <Title level={3} style={{ margin: 0 }}>{t('reports.title')}</Title>
        <Button icon={<ExportOutlined />}>{t('reports.export')}</Button>
      </Flex>

      {/* ── Period selector ── */}
      <div className={styles.periodSelector}>
        {(Object.keys(PERIOD_LABELS) as PeriodKey[]).map((key) => (
          <button
            key={key}
            type="button"
            className={styles.periodBtn}
            style={{
              background: period === key ? '#2563eb' : 'transparent',
              color: period === key ? '#fff' : '#595959',
              fontWeight: period === key ? 600 : 400,
            }}
            onClick={() => setPeriod(key)}
          >
            {PERIOD_LABELS[key]}
          </button>
        ))}
      </div>

      {/* ── Stat cards ── */}
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 2 }} />
      ) : (
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <StatCard
              label={t('reports.totalIncome')}
              amount={data?.totalIncome ?? 0}
              diff={incomeDiff}
              compareLabel={compareLabel}
              iconBg="#dcfce7"
              iconColor="#16a34a"
              icon={<ArrowUpOutlined />}
              currency={preferredCurrency}
            />
          </Col>
          <Col xs={24} sm={8}>
            <StatCard
              label={t('reports.totalExpenses')}
              amount={data?.totalExpense ?? 0}
              diff={expenseDiff}
              compareLabel={compareLabel}
              iconBg="#fee2e2"
              iconColor="#dc2626"
              icon={<ArrowDownOutlined />}
              invertDiff
              currency={preferredCurrency}
            />
          </Col>
          <Col xs={24} sm={8}>
            <StatCard
              label={t('reports.netBalance')}
              amount={data?.netBalance ?? 0}
              diff={netDiff}
              compareLabel={compareLabel}
              iconBg="#dbeafe"
              iconColor="#2563eb"
              icon={<SwapOutlined />}
              currency={preferredCurrency}
            />
          </Col>
        </Row>
      )}

      {/* ── Income vs Expenses chart ── */}
      <Card title={t('reports.incomeVsExpenses')}>
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : chartData.every((d) => d.Income === 0 && d.Expense === 0) ? (
          <Empty description={t('reports.noData')} />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `$${(v as number / 1000).toFixed(0)}k`}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value, name) => [formatTotalBalance(value as number, preferredCurrency), name]}
                contentStyle={{ borderRadius: 8, fontSize: 13 }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 13 }}
              />
              <Bar dataKey="Income" fill="#16a34a" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey="Expense" fill="#dc2626" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* ── All Transactions ── */}
      <Card
        title={t('reports.allTransactions')}
        extra={
          txData && (
            <Text type="secondary" style={{ fontSize: 13 }}>
              {txData.totalCount} total
            </Text>
          )
        }
        styles={{ body: { padding: 0 } }}
      >
        {txLoading ? (
          <div style={{ padding: '16px 24px' }}>
            <Skeleton active paragraph={{ rows: 4 }} />
          </div>
        ) : !txData || txData.items.length === 0 ? (
          <div style={{ padding: '32px 24px' }}>
            <Empty description={t('reports.noTransactions')} />
          </div>
        ) : (
          <div>
            {txData.items.map((tx, idx) => {
              const emoji = CATEGORY_EMOJIS[tx.category] ?? '💳'
              const isIncome = tx.type === 'Income'
              const amountStr = `${isIncome ? '+' : '-'}${formatTotalBalance(tx.amount, preferredCurrency)}`
              const dateStr = new Date(tx.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })
              return (
                <div key={tx.id}>
                  <Flex
                    justify="space-between"
                    align="center"
                    className={styles.txRow}
                  >
                    <Flex align="center" gap={12}>
                      <Avatar
                        size={40}
                        className={styles.txAvatar}
                        style={{ background: isIncome ? '#dcfce7' : '#fef2f2' }}
                      >
                        <span style={{ fontSize: 18 }}>{emoji}</span>
                      </Avatar>
                      <div>
                        <Text strong className={styles.txCategory}>{tx.category}</Text>
                        <br />
                        <Text type="secondary" className={styles.txDate}>{dateStr}</Text>
                      </div>
                    </Flex>
                    <Flex align="center" gap={10}>
                      <Tag
                        color={isIncome ? 'green' : 'red'}
                        style={{ margin: 0, fontSize: 11 }}
                      >
                        {tx.type}
                      </Tag>
                      <Text
                        strong
                        className={styles.txAmount}
                        style={{ color: isIncome ? '#16a34a' : '#dc2626' }}
                      >
                        {amountStr}
                      </Text>
                    </Flex>
                  </Flex>
                  {idx < txData.items.length - 1 && (
                    <Divider style={{ margin: 0 }} />
                  )}
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </main>
  )
}

// ── StatCard ──────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string
  amount: number
  diff: number
  compareLabel: string
  iconBg: string
  iconColor: string
  icon: ReactNode
  invertDiff?: boolean
  currency: string
}

function StatCard({ label, amount, diff, compareLabel, iconBg, iconColor, icon, invertDiff = false, currency }: StatCardProps) {
  const isPositive = invertDiff ? diff <= 0 : diff >= 0
  const diffColor = diff === 0 ? '#8c8c8c' : isPositive ? '#16a34a' : '#dc2626'
  const diffPrefix = diff > 0 ? '+' : ''

  return (
    <Card size="small" className={styles.statCard}>
      <Flex justify="space-between" align="flex-start">
        <div>
          <Text type="secondary" className={styles.statLabel}>{label}</Text>
          <div className={styles.statAmount}>{formatTotalBalance(amount, currency)}</div>
          <Text style={{ fontSize: 12, color: diffColor }}>
            {diffPrefix}{formatTotalBalance(Math.abs(diff), currency)} {compareLabel}
          </Text>
        </div>
        <Avatar
          size={44}
          icon={icon}
          style={{ background: iconBg, color: iconColor, flexShrink: 0 }}
        />
      </Flex>
    </Card>
  )
}

export default ReportsPage
