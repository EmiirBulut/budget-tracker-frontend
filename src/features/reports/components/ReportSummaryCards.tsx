import { Card, Col, Row, Statistic } from 'antd'
import { formatTotalBalance } from '../../../lib/formatCurrency'
import type { ReportSummary } from '../types/ReportTypes'
import styles from './ReportSummaryCards.module.css'

interface ReportSummaryCardsProps {
  summary: ReportSummary
}

function ReportSummaryCards({ summary }: ReportSummaryCardsProps) {
  const netClass = summary.netBalance >= 0 ? styles.netPositive : styles.netNegative

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={8}>
        <Card size="small" className={styles.incomeCard}>
          <Statistic title="Total Income" value={formatTotalBalance(summary.totalIncome)} />
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card size="small" className={styles.expenseCard}>
          <Statistic title="Total Expense" value={formatTotalBalance(summary.totalExpense)} />
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card size="small" className={netClass}>
          <Statistic title="Net Balance" value={formatTotalBalance(summary.netBalance)} />
        </Card>
      </Col>
    </Row>
  )
}

export default ReportSummaryCards
