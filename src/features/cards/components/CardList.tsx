import { Alert, Col, Empty, Row, Skeleton } from 'antd'
import { useArchiveCard } from '../hooks/useArchiveCard'
import { useCards } from '../hooks/useCards'
import type { Card } from '../types/CardTypes'
import CardItem from './CardItem'

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
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}><Skeleton active paragraph={{ rows: 4 }} /></Col>
        <Col xs={24} sm={12}><Skeleton active paragraph={{ rows: 4 }} /></Col>
      </Row>
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
    <Row gutter={[16, 16]}>
      {data.map((card) => (
        <Col key={card.id} xs={24} sm={12}>
          <CardItem card={card} onEdit={onEdit} onArchive={handleArchive} isArchiving={isArchiving} />
        </Col>
      ))}
    </Row>
  )
}

export default CardList
