import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Form, Input, InputNumber, Select } from 'antd'
import { Controller, useForm } from 'react-hook-form'
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

const accountTypeOptions = Object.values(AccountType).map((t) => ({
  label: ACCOUNT_TYPE_LABELS[t],
  value: t,
}))

const currencyOptions = Object.values(Currency).map((c) => ({
  label: CURRENCY_LABELS[c],
  value: c,
}))

function AccountForm(props: AccountFormProps) {
  if (props.mode === 'create') return <CreateAccountForm {...props} />
  return <EditAccountForm {...props} />
}

function CreateAccountForm({ onSubmit, isSubmitting, apiErrorMessage, submitLabel, initialValues }: CreateProps) {
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
      <Form.Item label="Account Name" validateStatus={errors.name ? 'error' : ''} help={errors.name?.message}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => <Input {...field} placeholder="e.g., Main Credit Card" size="large" />}
        />
      </Form.Item>

      <Form.Item label="Account Type" validateStatus={errors.type ? 'error' : ''} help={errors.type?.message}>
        <Controller
          name="type"
          control={control}
          render={({ field }) => <Select {...field} options={accountTypeOptions} size="large" />}
        />
      </Form.Item>

      <Form.Item label="Default Currency" validateStatus={errors.currency ? 'error' : ''} help={errors.currency?.message}>
        <Controller
          name="currency"
          control={control}
          render={({ field }) => <Select {...field} options={currencyOptions} size="large" />}
        />
      </Form.Item>

      <Form.Item label="Starting Balance (Optional)" validateStatus={errors.initialBalance ? 'error' : ''} help={errors.initialBalance?.message}>
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
      </Form.Item>

      {apiErrorMessage && (
        <Form.Item>
          <Alert message={apiErrorMessage} type="error" showIcon />
        </Form.Item>
      )}

      <Form.Item>
        <Button type="primary" htmlType="submit" block size="large" loading={isSubmitting}>
          {isSubmitting ? 'Saving…' : submitLabel}
        </Button>
      </Form.Item>
    </Form>
  )
}

function EditAccountForm({ onSubmit, isSubmitting, apiErrorMessage, submitLabel, initialValues }: EditProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<EditAccountFormValues>({
    resolver: zodResolver(editAccountSchema),
    defaultValues: initialValues,
  })

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className={styles.form}>
      <Form.Item label="Account Name" validateStatus={errors.name ? 'error' : ''} help={errors.name?.message}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => <Input {...field} placeholder="e.g., Main Credit Card" size="large" />}
        />
      </Form.Item>

      <Form.Item label="Account Type" validateStatus={errors.type ? 'error' : ''} help={errors.type?.message}>
        <Controller
          name="type"
          control={control}
          render={({ field }) => <Select {...field} options={accountTypeOptions} size="large" />}
        />
      </Form.Item>

      <Form.Item label="Default Currency" validateStatus={errors.currency ? 'error' : ''} help={errors.currency?.message}>
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
          {isSubmitting ? 'Saving…' : submitLabel}
        </Button>
      </Form.Item>
    </Form>
  )
}

export default AccountForm
