import { Alert, Card, Col, Empty, Row, Skeleton, Typography } from 'antd'
import { useState } from 'react'
import CategoryPieChart from '../features/reports/components/CategoryPieChart'
import DateRangeSelector from '../features/reports/components/DateRangeSelector'
import MonthlyBarChart from '../features/reports/components/MonthlyBarChart'
import ReportSummaryCards from '../features/reports/components/ReportSummaryCards'
import { useReport } from '../features/reports/hooks/useReport'
import styles from './ReportsPage.module.css'

const { Title, Text } = Typography

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
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={3} style={{ margin: 0 }}>Reports</Title>
          <Text type="secondary">Analyse income and expenses across any time period.</Text>
        </Col>
      </Row>

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

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card title="Spending by Category">
                {data.byCategory.length === 0 ? (
                  <Empty description="No category data" />
                ) : (
                  <CategoryPieChart data={data.byCategory} />
                )}
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Monthly Breakdown">
                {data.byMonth.length === 0 ? (
                  <Empty description="No monthly data" />
                ) : (
                  <MonthlyBarChart data={data.byMonth} />
                )}
              </Card>
            </Col>
          </Row>
        </>
      )}
    </main>
  )
}

export default ReportsPage
