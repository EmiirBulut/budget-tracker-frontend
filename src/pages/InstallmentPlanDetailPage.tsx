import { Alert, Card, Col, Empty, Progress, Row, Skeleton, Statistic, Tag, Typography } from 'antd'
import { useParams } from 'react-router-dom'
import PaymentTimeline from '../features/installments/components/PaymentTimeline'
import { useInstallmentPlanDetail } from '../features/installments/hooks/useInstallmentPlanDetail'
import { formatTotalBalance } from '../lib/formatCurrency'
import styles from './InstallmentPlanDetailPage.module.css'

const { Title, Text } = Typography

function InstallmentPlanDetailPage() {
  const { id = '' } = useParams<{ id: string }>()
  const { data: plan, isLoading, isError, error } = useInstallmentPlanDetail(id)

  if (isLoading) {
    return <Skeleton active paragraph={{ rows: 8 }} />
  }

  if (isError) {
    const message = error.response?.data?.error ?? 'Failed to load installment plan.'
    return <Alert type="error" message={message} showIcon />
  }

  if (!plan) {
    return null
  }

  const paidCount = (plan.payments ?? []).filter((p) => p.isPaid).length
  const progressPercent = plan.numberOfMonths > 0 ? Math.round((paidCount / plan.numberOfMonths) * 100) : 0
  const remainingAmount = plan.totalAmount - plan.monthlyPayment * paidCount

  return (
    <div className={styles.page}>
      <Card className={styles.headerCard}>
        <div className={styles.cardHeader}>
          <div>
            <Title level={3} className={styles.headerName}>{plan.name}</Title>
            <Text className={styles.headerSub}>
              {plan.category} · Started {new Date(plan.startDate).toLocaleDateString()}
            </Text>
          </div>
          <Tag color="orange">{plan.numberOfMonths} months</Tag>
        </div>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card size="small">
            <Statistic title="Total Amount" value={formatTotalBalance(plan.totalAmount)} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small">
            <Statistic title="Monthly Payment" value={formatTotalBalance(plan.monthlyPayment)} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small">
            <Statistic title="Paid" value={`${paidCount} / ${plan.numberOfMonths}`} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small">
            <Statistic title="Remaining" value={formatTotalBalance(Math.max(remainingAmount, 0))} />
          </Card>
        </Col>
      </Row>

      <Card size="small">
        <Text type="secondary">Progress</Text>
        <Progress
          percent={progressPercent}
          strokeColor="#f97316"
          style={{ marginTop: 8 }}
        />
      </Card>

      <Card title="Payment Schedule">
        {plan.payments && plan.payments.length > 0 ? (
          <PaymentTimeline planId={plan.id} payments={plan.payments} />
        ) : (
          <Empty description="No payment records found." />
        )}
      </Card>
    </div>
  )
}

export default InstallmentPlanDetailPage
