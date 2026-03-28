import { Tag } from 'antd'
import { useMarkPaymentPaid } from '../hooks/useMarkPaymentPaid'
import type { InstallmentPayment } from '../types/InstallmentTypes'
import styles from './PaymentTimeline.module.css'

interface PaymentTimelineProps {
  planId: string
  payments: InstallmentPayment[]
}

function PaymentTimeline({ planId, payments }: PaymentTimelineProps) {
  const { mutate: markPaid, isPending } = useMarkPaymentPaid()
  const now = new Date()

  const handleMarkPaid = (paymentId: string): void => {
    markPaid({ planId, paymentId })
  }

  const sortedPayments = [...payments].sort((a, b) => a.monthNumber - b.monthNumber)

  return (
    <div className={styles.timeline}>
      {sortedPayments.map((payment) => {
        const dueDate = new Date(payment.dueDate)
        const isOverdue = !payment.isPaid && dueDate < now

        return (
          <div key={payment.id} className={styles.row}>
            <span className={styles.monthNum}>#{payment.monthNumber}</span>

            <div>
              <p className={styles.dueDate}>Due {dueDate.toLocaleDateString()}</p>
              {payment.isPaid && payment.paidDate && (
                <p className={styles.paidDate}>Paid {new Date(payment.paidDate).toLocaleDateString()}</p>
              )}
            </div>

            <div>
              {payment.isPaid ? (
                <Tag color="success">Paid</Tag>
              ) : isOverdue ? (
                <Tag color="error">Overdue</Tag>
              ) : (
                <Tag color="default">Upcoming</Tag>
              )}
            </div>

            <div>
              {!payment.isPaid && (
                <button
                  type="button"
                  className={styles.markPaidButton}
                  onClick={() => handleMarkPaid(payment.id)}
                  disabled={isPending}
                >
                  Mark paid
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default PaymentTimeline
