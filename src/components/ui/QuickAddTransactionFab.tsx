import { PlusOutlined } from '@ant-design/icons'
import { useState } from 'react'
import AddTransactionModal from '../../features/transactions/components/AddTransactionModal'
import styles from './QuickAddTransactionFab.module.css'

function QuickAddTransactionFab() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        className={styles.fab}
        onClick={() => setIsOpen(true)}
        aria-label="Add transaction"
        title="Add transaction"
      >
        <PlusOutlined className={styles.icon} />
      </button>

      <AddTransactionModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}

export default QuickAddTransactionFab
