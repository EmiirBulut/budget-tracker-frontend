import { Modal } from 'antd'
import { useUpdateAccount } from '../hooks/useUpdateAccount'
import type { Account, UpdateAccountRequest } from '../types/AccountTypes'
import AccountForm from './AccountForm'

interface EditAccountModalProps {
  isOpen: boolean
  account: Account | null
  onClose: () => void
}

function EditAccountModal({ isOpen, account, onClose }: EditAccountModalProps) {
  const { mutate, isPending, isError, error } = useUpdateAccount()

  const handleSubmit = (data: UpdateAccountRequest): void => {
    if (!account) {
      return
    }

    mutate(
      { id: account.id, data },
      {
        onSuccess: () => {
          onClose()
        },
      },
    )
  }

  const apiErrorMessage = isError
    ? error.response?.data?.details?.[0] ?? error.response?.data?.error ?? 'Failed to update account.'
    : undefined

  return (
    <Modal title="Edit Account" open={isOpen} onCancel={onClose} footer={null} destroyOnHidden>
      {account && (
        <AccountForm
          mode="edit"
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          apiErrorMessage={apiErrorMessage}
          submitLabel="Save changes"
          initialValues={{
            name: account.name,
            type: account.type,
            currency: account.currency,
          }}
        />
      )}
    </Modal>
  )
}

export default EditAccountModal
