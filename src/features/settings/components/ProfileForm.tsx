import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
  const { user } = useAuthStore()
  const { mutate, isPending, isError, isSuccess, error, reset } = useUpdateProfile()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { email: user?.email ?? '' },
  })

  const handleFormSubmit = (data: UpdateProfileRequest): void => {
    reset()
    mutate(data)
  }

  const apiErrorMessage = isError
    ? error.response?.data?.details?.[0] ?? error.response?.data?.error ?? 'Failed to update profile.'
    : undefined

  return (
    <form className={styles.form} onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>
          Email
        </label>
        <input
          id="email"
          type="email"
          className={`${styles.input} ${errors.email ? styles.hasError : ''}`}
          {...register('email')}
        />
        {errors.email && <span className={styles.errorText}>{errors.email.message}</span>}
      </div>

      {apiErrorMessage && <p className={styles.apiError}>{apiErrorMessage}</p>}
      {isSuccess && <p className={styles.successMessage}>Profile updated successfully.</p>}

      <button type="submit" className={styles.submitButton} disabled={isPending}>
        {isPending ? 'Saving…' : 'Save changes'}
      </button>
    </form>
  )
}

export default ProfileForm
