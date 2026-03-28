import { Alert, Empty, Skeleton } from 'antd'
import { useState } from 'react'
import CategoryPieChart from '../features/reports/components/CategoryPieChart'
import DateRangeSelector from '../features/reports/components/DateRangeSelector'
import MonthlyBarChart from '../features/reports/components/MonthlyBarChart'
import ReportSummaryCards from '../features/reports/components/ReportSummaryCards'
import { useReport } from '../features/reports/hooks/useReport'
import styles from './ReportsPage.module.css'

function toDateString(d: Date): string {
  return d.toISOString().split('T')[0]
}

function defaultRange(): { from: string; to: string } {
  const now = new Date()
  return {
    from: toDateString(new Date(now.getFullYear(), now.getMonth(), 1)),
    to: toDateString(new Date(now.getFullYear(), now.getMonth() + 1, 0)),
  }
}

function ReportsPage() {
  const initial = defaultRange()
  const [from, setFrom] = useState(initial.from)
  const [to, setTo] = useState(initial.to)

  const { data, isLoading, isError, error } = useReport({
    from: new Date(from).toISOString(),
    to: new Date(to).toISOString(),
  })

  const handleRangeChange = (nextFrom: string, nextTo: string): void => {
    setFrom(nextFrom)
    setTo(nextTo)
  }

  return (
    <main className={styles.page}>
      <div>
        <h1 className={styles.title}>Reports</h1>
        <p className={styles.description}>Analyse income and expenses across any time period.</p>
      </div>

      <DateRangeSelector from={from} to={to} onChange={handleRangeChange} />

      {isLoading && <Skeleton active paragraph={{ rows: 6 }} />}

      {isError && (
        <Alert
          type="error"
          showIcon
          message={error.response?.data?.error ?? 'Failed to load report.'}
        />
      )}

      {data && (
        <>
          <ReportSummaryCards summary={data} />

          <div className={styles.charts}>
            <section className={styles.chartPanel}>
              <h2 className={styles.chartTitle}>Spending by Category</h2>
              {data.byCategory.length === 0 ? (
                <Empty description="No category data" />
              ) : (
                <CategoryPieChart data={data.byCategory} />
              )}
            </section>

            <section className={styles.chartPanel}>
              <h2 className={styles.chartTitle}>Monthly Breakdown</h2>
              {data.byMonth.length === 0 ? (
                <Empty description="No monthly data" />
              ) : (
                <MonthlyBarChart data={data.byMonth} />
              )}
            </section>
          </div>
        </>
      )}
    </main>
  )
}

export default ReportsPage
