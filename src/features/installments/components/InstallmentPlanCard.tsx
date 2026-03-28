import { Button, Card, Progress, Row, Col, Tag, Typography } from 'antd'
import { Link } from 'react-router-dom'
import { formatTotalBalance } from '../../../lib/formatCurrency'
import { ROUTES } from '../../../router/routes'
import type { InstallmentPlan } from '../types/InstallmentTypes'

const { Text, Title } = Typography

interface InstallmentPlanCardProps {
  plan: InstallmentPlan
}

function InstallmentPlanCard({ plan }: InstallmentPlanCardProps) {
  const paidCount = (plan.payments ?? []).filter((p) => p.isPaid).length
  const totalCount = plan.numberOfMonths
  const progressPercent = totalCount > 0 ? Math.round((paidCount / totalCount) * 100) : 0

  return (
    <Card size="small">
      <Row justify="space-between" align="top" gutter={8}>
        <Col flex="1">
          <Title level={5} style={{ margin: 0 }}>{plan.name}</Title>
          <Text type="secondary">{plan.category}</Text>
        </Col>
        <Col>
          <Tag color="orange">{plan.numberOfMonths} months</Tag>
        </Col>
      </Row>

      <Row gutter={24} style={{ marginTop: 12 }}>
        <Col>
          <Text type="secondary" style={{ fontSize: 12 }}>Total</Text>
          <br />
          <Text strong>{formatTotalBalance(plan.totalAmount)}</Text>
        </Col>
        <Col>
          <Text type="secondary" style={{ fontSize: 12 }}>Monthly</Text>
          <br />
          <Text strong>{formatTotalBalance(plan.monthlyPayment)}</Text>
        </Col>
      </Row>

      <Progress
        percent={progressPercent}
        strokeColor="#f97316"
        style={{ marginTop: 12 }}
        format={() => `${paidCount}/${totalCount}`}
      />

      <Row justify="end" style={{ marginTop: 8 }}>
        <Link to={ROUTES.INSTALLMENT_DETAIL(plan.id)}>
          <Button type="link" size="small">View schedule →</Button>
        </Link>
      </Row>
    </Card>
  )
}

export default InstallmentPlanCard
