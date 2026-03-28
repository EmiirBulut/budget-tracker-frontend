import { Alert, Empty, Skeleton } from 'antd'
import { useInstallmentPlans } from '../hooks/useInstallmentPlans'
import InstallmentPlanCard from './InstallmentPlanCard'
import styles from './InstallmentPlanList.module.css'

function InstallmentPlanList() {
  const { data, isLoading, isError, error } = useInstallmentPlans()

  if (isLoading) {
    return (
      <div className={styles.grid}>
        <Skeleton active paragraph={{ rows: 5 }} />
        <Skeleton active paragraph={{ rows: 5 }} />
      </div>
    )
  }

  if (isError) {
    const message = error.response?.data?.error ?? 'Failed to load installment plans.'
    return <Alert type="error" message={message} showIcon />
  }

  if (!data || data.length === 0) {
    return <Empty description="No installment plans yet" />
  }

  return (
    <div className={styles.grid}>
      {data.map((plan) => (
        <InstallmentPlanCard key={plan.id} plan={plan} />
      ))}
    </div>
  )
}

export default InstallmentPlanList
