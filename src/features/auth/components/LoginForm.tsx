import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { useLogin } from '../hooks/useLogin'
import { ROUTES } from '../../../router/routes'
import styles from './LoginForm.module.css'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

function LoginForm() {
  const { mutate: submitLogin, isPending, isError, error } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const handleFormSubmit = (data: LoginFormData): void => {
    submitLogin(data)
  }

  const apiErrorMessage = error?.response?.data?.error ?? 'Login failed. Please try again.'

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
          autoComplete="current-password"
          placeholder="••••••••"
          className={`${styles.input} ${errors.password ? styles.hasError : ''}`}
          {...register('password')}
        />
        {errors.password && <span className={styles.errorText}>{errors.password.message}</span>}
      </div>

      {isError && <p className={styles.apiError}>{apiErrorMessage}</p>}

      <button type="submit" className={styles.submitButton} disabled={isPending}>
        {isPending ? 'Signing in…' : 'Sign in'}
      </button>

      <p className={styles.switchLink}>
        Don't have an account? <Link to={ROUTES.REGISTER}>Register</Link>
      </p>
    </form>
  )
}

export default LoginForm
