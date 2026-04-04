import { CalendarOutlined, DollarOutlined, FilterOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Card, Col, Flex, Row, Select, Typography } from 'antd'
import { useState } from 'react'
import AddInstallmentPlanModal from '../features/installments/components/AddInstallmentPlanModal'
import InstallmentPlanList from '../features/installments/components/InstallmentPlanList'
import { useInstallmentPlans } from '../features/installments/hooks/useInstallmentPlans'
import type { InstallmentPlan } from '../features/installments/types/InstallmentTypes'
import { useCards } from '../features/cards/hooks/useCards'
import { CardCategory } from '../features/cards/types/CardTypes'
import { formatBalance } from '../lib/formatCurrency'
import { ROUTES } from '../router/routes'
import { Link } from 'react-router-dom'
import styles from './InstallmentsPage.module.css'

const { Title, Text } = Typography

type GroupBy = 'card' | 'month'

function getPaidCount(plan: InstallmentPlan): number {
  if (plan.payments && plan.payments.length > 0) {
    return plan.payments.filter((p) => p.isPaid).length
  }
  const start = new Date(plan.startDate)
  const now = new Date()
  const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
  return Math.max(0, Math.min(months, plan.numberOfMonths))
}

function InstallmentsPage() {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [groupBy, setGroupBy] = useState<GroupBy>('card')
  const [cardTypeFilter, setCardTypeFilter] = useState<string>('')
  const [cardIdFilter, setCardIdFilter] = useState<string>('')

  const { data: plans } = useInstallmentPlans()
  const { data: cards } = useCards()

  const activePlans = (plans ?? []).filter((p) => getPaidCount(p) < p.numberOfMonths)
  const currentMonthTotal = activePlans.reduce((sum, p) => sum + p.monthlyPayment, 0)
  const totalRemaining = (plans ?? []).reduce((sum, p) => {
    const paid = getPaidCount(p) * p.monthlyPayment
    return sum + Math.max(p.totalAmount - paid, 0)
  }, 0)

  const cardOptions = [
    { label: 'All Cards', value: '' },
    ...(cards ?? []).map((c) => ({ label: `${c.name} (···· ${c.last4Digits})`, value: c.id })),
  ]

  const cardTypeOptions = [
    { label: 'All Types', value: '' },
    { label: 'Credit', value: CardCategory.Credit },
    { label: 'Debit', value: CardCategory.Debit },
  ]

  return (
    <main className={styles.page}>

      {/* ── Header ── */}
      <Flex justify="space-between" align="center">
        <Flex vertical gap={2}>
          <Title level={3} className={styles.pageTitle}>Installment Planner</Title>
          <Text type="secondary">
            Manage your payment plans across{' '}
            <Link to={ROUTES.CARDS} className={styles.allCardsLink}>all cards</Link>
          </Text>
        </Flex>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddOpen(true)}>
          Create Plan
        </Button>
      </Flex>

      {/* ── Summary stats ── */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={14}>
          <Card className={styles.currentMonthCard} variant="borderless">
            <Flex justify="space-between" align="flex-start">
              <Text className={styles.currentMonthLabel}>Current Month Total</Text>
              <CalendarOutlined className={styles.currentMonthIcon} />
            </Flex>
            <Title level={2} className={styles.currentMonthAmount}>
              {formatBalance(currentMonthTotal, 'USD')}
            </Title>
            <Text className={styles.currentMonthSub}>
              {activePlans.length} active installment{activePlans.length !== 1 ? 's' : ''}
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={10}>
          <Card className={styles.remainingCard}>
            <Flex justify="space-between" align="flex-start">
              <Text type="secondary" className={styles.remainingLabel}>Total Remaining Balance</Text>
              <DollarOutlined className={styles.remainingIcon} />
            </Flex>
            <Title level={3} className={styles.remainingAmount}>
              {formatBalance(totalRemaining, 'USD')}
            </Title>
            <Text type="secondary" className={styles.remainingSub}>Across all plans</Text>
          </Card>
        </Col>
      </Row>

      {/* ── Filters & Grouping ── */}
      <Card>
        <Flex align="center" gap={8} className={styles.filterTitle}>
          <FilterOutlined className={styles.filterIcon} />
          <Text strong>Filters &amp; Grouping</Text>
        </Flex>
        <Row gutter={[16, 12]} align="bottom" className={styles.filterRow}>
          <Col xs={24} sm={8} md={6}>
            <Flex vertical gap={6}>
              <Text className={styles.filterLabel}>Group By</Text>
              <div className={styles.groupByToggle}>
                <button
                  type="button"
                  className={`${styles.toggleBtn} ${groupBy === 'card' ? styles.toggleBtnActive : ''}`}
                  onClick={() => setGroupBy('card')}
                >
                  Card
                </button>
                <button
                  type="button"
                  className={`${styles.toggleBtn} ${groupBy === 'month' ? styles.toggleBtnActive : ''}`}
                  onClick={() => setGroupBy('month')}
                >
                  Month
                </button>
              </div>
            </Flex>
          </Col>
          <Col xs={24} sm={8} md={9}>
            <Flex vertical gap={6}>
              <Text className={styles.filterLabel}>Card Type</Text>
              <Select
                style={{ width: '100%' }}
                options={cardTypeOptions}
                value={cardTypeFilter}
                onChange={setCardTypeFilter}
              />
            </Flex>
          </Col>
          <Col xs={24} sm={8} md={9}>
            <Flex vertical gap={6}>
              <Text className={styles.filterLabel}>Card</Text>
              <Select
                style={{ width: '100%' }}
                options={cardOptions}
                value={cardIdFilter}
                onChange={setCardIdFilter}
              />
            </Flex>
          </Col>
        </Row>
      </Card>

      {/* ── Plan list ── */}
      <InstallmentPlanList
        groupBy={groupBy}
        cardTypeFilter={cardTypeFilter}
        cardIdFilter={cardIdFilter}
      />

      <AddInstallmentPlanModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </main>
  )
}

export default InstallmentsPage
