import { CreditCardOutlined, LinkOutlined, RightOutlined } from '@ant-design/icons'
import { Card, Flex, Progress, Tag, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useAccounts } from '../../accounts/hooks/useAccounts'
import { formatBalance } from '../../../lib/formatCurrency'
import { CardCategory, CARD_CATEGORY_LABELS, CARD_TYPE_LABELS, type Card as CardModel } from '../types/CardTypes'
import { ROUTES } from '../../../router/routes'
import styles from './CardItem.module.css'

const { Text } = Typography

interface CardItemProps {
  card: CardModel
}

function CardItem({ card }: CardItemProps) {
  const navigate = useNavigate()
  const { data: accounts } = useAccounts()

  const balance = card.balance ?? 0
  const creditLimit = card.creditLimit ?? 0
  const creditUsedPct = creditLimit > 0 ? Math.min(Math.round((balance / creditLimit) * 100), 100) : 0
  const availableCredit = Math.max(creditLimit - balance, 0)

  const linkedAccount = accounts?.find((a) => a.id === card.linkedAccountId)

  return (
    <Card className={styles.wrapper} hoverable onClick={() => navigate(ROUTES.CARD_DETAIL(card.id))}>
      {/* ── Colored visual header ── */}
      <Flex
        vertical
        gap={8}
        className={styles.visual}
        style={{ '--card-color': card.color } as React.CSSProperties}
      >
        <Flex justify="space-between" align="center">
          <Flex align="center" gap={8}>
            <Text className={styles.visualCardType}>{CARD_TYPE_LABELS[card.cardType]}</Text>
            <Tag className={styles.categoryTag}>{CARD_CATEGORY_LABELS[card.cardCategory]}</Tag>
          </Flex>
          <CreditCardOutlined className={styles.visualIcon} />
        </Flex>

        <Text className={styles.visualName}>{card.name}</Text>

        <Flex justify="space-between" align="flex-end" className={styles.visualBottom}>
          <Flex vertical gap={2}>
            <Text className={styles.visualLabel}>Card Number</Text>
            <Text className={styles.visualNumber}>•••• •••• •••• {card.last4Digits}</Text>
          </Flex>
          <Flex vertical align="flex-end" gap={2}>
            <Text className={styles.visualLabel}>Expires</Text>
            <Text className={styles.visualExpiry}>{card.expiryDate}</Text>
          </Flex>
        </Flex>
      </Flex>

      {/* ── Info section ── */}
      <Flex vertical gap={8} className={styles.info}>
        {card.cardCategory === CardCategory.Credit ? (
          <>
            <Flex justify="space-between" align="flex-start">
              <Flex vertical gap={2}>
                <Text type="secondary" className={styles.infoLabel}>Current Balance</Text>
                <Text className={styles.infoAmount}>{formatBalance(balance, card.currency)}</Text>
              </Flex>
              <RightOutlined className={styles.arrow} />
            </Flex>
            <Flex justify="space-between" align="center">
              <Text type="secondary" className={styles.infoLabel}>Credit Used</Text>
              <Text className={styles.creditPct}>{creditUsedPct}%</Text>
            </Flex>
            <Progress
              percent={creditUsedPct}
              showInfo={false}
              strokeColor="#22c55e"
              trailColor="#e5e7eb"
              size="small"
            />
            <Text className={styles.availableText}>
              {formatBalance(availableCredit, card.currency)} available
            </Text>
          </>
        ) : (
          <>
            <Flex justify="space-between" align="flex-start">
              <Flex vertical gap={2}>
                <Text type="secondary" className={styles.infoLabel}>Card Balance</Text>
                <Text className={styles.infoAmount}>{formatBalance(balance, card.currency)}</Text>
              </Flex>
              <RightOutlined className={styles.arrow} />
            </Flex>
            {linkedAccount && (
              <Flex align="center" gap={6}>
                <LinkOutlined className={styles.linkIcon} />
                <Text type="secondary" className={styles.infoLabel}>
                  Linked to <Text strong>{linkedAccount.name}</Text>
                </Text>
              </Flex>
            )}
          </>
        )}
      </Flex>
    </Card>
  )
}

export default CardItem
