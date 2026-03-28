import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Form, Input } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useChangePassword } from '../hooks/useChangePassword'
import styles from './ProfileForm.module.css'

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmNewPassword: z.string().min(1, 'Confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  })

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>

function ChangePasswordForm() {
  const { mutate, isPending, isError, isSuccess, error, reset } = useChangePassword()

  const { control, handleSubmit, resetField, formState: { errors } } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmNewPassword: '' },
  })

  const handleFormSubmit = (values: ChangePasswordFormValues): void => {
    reset()
    mutate(
      { currentPassword: values.currentPassword, newPassword: values.newPassword },
      {
        onSuccess: () => {
          resetField('currentPassword')
          resetField('newPassword')
          resetField('confirmNewPassword')
        },
      },
    )
  }

  const apiErrorMessage = isError
    ? error.response?.data?.details?.[0] ?? error.response?.data?.error ?? 'Failed to change password.'
    : undefined

  return (
    <Form layout="vertical" onFinish={handleSubmit(handleFormSubmit)} className={styles.form}>
      <Form.Item label="Current password" validateStatus={errors.currentPassword ? 'error' : ''} help={errors.currentPassword?.message}>
        <Controller
          name="currentPassword"
          control={control}
          render={({ field }) => (
            <Input.Password {...field} autoComplete="current-password" size="large" />
          )}
        />
      </Form.Item>

      <Form.Item label="New password" validateStatus={errors.newPassword ? 'error' : ''} help={errors.newPassword?.message}>
        <Controller
          name="newPassword"
          control={control}
          render={({ field }) => (
            <Input.Password {...field} autoComplete="new-password" size="large" />
          )}
        />
      </Form.Item>

      <Form.Item label="Confirm new password" validateStatus={errors.confirmNewPassword ? 'error' : ''} help={errors.confirmNewPassword?.message}>
        <Controller
          name="confirmNewPassword"
          control={control}
          render={({ field }) => (
            <Input.Password {...field} autoComplete="new-password" size="large" />
          )}
        />
      </Form.Item>

      {apiErrorMessage && (
        <Form.Item>
          <Alert message={apiErrorMessage} type="error" showIcon />
        </Form.Item>
      )}

      {isSuccess && (
        <Form.Item>
          <Alert message="Password changed successfully." type="success" showIcon />
        </Form.Item>
      )}

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isPending}>
          {isPending ? 'Changing…' : 'Change password'}
        </Button>
      </Form.Item>
    </Form>
  )
}

export default ChangePasswordForm
