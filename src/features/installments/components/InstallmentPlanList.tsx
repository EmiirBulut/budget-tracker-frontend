import { Alert, Divider, Empty, Flex, Skeleton, Typography } from 'antd'
import { useCards } from '../../cards/hooks/useCards'
import type { Card } from '../../cards/types/CardTypes'
import { useInstallmentPlans } from '../hooks/useInstallmentPlans'
import type { InstallmentPlan } from '../types/InstallmentTypes'
import InstallmentPlanCard from './InstallmentPlanCard'
import styles from './InstallmentPlanList.module.css'

const { Text } = Typography

interface InstallmentPlanListProps {
  groupBy: 'card' | 'month'
  cardTypeFilter: string
  cardIdFilter: string
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

function getNextPaymentMonthLabel(plan: InstallmentPlan): string {
  const paidCount = getPaidCount(plan)
  if (paidCount >= plan.numberOfMonths) return 'Completed'
  if (plan.payments && plan.payments.length > 0) {
    const next = plan.payments.find((p) => !p.isPaid)
    if (next) {
      return new Date(next.dueDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    }
  }
  const date = new Date(plan.startDate)
  date.setMonth(date.getMonth() + paidCount)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

function InstallmentPlanList({ groupBy, cardTypeFilter, cardIdFilter }: InstallmentPlanListProps) {
  const { data: plans, isLoading, isError, error } = useInstallmentPlans()
  const { data: cards } = useCards()

  if (isLoading) return <Skeleton active paragraph={{ rows: 8 }} />

  if (isError) {
    const message = error.response?.data?.error ?? 'Failed to load installment plans.'
    return <Alert type="error" message={message} showIcon />
  }

  if (!plans || plans.length === 0) {
    return <Empty description="No installment plans yet" />
  }

  const cardMap = new Map<string, Card>((cards ?? []).map((c) => [c.id, c]))

  // Apply filters
  const filtered = plans.filter((plan) => {
    const card = cardMap.get(plan.cardId)
    if (cardIdFilter && plan.cardId !== cardIdFilter) return false
    if (cardTypeFilter && card?.cardCategory !== cardTypeFilter) return false
    return true
  })

  if (filtered.length === 0) {
    return <Empty description="No plans match the current filters" />
  }

  // Group plans
  const groups = new Map<string, InstallmentPlan[]>()

  filtered.forEach((plan) => {
    const key =
      groupBy === 'card'
        ? (cardMap.get(plan.cardId)?.name ?? 'Unknown Card')
        : getNextPaymentMonthLabel(plan)

    const list = groups.get(key) ?? []
    list.push(plan)
    groups.set(key, list)
  })

  return (
    <Flex vertical gap={8}>
      {Array.from(groups.entries()).map(([groupLabel, groupPlans]) => (
        <div key={groupLabel}>
          <Divider className={styles.groupDivider}>
            <Text className={styles.groupLabel}>{groupLabel}</Text>
          </Divider>
          <Flex vertical gap={12}>
            {groupPlans.map((plan) => (
              <InstallmentPlanCard
                key={plan.id}
                plan={plan}
                currency={cardMap.get(plan.cardId)?.currency ?? 'USD'}
              />
            ))}
          </Flex>
        </div>
      ))}
    </Flex>
  )
}

export default InstallmentPlanList
