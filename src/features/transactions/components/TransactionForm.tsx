import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, DatePicker, Form, Input, InputNumber, Select, Segmented, Typography } from 'antd'
import dayjs from 'dayjs'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useAccounts } from '../../accounts/hooks/useAccounts'
import { useCards } from '../../cards/hooks/useCards'
import type { CreateTransactionRequest, TransactionType } from '../types/TransactionTypes'
import styles from './TransactionForm.module.css'

const { Text } = Typography

const transactionSchema = z.object({
  type: z.enum(['Expense', 'Income', 'Installment'] as const),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  category: z.string().min(1, 'Category is required').max(100, 'Category is too long'),
  description: z.string().max(500, 'Description is too long'),
  date: z.string().min(1, 'Date is required'),
  accountId: z.string().nullable().optional(),
  cardId: z.string().nullable().optional(),
})

type TransactionFormValues = z.infer<typeof transactionSchema>

interface TransactionFormProps {
  isSubmitting: boolean
  apiErrorMessage?: string
  submitLabel: string
  onSubmit: (data: CreateTransactionRequest) => void
}

const typeSegmentOptions: { label: string; value: TransactionType }[] = [
  { label: 'Expense', value: 'Expense' },
  { label: 'Income', value: 'Income' },
  { label: 'Installment', value: 'Installment' },
]

function TransactionForm({ onSubmit, isSubmitting, apiErrorMessage, submitLabel }: TransactionFormProps) {
  const { data: accounts } = useAccounts()
  const { data: cards } = useCards()

  const today = new Date().toISOString().split('T')[0]

  const { control, handleSubmit, formState: { errors } } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'Expense',
      amount: undefined,
      category: '',
      description: '',
      date: today,
      accountId: null,
      cardId: null,
    },
  })

  const handleFormSubmit = (values: TransactionFormValues): void => {
    onSubmit({
      type: values.type,
      amount: values.amount,
      category: values.category,
      description: values.description,
      date: new Date(values.date).toISOString(),
      accountId: values.accountId || null,
      cardId: values.cardId || null,
    })
  }

  const accountOptions = [
    { label: 'None', value: '' },
    ...(accounts ?? []).map((a) => ({ label: a.name, value: a.id })),
  ]

  const cardOptions = [
    { label: 'None', value: '' },
    ...(cards ?? []).map((c) => ({ label: `${c.name} (**** ${c.last4Digits})`, value: c.id })),
  ]

  return (
    <Form layout="vertical" onFinish={handleSubmit(handleFormSubmit)} className={styles.form}>
      <Form.Item label="Transaction Type">
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Segmented
              options={typeSegmentOptions}
              value={field.value}
              onChange={field.onChange}
              block
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Account"
        extra={<Text type="secondary">Optional</Text>}
      >
        <Controller
          name="accountId"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              value={field.value ?? ''}
              options={accountOptions}
              size="large"
            />
          )}
        />
      </Form.Item>

      <Form.Item label="Amount" validateStatus={errors.amount ? 'error' : ''} help={errors.amount?.message}>
        <Controller
          name="amount"
          control={control}
          render={({ field }) => (
            <InputNumber
              {...field}
              prefix="$"
              min={0}
              step={0.01}
              placeholder="0.00"
              size="large"
              className={styles.inputFull}
            />
          )}
        />
      </Form.Item>

      <Form.Item label="Category" validateStatus={errors.category ? 'error' : ''} help={errors.category?.message}>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="e.g. Food, Rent, Salary" size="large" />
          )}
        />
      </Form.Item>

      <Form.Item label="Description" validateStatus={errors.description ? 'error' : ''} help={errors.description?.message}>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="Optional note" size="large" />
          )}
        />
      </Form.Item>

      <Form.Item label="Date" validateStatus={errors.date ? 'error' : ''} help={errors.date?.message}>
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <DatePicker
              value={field.value ? dayjs(field.value) : null}
              onChange={(d) => field.onChange(d ? d.toISOString().split('T')[0] : '')}
              size="large"
              className={styles.inputFull}
            />
          )}
        />
      </Form.Item>

      <Form.Item label="Card" extra={<Text type="secondary">Optional</Text>}>
        <Controller
          name="cardId"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              value={field.value ?? ''}
              options={cardOptions}
              size="large"
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

export default TransactionForm
