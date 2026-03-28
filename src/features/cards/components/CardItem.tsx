import { Button, Tag } from 'antd'
import { formatBalance } from '../../../lib/formatCurrency'
import { CARD_CATEGORY_LABELS, CARD_TYPE_LABELS, type Card } from '../types/CardTypes'
import styles from './CardItem.module.css'

interface CardItemProps {
  card: Card
  onEdit: (card: Card) => void
  onArchive: (card: Card) => void
  isArchiving: boolean
}

function CardItem({ card, onEdit, onArchive, isArchiving }: CardItemProps) {
  return (
    <article className={styles.card}>
      <div className={styles.visual} style={{ backgroundColor: card.color }}>
        <span className={styles.visualName}>{card.name}</span>
        <span className={styles.visualNumber}>**** **** **** {card.last4Digits}</span>
        <div className={styles.visualRow}>
          <span>Exp {card.expiryDate}</span>
          <span>{CARD_TYPE_LABELS[card.cardType]}</span>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.tags}>
          <Tag color={card.cardCategory === 'Credit' ? 'blue' : 'green'}>
            {CARD_CATEGORY_LABELS[card.cardCategory]}
          </Tag>
          <Tag>{card.currency}</Tag>
          {card.isArchived && <Tag color="default">Archived</Tag>}
        </div>

        {card.cardCategory === 'Credit' && card.creditLimit !== null && (
          <p className={styles.creditLimit}>
            Limit: <span className={styles.creditLimitValue}>{formatBalance(card.creditLimit, card.currency)}</span>
          </p>
        )}

        <div className={styles.actions}>
          <Button size="small" onClick={() => onEdit(card)} disabled={card.isArchived}>
            Edit
          </Button>
          <Button size="small" danger onClick={() => onArchive(card)} loading={isArchiving} disabled={card.isArchived}>
            Archive
          </Button>
        </div>
      </div>
    </article>
  )
}

export default CardItem
