import { Modal } from 'antd'
import { useCreateAccount } from '../hooks/useCreateAccount'
import type { CreateAccountRequest } from '../types/AccountTypes'
import AccountForm from './AccountForm'

interface AddAccountModalProps {
  isOpen: boolean
  onClose: () => void
}

function AddAccountModal({ isOpen, onClose }: AddAccountModalProps) {
  const { mutate, isPending, isError, error } = useCreateAccount()

  const handleSubmit = (data: CreateAccountRequest): void => {
    mutate(data, {
      onSuccess: () => {
        onClose()
      },
    })
  }

  const apiErrorMessage = isError
    ? error.response?.data?.details?.[0] ?? error.response?.data?.error ?? 'Failed to create account.'
    : undefined

  return (
    <Modal title="Add Account" open={isOpen} onCancel={onClose} footer={null} destroyOnHidden>
      <AccountForm
        mode="create"
        onSubmit={handleSubmit}
        isSubmitting={isPending}
        apiErrorMessage={apiErrorMessage}
        submitLabel="Create Account"
      />
    </Modal>
  )
}

export default AddAccountModal
