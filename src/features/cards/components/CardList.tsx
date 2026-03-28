import { Alert, Empty, Skeleton } from 'antd'
import { useArchiveCard } from '../hooks/useArchiveCard'
import { useCards } from '../hooks/useCards'
import type { Card } from '../types/CardTypes'
import CardItem from './CardItem'
import styles from './CardList.module.css'

interface CardListProps {
  onEdit: (card: Card) => void
}

function CardList({ onEdit }: CardListProps) {
  const { data, isLoading, isError, error } = useCards()
  const { mutate: archive, isPending: isArchiving } = useArchiveCard()

  const handleArchive = (card: Card): void => {
    archive(card.id)
  }

  if (isLoading) {
    return (
      <div className={styles.grid}>
        <Skeleton active paragraph={{ rows: 4 }} />
        <Skeleton active paragraph={{ rows: 4 }} />
      </div>
    )
  }

  if (isError) {
    const message = error.response?.data?.error ?? 'Failed to load cards.'
    return <Alert type="error" message={message} showIcon />
  }

  if (!data || data.length === 0) {
    return <Empty description="No cards yet" />
  }

  return (
    <div className={styles.grid}>
      {data.map((card) => (
        <CardItem key={card.id} card={card} onEdit={onEdit} onArchive={handleArchive} isArchiving={isArchiving} />
      ))}
    </div>
  )
}

export default CardList
