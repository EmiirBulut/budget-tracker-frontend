import { Alert, Skeleton, Tag } from 'antd'
import { useParams } from 'react-router-dom'
import PaymentTimeline from '../features/installments/components/PaymentTimeline'
import { useInstallmentPlanDetail } from '../features/installments/hooks/useInstallmentPlanDetail'
import { formatTotalBalance } from '../lib/formatCurrency'
import styles from './InstallmentPlanDetailPage.module.css'

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

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.name}>{plan.name}</h1>
          <p className={styles.sub}>Started {new Date(plan.startDate).toLocaleDateString()}</p>
        </div>
        <Tag color="blue">{plan.numberOfMonths} months</Tag>
      </header>

      <div className={styles.summaryGrid}>
        <article className={styles.summaryCard}>
          <p className={styles.summaryLabel}>Total Amount</p>
          <p className={styles.summaryValue}>{formatTotalBalance(plan.totalAmount)}</p>
        </article>
        <article className={styles.summaryCard}>
          <p className={styles.summaryLabel}>Monthly Payment</p>
          <p className={styles.summaryValue}>{formatTotalBalance(plan.monthlyPayment)}</p>
        </article>
        <article className={styles.summaryCard}>
          <p className={styles.summaryLabel}>Category</p>
          <p className={styles.summaryValue}>{plan.category}</p>
        </article>
        <article className={styles.summaryCard}>
          <p className={styles.summaryLabel}>Progress</p>
          <p className={styles.summaryValue}>{progressPercent}%</p>
        </article>
      </div>

      <section className={styles.timelineSection}>
        <h2 className={styles.timelineTitle}>Payment Schedule</h2>
        {plan.payments && plan.payments.length > 0 ? (
          <div className={styles.timelineWrap}>
            <PaymentTimeline planId={plan.id} payments={plan.payments} />
          </div>
        ) : (
          <p className={styles.emptyText}>No payment records found.</p>
        )}
      </section>
    </main>
  )
}

export default InstallmentPlanDetailPage
