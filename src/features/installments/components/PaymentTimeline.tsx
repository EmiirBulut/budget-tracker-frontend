import { Button, List, Tag, Typography } from 'antd'
import { useMarkPaymentPaid } from '../hooks/useMarkPaymentPaid'
import type { InstallmentPayment } from '../types/InstallmentTypes'

const { Text } = Typography

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
    <List
      dataSource={sortedPayments}
      renderItem={(payment) => {
        const dueDate = new Date(payment.dueDate)
        const isOverdue = !payment.isPaid && dueDate < now

        return (
          <List.Item
            actions={[
              !payment.isPaid && (
                <Button
                  key="mark-paid"
                  size="small"
                  type="primary"
                  loading={isPending}
                  onClick={() => handleMarkPaid(payment.id)}
                >
                  Mark paid
                </Button>
              ),
            ].filter(Boolean)}
          >
            <List.Item.Meta
              title={
                <Text strong>#{payment.monthNumber}</Text>
              }
              description={
                <>
                  <Text type="secondary">Due {dueDate.toLocaleDateString()}</Text>
                  {payment.isPaid && payment.paidDate && (
                    <Text type="secondary"> · Paid {new Date(payment.paidDate).toLocaleDateString()}</Text>
                  )}
                </>
              }
            />
            {payment.isPaid ? (
              <Tag color="success">Paid</Tag>
            ) : isOverdue ? (
              <Tag color="error">Overdue</Tag>
            ) : (
              <Tag color="default">Upcoming</Tag>
            )}
          </List.Item>
        )
      }}
    />
  )
}

export default PaymentTimeline
