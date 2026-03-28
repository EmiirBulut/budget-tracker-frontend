import { CreditCardOutlined } from '@ant-design/icons'
import { Button, Card, Space, Tag, Typography } from 'antd'
import { formatBalance } from '../../../lib/formatCurrency'
import { CARD_CATEGORY_LABELS, CARD_TYPE_LABELS, type Card as CardModel } from '../types/CardTypes'
import styles from './CardItem.module.css'

const { Text } = Typography

interface CardItemProps {
  card: CardModel
  onEdit: (card: CardModel) => void
  onArchive: (card: CardModel) => void
  isArchiving: boolean
}

function CardItem({ card, onEdit, onArchive, isArchiving }: CardItemProps) {
  return (
    <Card bodyStyle={{ padding: 0 }}>
      {/* Colored visual header — dynamic color via CSS custom property (accepted exception for user-chosen colors) */}
      <div
        className={styles.visual}
        style={{ '--card-color': card.color } as React.CSSProperties}
      >
        <div className={styles.visualRow}>
          <Tag color={card.cardCategory === 'Credit' ? 'blue' : 'green'}>
            {CARD_CATEGORY_LABELS[card.cardCategory]}
          </Tag>
          <CreditCardOutlined />
        </div>
        <span className={styles.visualName}>{card.name}</span>
        <span className={styles.visualNumber}>**** **** **** {card.last4Digits}</span>
        <div className={styles.visualRow}>
          <span>Exp {card.expiryDate}</span>
          <span>{CARD_TYPE_LABELS[card.cardType]}</span>
        </div>
      </div>

      {/* Card body */}
      <div className={styles.body}>
        <Space wrap>
          <Tag>{card.currency}</Tag>
          {card.isArchived && <Tag color="default">Archived</Tag>}
        </Space>

        {card.cardCategory === 'Credit' && card.creditLimit !== null && (
          <Text type="secondary">
            Limit: <Text strong>{formatBalance(card.creditLimit, card.currency)}</Text>
          </Text>
        )}

        <Space>
          <Button size="small" onClick={() => onEdit(card)} disabled={card.isArchived}>
            Edit
          </Button>
          <Button
            size="small"
            danger
            onClick={() => onArchive(card)}
            loading={isArchiving}
            disabled={card.isArchived}
          >
            Archive
          </Button>
        </Space>
      </div>
    </Card>
  )
}

export default CardItem
