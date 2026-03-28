import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
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
    <form className={styles.form} onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <div className={styles.field}>
        <label htmlFor="currentPassword" className={styles.label}>
          Current password
        </label>
        <input
          id="currentPassword"
          type="password"
          autoComplete="current-password"
          className={`${styles.input} ${errors.currentPassword ? styles.hasError : ''}`}
          {...register('currentPassword')}
        />
        {errors.currentPassword && <span className={styles.errorText}>{errors.currentPassword.message}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="newPassword" className={styles.label}>
          New password
        </label>
        <input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          className={`${styles.input} ${errors.newPassword ? styles.hasError : ''}`}
          {...register('newPassword')}
        />
        {errors.newPassword && <span className={styles.errorText}>{errors.newPassword.message}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="confirmNewPassword" className={styles.label}>
          Confirm new password
        </label>
        <input
          id="confirmNewPassword"
          type="password"
          autoComplete="new-password"
          className={`${styles.input} ${errors.confirmNewPassword ? styles.hasError : ''}`}
          {...register('confirmNewPassword')}
        />
        {errors.confirmNewPassword && <span className={styles.errorText}>{errors.confirmNewPassword.message}</span>}
      </div>

      {apiErrorMessage && <p className={styles.apiError}>{apiErrorMessage}</p>}
      {isSuccess && <p className={styles.successMessage}>Password changed successfully.</p>}

      <button type="submit" className={styles.submitButton} disabled={isPending}>
        {isPending ? 'Changing…' : 'Change password'}
      </button>
    </form>
  )
}

export default ChangePasswordForm
