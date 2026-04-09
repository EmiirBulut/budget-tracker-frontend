import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Form, Input, Typography } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
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

  const apiErrorMessage = error?.response?.data?.error ?? t('auth.loginFailed')

  return (
    <Form layout="vertical" onFinish={handleSubmit(handleFormSubmit)} className={styles.form} noValidate>
      <Form.Item
        label={t('auth.emailAddress')}
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
              placeholder={t('auth.emailPlaceholder')}
              size="large"
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label={t('auth.password')}
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
          {isPending ? t('auth.signingIn') : t('auth.signIn')}
        </Button>
      </Form.Item>

      <Text type="secondary" className={styles.switchText}>
        {t('auth.noAccount')} <Link to={ROUTES.REGISTER}>{t('auth.register')}</Link>
      </Text>
    </Form>
  )
}

export default LoginForm
