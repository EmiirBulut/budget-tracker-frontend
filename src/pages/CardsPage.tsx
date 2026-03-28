import { PlusOutlined } from '@ant-design/icons'
import { Button, Typography } from 'antd'
import { useState } from 'react'
import AddCardModal from '../features/cards/components/AddCardModal'
import CardList from '../features/cards/components/CardList'
import EditCardModal from '../features/cards/components/EditCardModal'
import type { Card } from '../features/cards/types/CardTypes'
import styles from './AccountsPage.module.css'

const { Title, Text } = Typography

function CardsPage() {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingCard, setEditingCard] = useState<Card | null>(null)

  const handleOpenAdd = (): void => setIsAddOpen(true)
  const handleCloseAdd = (): void => setIsAddOpen(false)
  const handleOpenEdit = (card: Card): void => setEditingCard(card)
  const handleCloseEdit = (): void => setEditingCard(null)

  return (
    <main className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <Title level={3} style={{ marginBottom: 0 }}>Cards</Title>
          <Text type="secondary">Manage your credit and debit cards</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenAdd}>
          Add Card
        </Button>
      </div>

      <CardList onEdit={handleOpenEdit} />

      <AddCardModal isOpen={isAddOpen} onClose={handleCloseAdd} />
      <EditCardModal isOpen={editingCard !== null} card={editingCard} onClose={handleCloseEdit} />
    </main>
  )
}

export default CardsPage
