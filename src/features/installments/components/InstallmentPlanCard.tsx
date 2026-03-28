import { Tag } from 'antd'
import { Link } from 'react-router-dom'
import { formatTotalBalance } from '../../../lib/formatCurrency'
import { ROUTES } from '../../../router/routes'
import type { InstallmentPlan } from '../types/InstallmentTypes'
import styles from './InstallmentPlanCard.module.css'

interface InstallmentPlanCardProps {
  plan: InstallmentPlan
}

function InstallmentPlanCard({ plan }: InstallmentPlanCardProps) {
  const paidCount = (plan.payments ?? []).filter((p) => p.isPaid).length
  const totalCount = plan.numberOfMonths
  const progressPercent = totalCount > 0 ? Math.round((paidCount / totalCount) * 100) : 0

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.name}>{plan.name}</h3>
          <p className={styles.category}>{plan.category}</p>
        </div>
        <Tag color="blue">{plan.numberOfMonths} months</Tag>
      </div>

      <div className={styles.amounts}>
        <div className={styles.amountItem}>
          <span className={styles.amountLabel}>Total</span>
          <span className={styles.amountValue}>{formatTotalBalance(plan.totalAmount)}</span>
        </div>
        <div className={styles.amountItem}>
          <span className={styles.amountLabel}>Monthly</span>
          <span className={styles.amountValue}>{formatTotalBalance(plan.monthlyPayment)}</span>
        </div>
      </div>

      <div className={styles.progressWrap}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
        </div>
        <span className={styles.progressLabel}>
          {paidCount} of {totalCount} payments made ({progressPercent}%)
        </span>
      </div>

      <Link to={ROUTES.INSTALLMENT_DETAIL(plan.id)} className={styles.viewLink}>
        View payment schedule →
      </Link>
    </article>
  )
}

export default InstallmentPlanCard
