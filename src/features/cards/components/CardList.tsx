import { Alert, Col, Empty, Row, Skeleton } from 'antd'
import { useCards } from '../hooks/useCards'
import CardItem from './CardItem'

function CardList() {
  const { data, isLoading, isError, error } = useCards()

  if (isLoading) {
    return (
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}><Skeleton active paragraph={{ rows: 6 }} /></Col>
        <Col xs={24} sm={12}><Skeleton active paragraph={{ rows: 6 }} /></Col>
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
          <CardItem card={card} />
        </Col>
      ))}
    </Row>
  )
}

export default CardList
