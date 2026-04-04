import { Modal } from 'antd'
import { useCreateInstallmentPlan } from '../hooks/useCreateInstallmentPlan'
import type { CreateInstallmentPlanRequest } from '../types/InstallmentTypes'
import InstallmentPlanForm from './InstallmentPlanForm'

interface AddInstallmentPlanModalProps {
  isOpen: boolean
  onClose: () => void
}

function AddInstallmentPlanModal({ isOpen, onClose }: AddInstallmentPlanModalProps) {
  const { mutate, isPending, isError, error } = useCreateInstallmentPlan()

  const handleSubmit = (data: CreateInstallmentPlanRequest): void => {
    mutate(data, {
      onSuccess: () => {
        onClose()
      },
    })
  }

  const apiErrorMessage = isError
    ? error.response?.data?.details?.[0] ?? error.response?.data?.error ?? 'Failed to create installment plan.'
    : undefined

  return (
    <Modal
      title="Create Installment Plan"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      centered
      width="min(560px, 92vw)"
      styles={{ body: { maxHeight: '85vh', overflowY: 'auto' } }}
    >
      <InstallmentPlanForm
        onSubmit={handleSubmit}
        isSubmitting={isPending}
        apiErrorMessage={apiErrorMessage}
        submitLabel="Create plan"
      />
    </Modal>
  )
}

export default AddInstallmentPlanModal
