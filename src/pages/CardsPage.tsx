import { Button } from 'antd'
import { useState } from 'react'
import AddCardModal from '../features/cards/components/AddCardModal'
import CardList from '../features/cards/components/CardList'
import EditCardModal from '../features/cards/components/EditCardModal'
import type { Card } from '../features/cards/types/CardTypes'
import styles from './AccountsPage.module.css'

function CardsPage() {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingCard, setEditingCard] = useState<Card | null>(null)

  const handleOpenAdd = (): void => {
    setIsAddOpen(true)
  }

  const handleCloseAdd = (): void => {
    setIsAddOpen(false)
  }

  const handleOpenEdit = (card: Card): void => {
    setEditingCard(card)
  }

  const handleCloseEdit = (): void => {
    setEditingCard(null)
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Cards</h1>
          <p className={styles.description}>Manage credit and debit cards.</p>
        </div>

        <Button type="primary" onClick={handleOpenAdd}>
          Add card
        </Button>
      </header>

      <CardList onEdit={handleOpenEdit} />

      <AddCardModal isOpen={isAddOpen} onClose={handleCloseAdd} />
      <EditCardModal isOpen={editingCard !== null} card={editingCard} onClose={handleCloseEdit} />
    </main>
  )
}

export default CardsPage
