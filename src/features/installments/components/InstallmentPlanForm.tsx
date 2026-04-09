import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, DatePicker, Form, Input, InputNumber, Select } from 'antd'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { useCards } from '../../cards/hooks/useCards'
import type { CreateInstallmentPlanRequest } from '../types/InstallmentTypes'
import styles from './InstallmentPlanForm.module.css'

const installmentPlanSchema = z.object({
  cardId: z.string().min(1, 'Select a card'),
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  category: z.string().min(1, 'Category is required').max(100, 'Category is too long'),
  totalAmount: z.coerce.number().positive('Must be greater than 0'),
  numberOfMonths: z.coerce.number().int().min(1, 'Must be at least 1 month').max(360, 'Maximum 360 months'),
  monthlyPayment: z.coerce.number().positive('Must be greater than 0'),
  startDate: z.string().min(1, 'Start date is required'),
})

type InstallmentPlanFormValues = z.infer<typeof installmentPlanSchema>

interface InstallmentPlanFormProps {
  isSubmitting: boolean
  apiErrorMessage?: string
  submitLabel: string
  onSubmit: (data: CreateInstallmentPlanRequest) => void
}

function InstallmentPlanForm({ onSubmit, isSubmitting, apiErrorMessage, submitLabel }: InstallmentPlanFormProps) {
  const { t } = useTranslation()
  const { data: cards } = useCards()
  const today = new Date().toISOString().split('T')[0]

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<InstallmentPlanFormValues>({
    resolver: zodResolver(installmentPlanSchema),
    defaultValues: {
      cardId: '',
      name: '',
      category: '',
      totalAmount: undefined,
      numberOfMonths: 12,
      monthlyPayment: undefined,
      startDate: today,
    },
  })

  const totalAmount = watch('totalAmount')
  const numberOfMonths = watch('numberOfMonths')

  useEffect(() => {
    if (totalAmount > 0 && numberOfMonths > 0) {
      setValue('monthlyPayment', Math.round((totalAmount / numberOfMonths) * 100) / 100)
    }
  }, [totalAmount, numberOfMonths, setValue])

  const handleFormSubmit = (values: InstallmentPlanFormValues): void => {
    onSubmit({
      ...values,
      startDate: new Date(values.startDate).toISOString(),
    })
  }

  const cardOptions = (cards ?? []).map((c) => ({
    label: `${c.name} (**** ${c.last4Digits})`,
    value: c.id,
  }))

  return (
    <Form layout="vertical" onFinish={handleSubmit(handleFormSubmit)} className={styles.form}>
      <Form.Item label={t('installments.cardLabel')} validateStatus={errors.cardId ? 'error' : ''} help={errors.cardId?.message}>
        <Controller
          name="cardId"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={cardOptions}
              placeholder={t('installments.selectCard')}
              size="large"
              className={styles.inputFull}
            />
          )}
        />
      </Form.Item>

      <Form.Item label={t('installments.planName')} validateStatus={errors.name ? 'error' : ''} help={errors.name?.message}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder={t('installments.planNamePlaceholder')} size="large" />
          )}
        />
      </Form.Item>

      <Form.Item label={t('installments.category')} validateStatus={errors.category ? 'error' : ''} help={errors.category?.message}>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder={t('installments.categoryPlaceholder')} size="large" />
          )}
        />
      </Form.Item>

      <Form.Item label={t('installments.totalAmount')} validateStatus={errors.totalAmount ? 'error' : ''} help={errors.totalAmount?.message}>
        <Controller
          name="totalAmount"
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

      <Form.Item label={t('installments.numberOfMonths')} validateStatus={errors.numberOfMonths ? 'error' : ''} help={errors.numberOfMonths?.message}>
        <Controller
          name="numberOfMonths"
          control={control}
          render={({ field }) => (
            <InputNumber
              {...field}
              min={1}
              max={360}
              size="large"
              className={styles.inputFull}
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label={t('installments.monthlyPayment')}
        validateStatus={errors.monthlyPayment ? 'error' : ''}
        help={errors.monthlyPayment?.message ?? t('installments.monthlyPaymentHint')}
      >
        <Controller
          name="monthlyPayment"
          control={control}
          render={({ field }) => (
            <InputNumber
              {...field}
              prefix="$"
              min={0}
              step={0.01}
              placeholder={t('installments.monthlyPaymentPlaceholder')}
              size="large"
              className={styles.inputFull}
            />
          )}
        />
      </Form.Item>

      <Form.Item label={t('installments.startDate')} validateStatus={errors.startDate ? 'error' : ''} help={errors.startDate?.message}>
        <Controller
          name="startDate"
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

      {apiErrorMessage && (
        <Form.Item>
          <Alert message={apiErrorMessage} type="error" showIcon />
        </Form.Item>
      )}

      <Form.Item>
        <Button type="primary" htmlType="submit" block size="large" loading={isSubmitting}>
          {isSubmitting ? t('installments.creating') : submitLabel}
        </Button>
      </Form.Item>
    </Form>
  )
}

export default InstallmentPlanForm
