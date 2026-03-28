import { Modal } from 'antd'
import { useUpdateCard } from '../hooks/useUpdateCard'
import type { Card, UpdateCardRequest } from '../types/CardTypes'
import CardForm from './CardForm'

interface EditCardModalProps {
  isOpen: boolean
  card: Card | null
  onClose: () => void
}

function EditCardModal({ isOpen, card, onClose }: EditCardModalProps) {
  const { mutate, isPending, isError, error } = useUpdateCard()

  const handleSubmit = (data: UpdateCardRequest): void => {
    if (!card) {
      return
    }

    mutate(
      { id: card.id, data },
      {
        onSuccess: () => {
          onClose()
        },
      },
    )
  }

  const apiErrorMessage = isError
    ? error.response?.data?.details?.[0] ?? error.response?.data?.error ?? 'Failed to update card.'
    : undefined

  return (
    <Modal title="Edit Card" open={isOpen} onCancel={onClose} footer={null} destroyOnHidden>
      {card && (
        <CardForm
          mode="edit"
          cardCategory={card.cardCategory}
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          apiErrorMessage={apiErrorMessage}
          submitLabel="Save changes"
          initialValues={{
            name: card.name,
            cardType: card.cardType,
            last4Digits: card.last4Digits,
            expiryDate: card.expiryDate,
            currency: card.currency,
            color: card.color,
            creditLimit: card.creditLimit,
            linkedAccountId: card.linkedAccountId,
          }}
        />
      )}
    </Modal>
  )
}

export default EditCardModal
