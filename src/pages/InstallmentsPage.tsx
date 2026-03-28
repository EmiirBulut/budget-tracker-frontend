import { Button } from 'antd'
import { useState } from 'react'
import AddInstallmentPlanModal from '../features/installments/components/AddInstallmentPlanModal'
import InstallmentPlanList from '../features/installments/components/InstallmentPlanList'
import styles from './AccountsPage.module.css'

function InstallmentsPage() {
  const [isAddOpen, setIsAddOpen] = useState(false)

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Installments</h1>
          <p className={styles.description}>Track installment plans and monthly payment schedules.</p>
        </div>

        <Button type="primary" onClick={() => setIsAddOpen(true)}>
          Create plan
        </Button>
      </header>

      <InstallmentPlanList />

      <AddInstallmentPlanModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </main>
  )
}

export default InstallmentsPage
