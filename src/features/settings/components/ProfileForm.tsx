import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Form, Input } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { useAuthStore } from '../../auth/store/authStore'
import { useUpdateProfile } from '../hooks/useUpdateProfile'
import type { UpdateProfileRequest } from '../types/SettingsTypes'
import styles from './ProfileForm.module.css'

const profileSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Must be a valid email'),
})

type ProfileFormValues = z.infer<typeof profileSchema>

function ProfileForm() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const { mutate, isPending, isError, isSuccess, error, reset } = useUpdateProfile()

  const { control, handleSubmit, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { email: user?.email ?? '' },
  })

  const handleFormSubmit = (data: UpdateProfileRequest): void => {
    reset()
    mutate(data)
  }

  const apiErrorMessage = isError
    ? error.response?.data?.details?.[0] ?? error.response?.data?.error ?? t('profile.updateFailed')
    : undefined

  return (
    <Form layout="vertical" onFinish={handleSubmit(handleFormSubmit)} className={styles.form}>
      <Form.Item label={t('profile.email')} validateStatus={errors.email ? 'error' : ''} help={errors.email?.message}>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input {...field} type="email" size="large" />
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
          <Alert message={t('profile.updateSuccess')} type="success" showIcon />
        </Form.Item>
      )}

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isPending}>
          {isPending ? t('common.saving') : t('profile.saveChanges')}
        </Button>
      </Form.Item>
    </Form>
  )
}

export default ProfileForm
