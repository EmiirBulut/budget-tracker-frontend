import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { useRegister } from '../hooks/useRegister'
import { ROUTES } from '../../../router/routes'
import styles from './RegisterForm.module.css'

const registerSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password must be at most 128 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

function RegisterForm() {
  const { mutate: submitRegister, isPending, isError, error } = useRegister()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const handleFormSubmit = (data: RegisterFormData): void => {
    submitRegister({ email: data.email, password: data.password })
  }

  const apiErrorMessage = error?.response?.data?.error ?? 'Registration failed. Please try again.'

  return (
    <form className={styles.form} onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>
          Email address
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className={`${styles.input} ${errors.email ? styles.hasError : ''}`}
          {...register('email')}
        />
        {errors.email && <span className={styles.errorText}>{errors.email.message}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="password" className={styles.label}>
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          className={`${styles.input} ${errors.password ? styles.hasError : ''}`}
          {...register('password')}
        />
        {errors.password && <span className={styles.errorText}>{errors.password.message}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="confirmPassword" className={styles.label}>
          Confirm password
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          className={`${styles.input} ${errors.confirmPassword ? styles.hasError : ''}`}
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <span className={styles.errorText}>{errors.confirmPassword.message}</span>
        )}
      </div>

      {isError && <p className={styles.apiError}>{apiErrorMessage}</p>}

      <button type="submit" className={styles.submitButton} disabled={isPending}>
        {isPending ? 'Creating account…' : 'Create account'}
      </button>

      <p className={styles.switchLink}>
        Already have an account? <Link to={ROUTES.LOGIN}>Sign in</Link>
      </p>
    </form>
  )
}

export default RegisterForm
