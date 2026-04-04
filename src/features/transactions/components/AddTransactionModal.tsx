import { Modal } from 'antd'
import { useCreateTransaction } from '../hooks/useCreateTransaction'
import type { CreateTransactionRequest } from '../types/TransactionTypes'
import TransactionForm from './TransactionForm'

interface AddTransactionModalProps {
  isOpen: boolean
  onClose: () => void
}

function AddTransactionModal({ isOpen, onClose }: AddTransactionModalProps) {
  const { mutate, isPending, isError, error } = useCreateTransaction()

  const handleSubmit = (data: CreateTransactionRequest): void => {
    mutate(data, {
      onSuccess: () => {
        onClose()
      },
    })
  }

  const apiErrorMessage = isError
    ? error.response?.data?.details?.[0] ?? error.response?.data?.error ?? 'Failed to create transaction.'
    : undefined

  return (
    <Modal
      title="Add Transaction"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      centered
      width="min(560px, 92vw)"
      styles={{ body: { maxHeight: '85vh', overflowY: 'auto' } }}
    >
      <TransactionForm
        onSubmit={handleSubmit}
        isSubmitting={isPending}
        apiErrorMessage={apiErrorMessage}
        submitLabel="Add Transaction"
      />
    </Modal>
  )
}

export default AddTransactionModal
