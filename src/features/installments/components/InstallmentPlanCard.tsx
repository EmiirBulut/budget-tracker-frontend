import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import { Avatar, Card, Col, Flex, Progress, Row, Typography } from 'antd'
import { formatBalance } from '../../../lib/formatCurrency'
import type { InstallmentPlan, InstallmentPayment } from '../types/InstallmentTypes'
import styles from './InstallmentPlanCard.module.css'

const { Text } = Typography

const CATEGORY_EMOJIS: Record<string, string> = {
  food: '🍔', groceries: '🛒', transport: '🚗', shopping: '🛍️',
  entertainment: '🎬', bills: '💡', healthcare: '💊', health: '💊',
  travel: '✈️', electronics: '💻', tech: '💻', clothing: '👗',
  sports: '⚽', gym: '🏋️', restaurant: '🍽️', utilities: '⚡',
}

function getCategoryEmoji(category: string): string {
  return CATEGORY_EMOJIS[category.toLowerCase()] ?? '🛍️'
}

function getPaidCount(plan: InstallmentPlan): number {
  if (plan.payments && plan.payments.length > 0) {
    return plan.payments.filter((p) => p.isPaid).length
  }
  const start = new Date(plan.startDate)
  const now = new Date()
  const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
  return Math.max(0, Math.min(months, plan.numberOfMonths))
}

function getMonthState(
  monthNumber: number,
  payments: InstallmentPayment[],
  paidCount: number,
): 'paid' | 'current' | 'future' {
  if (payments.length > 0) {
    const payment = payments.find((p) => p.monthNumber === monthNumber)
    if (payment?.isPaid) return 'paid'
    const firstUnpaid = payments.find((p) => !p.isPaid)
    if (firstUnpaid?.monthNumber === monthNumber) return 'current'
    return 'future'
  }
  if (monthNumber <= paidCount) return 'paid'
  if (monthNumber === paidCount + 1) return 'current'
  return 'future'
}

interface InstallmentPlanCardProps {
  plan: InstallmentPlan
  currency?: string
}

function InstallmentPlanCard({ plan, currency = 'USD' }: InstallmentPlanCardProps) {
  const payments = plan.payments ?? []
  const paidCount = getPaidCount(plan)
  const progressPct = plan.numberOfMonths > 0
    ? Math.round((paidCount / plan.numberOfMonths) * 100)
    : 0
  const paidAmount = paidCount * plan.monthlyPayment
  const remainingAmount = Math.max(plan.totalAmount - paidAmount, 0)
  const monthsLeft = plan.numberOfMonths - paidCount

  return (
    <Card className={styles.card}>
      {/* ── Plan header ── */}
      <Flex justify="space-between" align="flex-start">
        <Flex align="center" gap={12}>
          <Avatar className={styles.planAvatar} size={44}>
            {getCategoryEmoji(plan.category)}
          </Avatar>
          <Flex vertical gap={2}>
            <Text strong className={styles.planName}>{plan.name}</Text>
            <Text type="secondary" className={styles.planCategory}>{plan.category}</Text>
          </Flex>
        </Flex>
        <Flex vertical align="flex-end" gap={2}>
          <Text className={styles.monthlyAmount}>
            {formatBalance(plan.monthlyPayment, currency)}/mo
          </Text>
          <Text type="secondary" className={styles.monthlyLabel}>Monthly payment</Text>
        </Flex>
      </Flex>

      {/* ── Progress ── */}
      <div className={styles.progressSection}>
        <Flex justify="space-between" align="center">
          <Text type="secondary" className={styles.smallLabel}>Progress</Text>
          <Text type="secondary" className={styles.smallLabel}>
            {paidCount} of {plan.numberOfMonths} months
          </Text>
        </Flex>
        <Progress
          percent={progressPct}
          showInfo={false}
          strokeColor="#f59e0b"
          trailColor="#e5e7eb"
          size="small"
        />
      </div>

      {/* ── Stats ── */}
      <Row gutter={[8, 8]} className={styles.statsRow}>
        <Col span={8}>
          <Flex align="center" gap={4}>
            <CheckCircleOutlined className={styles.paidIcon} />
            <Text type="secondary" className={styles.smallLabel}>Paid</Text>
          </Flex>
          <Text strong className={styles.statValue}>
            {formatBalance(paidAmount, currency)}
          </Text>
        </Col>
        <Col span={8}>
          <Flex align="center" gap={4}>
            <ClockCircleOutlined className={styles.remainingIcon} />
            <Text type="secondary" className={styles.smallLabel}>Remaining</Text>
          </Flex>
          <Text strong className={styles.statValue}>
            {formatBalance(remainingAmount, currency)}
          </Text>
        </Col>
        <Col span={8}>
          <Flex align="center" gap={4}>
            <CalendarOutlined className={styles.monthsIcon} />
            <Text type="secondary" className={styles.smallLabel}>Months Left</Text>
          </Flex>
          <Text strong className={styles.statValue}>{monthsLeft}</Text>
        </Col>
      </Row>

      {/* ── Month bubbles ── */}
      <Flex gap={6} wrap className={styles.bubbles}>
        {Array.from({ length: plan.numberOfMonths }, (_, i) => i + 1).map((month) => {
          const state = getMonthState(month, payments, paidCount)
          return (
            <div
              key={month}
              className={`${styles.bubble} ${
                state === 'paid'
                  ? styles.bubblePaid
                  : state === 'current'
                  ? styles.bubbleCurrent
                  : styles.bubbleFuture
              }`}
            >
              {month}
            </div>
          )
        })}
      </Flex>
    </Card>
  )
}

export default InstallmentPlanCard
