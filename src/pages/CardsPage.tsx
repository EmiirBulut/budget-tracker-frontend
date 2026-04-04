import { PlusOutlined } from '@ant-design/icons'
import { Button, Card, Col, Flex, Row, Typography } from 'antd'
import { useState } from 'react'
import AddCardModal from '../features/cards/components/AddCardModal'
import CardList from '../features/cards/components/CardList'
import { useCards } from '../features/cards/hooks/useCards'
import { CardCategory } from '../features/cards/types/CardTypes'
import { formatTotalBalance } from '../lib/formatCurrency'
import styles from './CardsPage.module.css'

const { Title, Text } = Typography

function CardsPage() {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const { data: cards } = useCards()

  const activeCredit = cards?.filter((c) => c.cardCategory === CardCategory.Credit && !c.isArchived) ?? []
  const totalCreditBalance = activeCredit.reduce((sum, c) => sum + (c.balance ?? 0), 0)
  const totalCreditLimit = activeCredit.reduce((sum, c) => sum + (c.creditLimit ?? 0), 0)
  const availableCredit = Math.max(totalCreditLimit - totalCreditBalance, 0)

  return (
    <main className={styles.page}>
      <Flex justify="space-between" align="center">
        <Flex vertical gap={2}>
          <Title level={3} className={styles.pageTitle}>Cards</Title>
          <Text type="secondary">Manage your credit and debit cards</Text>
        </Flex>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddOpen(true)}>
          Add Card
        </Button>
      </Flex>

      {/* Summary stats */}
      <Row gutter={16}>
        <Col xs={24} sm={8}>
          <Card className={styles.statCard}>
            <Text type="secondary" className={styles.statLabel}>Total Credit Balance</Text>
            <Title level={4} className={styles.statAmount}>{formatTotalBalance(totalCreditBalance)}</Title>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className={styles.statCard}>
            <Text type="secondary" className={styles.statLabel}>Total Credit Limit</Text>
            <Title level={4} className={styles.statAmount}>{formatTotalBalance(totalCreditLimit)}</Title>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className={styles.statCard}>
            <Text type="secondary" className={styles.statLabel}>Available Credit</Text>
            <Title level={4} className={styles.statAmountGreen}>{formatTotalBalance(availableCredit)}</Title>
          </Card>
        </Col>
      </Row>

      <CardList />

      <AddCardModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </main>
  )
}

export default CardsPage
