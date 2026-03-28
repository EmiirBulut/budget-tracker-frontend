import { Alert, Col, Empty, Row, Skeleton } from 'antd'
import { useInstallmentPlans } from '../hooks/useInstallmentPlans'
import InstallmentPlanCard from './InstallmentPlanCard'

function InstallmentPlanList() {
  const { data, isLoading, isError, error } = useInstallmentPlans()

  if (isLoading) {
    return (
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}><Skeleton active paragraph={{ rows: 5 }} /></Col>
        <Col xs={24} md={12}><Skeleton active paragraph={{ rows: 5 }} /></Col>
      </Row>
    )
  }

  if (isError) {
    const message = error.response?.data?.error ?? 'Failed to load installment plans.'
    return <Alert type="error" message={message} showIcon />
  }

  if (!data || data.length === 0) {
    return <Empty description="No installment plans yet" />
  }

  return (
    <Row gutter={[16, 16]}>
      {data.map((plan) => (
        <Col xs={24} md={12} key={plan.id}>
          <InstallmentPlanCard plan={plan} />
        </Col>
      ))}
    </Row>
  )
}

export default InstallmentPlanList
