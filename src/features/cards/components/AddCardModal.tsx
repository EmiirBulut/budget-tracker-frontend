import { Modal } from 'antd'
import { useCreateCard } from '../hooks/useCreateCard'
import type { CreateCardRequest } from '../types/CardTypes'
import CardForm from './CardForm'

interface AddCardModalProps {
  isOpen: boolean
  onClose: () => void
}

function AddCardModal({ isOpen, onClose }: AddCardModalProps) {
  const { mutate, isPending, isError, error } = useCreateCard()

  const handleSubmit = (data: CreateCardRequest): void => {
    mutate(data, {
      onSuccess: () => {
        onClose()
      },
    })
  }

  const apiErrorMessage = isError
    ? error.response?.data?.details?.[0] ?? error.response?.data?.error ?? 'Failed to create card.'
    : undefined

  return (
    <Modal title="Add Card" open={isOpen} onCancel={onClose} footer={null} destroyOnHidden>
      <CardForm
        mode="create"
        onSubmit={handleSubmit}
        isSubmitting={isPending}
        apiErrorMessage={apiErrorMessage}
        submitLabel="Create card"
      />
    </Modal>
  )
}

export default AddCardModal
