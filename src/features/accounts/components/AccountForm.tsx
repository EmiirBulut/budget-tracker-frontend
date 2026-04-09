import { BankOutlined, DollarCircleOutlined, MobileOutlined } from '@ant-design/icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Card, Col, Flex, Form, Input, InputNumber, Row, Select, Typography } from 'antd'
import type { ReactNode } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import {
  AccountType,
  ACCOUNT_TYPE_LABELS,
  CURRENCY_LABELS,
  Currency,
  type CreateAccountRequest,
  type UpdateAccountRequest,
} from '../types/AccountTypes'
import styles from './AccountForm.module.css'

const { Text } = Typography

const createAccountSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  type: z.nativeEnum(AccountType),
  currency: z.nativeEnum(Currency),
  initialBalance: z.coerce.number().min(0, 'Initial balance must be at least 0'),
})

const editAccountSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  type: z.nativeEnum(AccountType),
  currency: z.nativeEnum(Currency),
})

type CreateAccountFormValues = z.infer<typeof createAccountSchema>
type EditAccountFormValues = z.infer<typeof editAccountSchema>

interface BaseProps {
  isSubmitting: boolean
  apiErrorMessage?: string
  submitLabel: string
}

interface CreateProps extends BaseProps {
  mode: 'create'
  initialValues?: Partial<CreateAccountFormValues>
  onSubmit: (data: CreateAccountRequest) => void
}

interface EditProps extends BaseProps {
  mode: 'edit'
  initialValues: EditAccountFormValues
  onSubmit: (data: UpdateAccountRequest) => void
}

type AccountFormProps = CreateProps | EditProps

const accountTypeIcons: Record<AccountType, ReactNode> = {
  [AccountType.BankAccount]: <BankOutlined />,
  [AccountType.Cash]: <DollarCircleOutlined />,
  [AccountType.EWallet]: <MobileOutlined />,
}

const currencyOptions = Object.values(Currency).map((c) => ({
  label: CURRENCY_LABELS[c],
  value: c,
}))

interface TypeSelectorProps {
  value: AccountType
  onChange: (value: AccountType) => void
}

function TypeSelector({ value, onChange }: TypeSelectorProps) {
  return (
    <Row gutter={[12, 12]}>
      {Object.values(AccountType).map((type) => (
        <Col span={12} key={type}>
          <Card
            hoverable
            className={value === type ? styles.typeCardSelected : styles.typeCard}
            onClick={() => onChange(type)}
          >
            <Flex align="center" gap={12}>
              <Text className={styles.typeCardIcon}>{accountTypeIcons[type]}</Text>
              <Text>{ACCOUNT_TYPE_LABELS[type]}</Text>
            </Flex>
          </Card>
        </Col>
      ))}
    </Row>
  )
}

function AccountForm(props: AccountFormProps) {
  if (props.mode === 'create') return <CreateAccountForm {...props} />
  return <EditAccountForm {...props} />
}

function CreateAccountForm({ onSubmit, isSubmitting, apiErrorMessage, submitLabel, initialValues }: CreateProps) {
  const { t } = useTranslation()
  const { control, handleSubmit, formState: { errors } } = useForm<CreateAccountFormValues>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      type: initialValues?.type ?? AccountType.BankAccount,
      currency: initialValues?.currency ?? Currency.USD,
      initialBalance: initialValues?.initialBalance ?? 0,
    },
  })

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className={styles.form}>
      <Form.Item label={t('accounts.name')} validateStatus={errors.name ? 'error' : ''} help={errors.name?.message}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => <Input {...field} placeholder={t('accounts.namePlaceholder')} size="large" />}
        />
      </Form.Item>

      <Form.Item label={t('accounts.type')} validateStatus={errors.type ? 'error' : ''} help={errors.type?.message}>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <TypeSelector value={field.value} onChange={field.onChange} />
          )}
        />
      </Form.Item>

      <Form.Item label={t('accounts.currency')} validateStatus={errors.currency ? 'error' : ''} help={errors.currency?.message}>
        <Controller
          name="currency"
          control={control}
          render={({ field }) => <Select {...field} options={currencyOptions} size="large" />}
        />
      </Form.Item>

      <Form.Item
        label={
          <Flex gap={4} align="baseline">
            <Text>{t('accounts.startingBalance')}</Text>
            <Text type="secondary" className={styles.optionalLabel}>{t('accounts.startingBalanceOptional')}</Text>
          </Flex>
        }
        validateStatus={errors.initialBalance ? 'error' : ''}
        help={errors.initialBalance?.message}
      >
        <Controller
          name="initialBalance"
          control={control}
          render={({ field }) => (
            <InputNumber
              {...field}
              prefix="$"
              min={0}
              step={0.01}
              size="large"
              className={styles.inputFull}
            />
          )}
        />
        <Text className={styles.balanceHint}>{t('accounts.startingBalanceHint')}</Text>
      </Form.Item>

      {apiErrorMessage && (
        <Form.Item>
          <Alert message={apiErrorMessage} type="error" showIcon />
        </Form.Item>
      )}

      <Form.Item>
        <Button type="primary" htmlType="submit" block size="large" loading={isSubmitting}>
          {isSubmitting ? t('common.saving') : submitLabel}
        </Button>
      </Form.Item>
    </Form>
  )
}

function EditAccountForm({ onSubmit, isSubmitting, apiErrorMessage, submitLabel, initialValues }: EditProps) {
  const { t } = useTranslation()
  const { control, handleSubmit, formState: { errors } } = useForm<EditAccountFormValues>({
    resolver: zodResolver(editAccountSchema),
    defaultValues: initialValues,
  })

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className={styles.form}>
      <Form.Item label={t('accounts.name')} validateStatus={errors.name ? 'error' : ''} help={errors.name?.message}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => <Input {...field} placeholder={t('accounts.namePlaceholder')} size="large" />}
        />
      </Form.Item>

      <Form.Item label={t('accounts.type')} validateStatus={errors.type ? 'error' : ''} help={errors.type?.message}>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <TypeSelector value={field.value} onChange={field.onChange} />
          )}
        />
      </Form.Item>

      <Form.Item label={t('accounts.currency')} validateStatus={errors.currency ? 'error' : ''} help={errors.currency?.message}>
        <Controller
          name="currency"
          control={control}
          render={({ field }) => <Select {...field} options={currencyOptions} size="large" />}
        />
      </Form.Item>

      {apiErrorMessage && (
        <Form.Item>
          <Alert message={apiErrorMessage} type="error" showIcon />
        </Form.Item>
      )}

      <Form.Item>
        <Button type="primary" htmlType="submit" block size="large" loading={isSubmitting}>
          {isSubmitting ? t('common.saving') : submitLabel}
        </Button>
      </Form.Item>
    </Form>
  )
}

export default AccountForm
