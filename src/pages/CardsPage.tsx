import { PlusOutlined } from '@ant-design/icons'
import { Button, Card, Col, Flex, Row, Typography } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import AddCardModal from '../features/cards/components/AddCardModal'
import CardList from '../features/cards/components/CardList'
import { useCards } from '../features/cards/hooks/useCards'
import { CardCategory } from '../features/cards/types/CardTypes'
import { usePreferences } from '../features/settings/hooks/usePreferences'
import { formatTotalBalance } from '../lib/formatCurrency'
import styles from './CardsPage.module.css'

const { Title, Text } = Typography

function CardsPage() {
  const { t } = useTranslation()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const { data: cards } = useCards()
  const { data: preferences } = usePreferences()
  const preferredCurrency = preferences?.defaultCurrency ?? 'USD'

  const activeCredit = cards?.filter((c) => c.cardCategory === CardCategory.Credit && !c.isArchived) ?? []
  const totalCreditBalance = activeCredit.reduce((sum, c) => sum + (c.balance ?? 0), 0)
  const totalCreditLimit = activeCredit.reduce((sum, c) => sum + (c.creditLimit ?? 0), 0)
  const availableCredit = Math.max(totalCreditLimit - totalCreditBalance, 0)

  return (
    <main className={styles.page}>
      <Flex justify="space-between" align="center">
        <Flex vertical gap={2}>
          <Title level={3} className={styles.pageTitle}>{t('cards.title')}</Title>
          <Text type="secondary">{t('cards.subtitle')}</Text>
        </Flex>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddOpen(true)}>
          {t('cards.addCard')}
        </Button>
      </Flex>

      {/* Summary stats */}
      <Row gutter={16}>
        <Col xs={24} sm={8}>
          <Card className={styles.statCard}>
            <Text type="secondary" className={styles.statLabel}>{t('cards.totalCreditBalance')}</Text>
            <Title level={4} className={styles.statAmount}>{formatTotalBalance(totalCreditBalance, preferredCurrency)}</Title>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className={styles.statCard}>
            <Text type="secondary" className={styles.statLabel}>{t('cards.totalCreditLimit')}</Text>
            <Title level={4} className={styles.statAmount}>{formatTotalBalance(totalCreditLimit, preferredCurrency)}</Title>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className={styles.statCard}>
            <Text type="secondary" className={styles.statLabel}>{t('cards.availableCredit')}</Text>
            <Title level={4} className={styles.statAmountGreen}>{formatTotalBalance(availableCredit, preferredCurrency)}</Title>
          </Card>
        </Col>
      </Row>

      <CardList />

      <AddCardModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </main>
  )
}

export default CardsPage
