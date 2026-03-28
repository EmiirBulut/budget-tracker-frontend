import { formatTotalBalance } from '../../../lib/formatCurrency'
import type { ReportSummary } from '../types/ReportTypes'
import styles from './ReportSummaryCards.module.css'

interface ReportSummaryCardsProps {
  summary: ReportSummary
}

function ReportSummaryCards({ summary }: ReportSummaryCardsProps) {
  const netClass = summary.netBalance >= 0 ? styles.positive : styles.negative

  return (
    <div className={styles.grid}>
      <article className={styles.card}>
        <p className={styles.label}>Total Income</p>
        <p className={`${styles.value} ${styles.income}`}>{formatTotalBalance(summary.totalIncome)}</p>
      </article>

      <article className={styles.card}>
        <p className={styles.label}>Total Expense</p>
        <p className={`${styles.value} ${styles.expense}`}>{formatTotalBalance(summary.totalExpense)}</p>
      </article>

      <article className={styles.card}>
        <p className={styles.label}>Net Balance</p>
        <p className={`${styles.value} ${styles.net} ${netClass}`}>{formatTotalBalance(summary.netBalance)}</p>
      </article>
    </div>
  )
}

export default ReportSummaryCards
