import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Form, Input, Typography } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { ROUTES } from '../../../router/routes'
import { useRegister } from '../hooks/useRegister'
import styles from './RegisterForm.module.css'

const { Text } = Typography

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
  const { t } = useTranslation()
  const { mutate: submitRegister, isPending, isError, error } = useRegister()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const handleFormSubmit = (data: RegisterFormData): void => {
    submitRegister({ email: data.email, password: data.password })
  }

  const apiErrorMessage = error?.response?.data?.error ?? t('auth.registrationFailed')

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
              autoComplete="new-password"
              placeholder="••••••••"
              size="large"
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label={t('auth.confirmPassword')}
        validateStatus={errors.confirmPassword ? 'error' : ''}
        help={errors.confirmPassword?.message}
      >
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <Input.Password
              {...field}
              autoComplete="new-password"
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
          {isPending ? t('auth.creatingAccount') : t('auth.createAccount')}
        </Button>
      </Form.Item>

      <Text type="secondary" className={styles.switchText}>
        {t('auth.hasAccount')} <Link to={ROUTES.LOGIN}>{t('auth.signIn')}</Link>
      </Text>

    </Form>
  )
}

export default RegisterForm
