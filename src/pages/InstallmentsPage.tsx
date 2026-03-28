import { Button, Col, Row, Typography } from 'antd'
import { useState } from 'react'
import AddInstallmentPlanModal from '../features/installments/components/AddInstallmentPlanModal'
import InstallmentPlanList from '../features/installments/components/InstallmentPlanList'
import styles from './InstallmentsPage.module.css'

const { Title, Text } = Typography

function InstallmentsPage() {
  const [isAddOpen, setIsAddOpen] = useState(false)

  return (
    <main className={styles.page}>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={3} style={{ margin: 0 }}>Installments</Title>
          <Text type="secondary">Track installment plans and monthly payment schedules.</Text>
        </Col>
        <Col>
          <Button type="primary" size="large" onClick={() => setIsAddOpen(true)}>
            Create plan
          </Button>
        </Col>
      </Row>

      <InstallmentPlanList />

      <AddInstallmentPlanModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </main>
  )
}

export default InstallmentsPage
