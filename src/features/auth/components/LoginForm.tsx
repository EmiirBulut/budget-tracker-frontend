import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Form, Input, Typography } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { ROUTES } from '../../../router/routes'
import { useLogin } from '../hooks/useLogin'
import styles from './LoginForm.module.css'

const { Text } = Typography

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

function LoginForm() {
  const { mutate: submitLogin, isPending, isError, error } = useLogin()

  const {
    control,
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
    <Form layout="vertical" onFinish={handleSubmit(handleFormSubmit)} className={styles.form} noValidate>
      <Form.Item
        label="Email address"
        validateStatus={errors.email ? 'error' : ''}
        help={errors.email?.message}
      >
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              size="large"
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Password"
        validateStatus={errors.password ? 'error' : ''}
        help={errors.password?.message}
      >
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input.Password
              {...field}
              autoComplete="current-password"
              placeholder="••••••••"
              size="large"
            />
          )}
        />
      </Form.Item>

      {isError && (
        <Form.Item>
          <Alert message={apiErrorMessage} type="error" showIcon />
        </Form.Item>
      )}

      <Form.Item>
        <Button type="primary" htmlType="submit" block size="large" loading={isPending}>
          {isPending ? 'Signing in…' : 'Sign in'}
        </Button>
      </Form.Item>

      <Text type="secondary" className={styles.switchText}>
        Don't have an account? <Link to={ROUTES.REGISTER}>Register</Link>
      </Text>
    </Form>
  )
}

export default LoginForm
