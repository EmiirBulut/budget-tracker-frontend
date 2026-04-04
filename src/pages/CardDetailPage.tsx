import {
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ArrowUpOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CreditCardOutlined,
  EditOutlined,
  InboxOutlined,
  LinkOutlined,
  RiseOutlined,
} from '@ant-design/icons'
import { Alert, Avatar, Button, Card, Col, Flex, Progress, Row, Skeleton, Tag, Typography } from 'antd'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import EditCardModal from '../features/cards/components/EditCardModal'
import { useArchiveCard } from '../features/cards/hooks/useArchiveCard'
import { useCardDetail } from '../features/cards/hooks/useCardDetail'
import { CardCategory, CARD_CATEGORY_LABELS, CARD_TYPE_LABELS } from '../features/cards/types/CardTypes'
import { useAccounts } from '../features/accounts/hooks/useAccounts'
import { useInstallmentPlans } from '../features/installments/hooks/useInstallmentPlans'
import type { InstallmentPlan, InstallmentPayment } from '../features/installments/types/InstallmentTypes'
import { useTransactions } from '../features/transactions/hooks/useTransactions'
import { formatBalance } from '../lib/formatCurrency'
import { ROUTES } from '../router/routes'
import styles from './CardDetailPage.module.css'

const { Title, Text } = Typography

// ── Helpers ───────────────────────────────────────────────────────────────────

const CATEGORY_EMOJIS: Record<string, string> = {
  food: '🍔', groceries: '🛒', transport: '🚗', gas: '🚗',
  salary: '💼', wages: '💼', shopping: '🛍️', clothing: '👗',
  entertainment: '🎬', movies: '🎬', bills: '💡', electricity: '💡',
  utilities: '⚡', freelance: '💻', website: '💻', tech: '💻',
  health: '🏥', doctor: '🏥', medical: '💊', travel: '✈️',
  restaurant: '🍽️', dining: '🍽️', gym: '🏋️', sports: '⚽',
}

function getCategoryEmoji(category: string): string {
  return CATEGORY_EMOJIS[category.toLowerCase()] ?? '💳'
}

function formatTxDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function getPaidCount(plan: InstallmentPlan): number {
  if (plan.payments && plan.payments.length > 0) {
    return plan.payments.filter((p) => p.isPaid).length
  }
  const start = new Date(plan.startDate)
  const now = new Date()
  const months =
    (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
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

// ── InstallmentPlanCard ───────────────────────────────────────────────────────

interface InstallmentPlanCardProps {
  plan: InstallmentPlan
  currency: string
}

function InstallmentPlanCard({ plan, currency }: InstallmentPlanCardProps) {
  const payments = plan.payments ?? []
  const paidCount = getPaidCount(plan)
  const progressPct =
    plan.numberOfMonths > 0 ? Math.round((paidCount / plan.numberOfMonths) * 100) : 0
  const paidAmount = paidCount * plan.monthlyPayment
  const remainingAmount = Math.max(plan.totalAmount - paidAmount, 0)
  const monthsLeft = plan.numberOfMonths - paidCount

  return (
    <div className={styles.planItem}>
      <Flex justify="space-between" align="flex-start">
        <Flex align="center" gap={12}>
          <Avatar className={styles.planAvatar} size={40}>
            {getCategoryEmoji(plan.category)}
          </Avatar>
          <Flex vertical gap={2}>
            <Text strong>{plan.name}</Text>
            <Text type="secondary" className={styles.planCategory}>{plan.category}</Text>
          </Flex>
        </Flex>
        <Flex vertical align="flex-end" gap={2}>
          <Text className={styles.planMonthlyAmount}>
            {formatBalance(plan.monthlyPayment, currency)}/mo
          </Text>
          <Text type="secondary" className={styles.planMonthlyLabel}>Monthly payment</Text>
        </Flex>
      </Flex>

      <div className={styles.planProgressSection}>
        <Flex justify="space-between" align="center">
          <Text type="secondary" className={styles.planSmallLabel}>Progress</Text>
          <Text className={styles.planSmallLabel}>
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

      <Row gutter={[8, 8]} className={styles.planStats}>
        <Col span={8}>
          <Flex align="center" gap={4}>
            <CheckCircleOutlined className={styles.paidIcon} />
            <Text type="secondary" className={styles.planSmallLabel}>Paid</Text>
          </Flex>
          <Text strong>{formatBalance(paidAmount, currency)}</Text>
        </Col>
        <Col span={8}>
          <Flex align="center" gap={4}>
            <ClockCircleOutlined className={styles.remainingIcon} />
            <Text type="secondary" className={styles.planSmallLabel}>Remaining</Text>
          </Flex>
          <Text strong>{formatBalance(remainingAmount, currency)}</Text>
        </Col>
        <Col span={8}>
          <Flex align="center" gap={4}>
            <CalendarOutlined className={styles.monthsIcon} />
            <Text type="secondary" className={styles.planSmallLabel}>Months Left</Text>
          </Flex>
          <Text strong>{monthsLeft}</Text>
        </Col>
      </Row>

      <Flex gap={6} wrap className={styles.monthBubbles}>
        {Array.from({ length: plan.numberOfMonths }, (_, i) => i + 1).map((month) => {
          const state = getMonthState(month, payments, paidCount)
          return (
            <div
              key={month}
              className={`${styles.monthBubble} ${
                state === 'paid'
                  ? styles.monthBubblePaid
                  : state === 'current'
                  ? styles.monthBubbleCurrent
                  : styles.monthBubbleFuture
              }`}
            >
              {month}
            </div>
          )
        })}
      </Flex>
    </div>
  )
}

// ── CardDetailPage ────────────────────────────────────────────────────────────

function CardDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [isEditOpen, setIsEditOpen] = useState(false)

  const { data: card, isLoading, isError, error } = useCardDetail(id)
  const { mutate: archive, isPending: isArchiving } = useArchiveCard()
  const { data: accounts } = useAccounts()
  const { data: allPlans } = useInstallmentPlans()
  const { data: recentTxData } = useTransactions({ cardId: id, pageSize: 10 })

  const cardPlans = (allPlans ?? []).filter((p) => p.cardId === id)
  const linkedAccount = accounts?.find((a) => a.id === card?.linkedAccountId)

  const handleArchive = (): void => {
    if (!card || card.isArchived) return
    archive(card.id, { onSuccess: () => navigate(ROUTES.CARDS) })
  }

  if (isLoading) return <Skeleton active paragraph={{ rows: 12 }} />

  if (isError) {
    const msg = error.response?.data?.error ?? 'Failed to load card.'
    return <Alert type="error" message={msg} showIcon />
  }

  if (!card) return <Alert type="warning" message="Card not found." showIcon />

  const balance = card.balance ?? 0
  const creditLimit = card.creditLimit ?? 0
  const availableCredit = Math.max(creditLimit - balance, 0)
  const creditUsedPct = creditLimit > 0 ? Math.min((balance / creditLimit) * 100, 100) : 0
  const isCredit = card.cardCategory === CardCategory.Credit

  return (
    <main className={styles.page}>

      {/* ── Page header ── */}
      <Flex justify="space-between" align="flex-start">
        <Flex align="center" gap={12}>
          <Button shape="circle" icon={<ArrowLeftOutlined />} onClick={() => navigate(ROUTES.CARDS)} />
          <Flex vertical gap={2}>
            <Flex align="center" gap={8}>
              <Title level={3} className={styles.pageTitle}>{card.name}</Title>
              <Tag>{CARD_CATEGORY_LABELS[card.cardCategory]}</Tag>
            </Flex>
            <Text type="secondary">{CARD_TYPE_LABELS[card.cardType]} •••• {card.last4Digits}</Text>
          </Flex>
        </Flex>
        <Flex gap={8}>
          <Button icon={<EditOutlined />} onClick={() => setIsEditOpen(true)} disabled={card.isArchived}>
            Edit
          </Button>
          <Button icon={<InboxOutlined />} loading={isArchiving} onClick={handleArchive} disabled={card.isArchived}>
            Archive
          </Button>
        </Flex>
      </Flex>

      {/* ── Card visual ── */}
      <div className={styles.cardVisual} style={{ backgroundColor: card.color }}>
        <Flex justify="space-between" align="center">
          <Flex align="center" gap={8}>
            <Text className={styles.visualCardType}>{CARD_TYPE_LABELS[card.cardType]}</Text>
            <Tag className={styles.visualTag}>{CARD_CATEGORY_LABELS[card.cardCategory]}</Tag>
          </Flex>
          <CreditCardOutlined className={styles.visualIcon} />
        </Flex>

        <Text className={styles.visualName}>{card.name}</Text>

        <Flex vertical gap={4} className={styles.visualNumberSection}>
          <Text className={styles.visualLabel}>Card Number</Text>
          <Text className={styles.visualNumber}>•••• •••• •••• {card.last4Digits}</Text>
        </Flex>

        <Flex justify="space-between" align="flex-end" className={styles.visualFooter}>
          <Flex vertical gap={2}>
            <Text className={styles.visualLabel}>Expires</Text>
            <Text className={styles.visualValue}>{card.expiryDate}</Text>
          </Flex>
          <Flex vertical gap={2} align="flex-end">
            <Text className={styles.visualLabel}>Currency</Text>
            <Text className={styles.visualValue}>{card.currency}</Text>
          </Flex>
        </Flex>
      </div>

      {/* ── Credit sections ── */}
      {isCredit ? (
        <>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Card className={styles.statCard}>
                <Flex align="center" gap={8} className={styles.statHeader}>
                  <Avatar className={styles.statAvatarBalance} icon={<RiseOutlined />} size={32} />
                  <Text type="secondary">Current Balance</Text>
                </Flex>
                <Title level={4} className={styles.statAmount}>
                  {formatBalance(balance, card.currency)}
                </Title>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className={styles.statCard}>
                <Flex align="center" gap={8} className={styles.statHeader}>
                  <Avatar className={styles.statAvatarLimit} icon={<CreditCardOutlined />} size={32} />
                  <Text type="secondary">Credit Limit</Text>
                </Flex>
                <Title level={4} className={styles.statAmount}>
                  {formatBalance(creditLimit, card.currency)}
                </Title>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className={styles.statCard}>
                <Flex align="center" gap={8} className={styles.statHeader}>
                  <Avatar className={styles.statAvatarAvailable} icon={<CalendarOutlined />} size={32} />
                  <Text type="secondary">Available Credit</Text>
                </Flex>
                <Title level={4} className={styles.statAmountGreen}>
                  {formatBalance(availableCredit, card.currency)}
                </Title>
              </Card>
            </Col>
          </Row>

          <Card>
            <Text strong className={styles.usageTitle}>Credit Usage</Text>
            <Flex justify="space-between" align="center" className={styles.usageRow}>
              <Text type="secondary">Credit Used</Text>
              <Text strong>{creditUsedPct.toFixed(1)}%</Text>
            </Flex>
            <Progress
              percent={creditUsedPct}
              showInfo={false}
              strokeColor="#22c55e"
              trailColor="#e5e7eb"
              size="small"
            />
            <Flex justify="space-between" align="center" className={styles.usageFooter}>
              <Text type="secondary" className={styles.usageFooterText}>
                {formatBalance(balance, card.currency)} used
              </Text>
              <Text type="secondary" className={styles.usageFooterText}>
                {formatBalance(availableCredit, card.currency)} available
              </Text>
            </Flex>
          </Card>
        </>
      ) : (
        <>
          {linkedAccount && (
            <Card className={styles.linkedCard} variant="borderless">
              <Flex align="center" gap={16}>
                <Avatar className={styles.linkedAvatar} icon={<LinkOutlined />} size={40} />
                <Flex vertical gap={2}>
                  <Text className={styles.linkedLabel}>Linked Account</Text>
                  <Text strong>{linkedAccount.name}</Text>
                  <Text type="secondary">
                    Balance: {formatBalance(linkedAccount.balance, linkedAccount.currency)}
                  </Text>
                </Flex>
              </Flex>
            </Card>
          )}

          <Card>
            <Flex align="center" gap={8} className={styles.statHeader}>
              <Avatar className={styles.statAvatarLimit} icon={<CreditCardOutlined />} size={32} />
              <Text type="secondary">Card Balance</Text>
            </Flex>
            <Title level={3} className={styles.balanceAmount}>
              {formatBalance(balance, card.currency)}
            </Title>
          </Card>
        </>
      )}

      {/* ── Active installments ── */}
      {cardPlans.length > 0 && (
        <Card>
          <Flex justify="space-between" align="center" className={styles.installmentHeader}>
            <Flex align="center" gap={8}>
              <ClockCircleOutlined className={styles.installmentIcon} />
              <Text strong className={styles.installmentTitle}>Active Installments</Text>
            </Flex>
            <Text className={styles.installmentCount}>
              {cardPlans.length} {cardPlans.length === 1 ? 'plan' : 'plans'}
            </Text>
          </Flex>
          {cardPlans.map((plan, idx) => (
            <div key={plan.id} className={idx < cardPlans.length - 1 ? styles.planItemBorder : ''}>
              <InstallmentPlanCard plan={plan} currency={card.currency} />
            </div>
          ))}
        </Card>
      )}

      {/* ── Recent transactions ── */}
      <Card
        title={<Text strong>Recent Transactions</Text>}
        extra={<Link to={ROUTES.TRANSACTIONS}><Text className={styles.viewAll}>View All</Text></Link>}
      >
        {!recentTxData || recentTxData.items.length === 0 ? (
          <Text type="secondary">No transactions for this card yet.</Text>
        ) : (
          <Flex vertical>
            {recentTxData.items.map((tx) => {
              const isIncome = tx.type === 'Income'
              const isInstallment = tx.type === 'Installment'
              const amountText = isIncome
                ? `+${formatBalance(tx.amount, card.currency)}`
                : `-${formatBalance(tx.amount, card.currency)}`

              return (
                <Flex key={tx.id} align="center" justify="space-between" className={styles.txRow}>
                  <Flex align="center" gap={12}>
                    <Avatar className={styles.txAvatar} size={40}>
                      {getCategoryEmoji(tx.category)}
                    </Avatar>
                    <Flex vertical gap={2}>
                      <Text className={styles.txName}>{tx.description}</Text>
                      <Text className={styles.txDate}>{formatTxDate(tx.date)}</Text>
                    </Flex>
                  </Flex>
                  <Flex align="center" gap={6}>
                    <Text className={isIncome ? styles.txAmountIncome : styles.txAmountExpense}>
                      {amountText}
                    </Text>
                    {isIncome && <ArrowDownOutlined className={styles.txIconIncome} />}
                    {!isIncome && !isInstallment && <ArrowUpOutlined className={styles.txIconExpense} />}
                    {isInstallment && <ClockCircleOutlined className={styles.txIconInstallment} />}
                  </Flex>
                </Flex>
              )
            })}
          </Flex>
        )}
      </Card>

      <EditCardModal isOpen={isEditOpen} card={card} onClose={() => setIsEditOpen(false)} />
    </main>
  )
}

export default CardDetailPage
