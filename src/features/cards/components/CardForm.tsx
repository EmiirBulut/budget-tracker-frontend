import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Col, Form, Input, InputNumber, Row, Select, Typography } from 'antd'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useAccounts } from '../../accounts/hooks/useAccounts'
import { CURRENCY_LABELS } from '../../accounts/types/AccountTypes'
import {
  CARD_COLORS,
  CARD_TYPE_LABELS,
  CardCategory,
  CardType,
  Currency,
  type CreateCardRequest,
  type UpdateCardRequest,
} from '../types/CardTypes'
import styles from './CardForm.module.css'

const { Text } = Typography

const baseCardSchema = {
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  cardType: z.nativeEnum(CardType),
  last4Digits: z.string().length(4, 'Must be exactly 4 digits').regex(/^\d{4}$/, 'Must be 4 digits'),
  expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, 'Format must be MM/YY'),
  currency: z.nativeEnum(Currency),
  color: z.string().min(1, 'Select a color'),
  creditLimit: z.coerce.number().positive('Must be positive').nullable().optional(),
  linkedAccountId: z.string().nullable().optional(),
}

const createCardSchema = z.object({ ...baseCardSchema, cardCategory: z.nativeEnum(CardCategory) })
const editCardSchema = z.object(baseCardSchema)

type CreateCardFormValues = z.infer<typeof createCardSchema>
type EditCardFormValues = z.infer<typeof editCardSchema>

interface BaseProps {
  isSubmitting: boolean
  apiErrorMessage?: string
  submitLabel: string
}

interface CreateProps extends BaseProps {
  mode: 'create'
  initialValues?: Partial<CreateCardFormValues>
  onSubmit: (data: CreateCardRequest) => void
}

interface EditProps extends BaseProps {
  mode: 'edit'
  cardCategory: CardCategory
  initialValues: EditCardFormValues
  onSubmit: (data: UpdateCardRequest) => void
}

type CardFormProps = CreateProps | EditProps

const cardTypeOptions = Object.values(CardType).map((t) => ({ label: CARD_TYPE_LABELS[t], value: t }))
const currencyOptions = Object.values(Currency).map((c) => ({ label: CURRENCY_LABELS[c], value: c }))
const cardCategoryOptions = [
  { label: 'Credit', value: CardCategory.Credit },
  { label: 'Debit', value: CardCategory.Debit },
]

function CardForm(props: CardFormProps) {
  if (props.mode === 'create') return <CreateCardForm {...props} />
  return <EditCardForm {...props} />
}

function ColorSwatchField({
  colors,
  selected,
  onSelect,
  error,
}: {
  colors: string[]
  selected: string
  onSelect: (c: string) => void
  error?: string
}) {
  return (
    <Form.Item label="Card Color" validateStatus={error ? 'error' : ''} help={error}>
      <div className={styles.swatchRow}>
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            className={`${styles.swatch} ${selected === color ? styles.swatchSelected : ''}`}
            style={{ '--swatch-color': color } as React.CSSProperties}
            onClick={() => onSelect(color)}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>
    </Form.Item>
  )
}

function CreateCardForm({ onSubmit, isSubmitting, apiErrorMessage, submitLabel, initialValues }: CreateProps) {
  const { data: accounts } = useAccounts()

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<CreateCardFormValues>({
    resolver: zodResolver(createCardSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      cardCategory: initialValues?.cardCategory ?? CardCategory.Credit,
      cardType: initialValues?.cardType ?? CardType.Visa,
      last4Digits: initialValues?.last4Digits ?? '',
      expiryDate: initialValues?.expiryDate ?? '',
      currency: initialValues?.currency ?? Currency.USD,
      color: initialValues?.color ?? CARD_COLORS[0],
      creditLimit: initialValues?.creditLimit ?? null,
      linkedAccountId: initialValues?.linkedAccountId ?? null,
    },
  })

  const selectedCategory = watch('cardCategory')
  const selectedColor = watch('color')

  useEffect(() => {
    setValue('creditLimit', null)
    setValue('linkedAccountId', null)
  }, [selectedCategory, setValue])

  const accountOptions = (accounts ?? []).map((a) => ({ label: a.name, value: a.id }))

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className={styles.form}>
      <Form.Item label="Card Name" validateStatus={errors.name ? 'error' : ''} help={errors.name?.message}>
        <Controller name="name" control={control}
          render={({ field }) => <Input {...field} placeholder="e.g., Main Credit Card" size="large" />}
        />
      </Form.Item>

      <Form.Item label="Card Category" validateStatus={errors.cardCategory ? 'error' : ''} help={errors.cardCategory?.message}>
        <Controller name="cardCategory" control={control}
          render={({ field }) => <Select {...field} options={cardCategoryOptions} size="large" />}
        />
      </Form.Item>

      <Form.Item label="Card Type" validateStatus={errors.cardType ? 'error' : ''} help={errors.cardType?.message}>
        <Controller name="cardType" control={control}
          render={({ field }) => <Select {...field} options={cardTypeOptions} size="large" />}
        />
      </Form.Item>

      <Row gutter={12}>
        <Col span={12}>
          <Form.Item label="Last 4 Digits" validateStatus={errors.last4Digits ? 'error' : ''} help={errors.last4Digits?.message}>
            <Controller name="last4Digits" control={control}
              render={({ field }) => <Input {...field} maxLength={4} placeholder="4532" size="large" />}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Expiry Date" validateStatus={errors.expiryDate ? 'error' : ''} help={errors.expiryDate?.message}>
            <Controller name="expiryDate" control={control}
              render={({ field }) => <Input {...field} placeholder="MM/YY" maxLength={5} size="large" />}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label="Currency" validateStatus={errors.currency ? 'error' : ''} help={errors.currency?.message}>
        <Controller name="currency" control={control}
          render={({ field }) => <Select {...field} options={currencyOptions} size="large" />}
        />
      </Form.Item>

      <ColorSwatchField
        colors={CARD_COLORS}
        selected={selectedColor}
        onSelect={(c) => setValue('color', c)}
        error={errors.color?.message}
      />

      {selectedCategory === CardCategory.Credit && (
        <Form.Item label="Credit Limit" validateStatus={errors.creditLimit ? 'error' : ''} help={errors.creditLimit?.message}>
          <Controller name="creditLimit" control={control}
            render={({ field }) => (
              <InputNumber {...field} value={field.value ?? undefined} prefix="$" min={0} step={0.01} size="large" className={styles.inputFull} />
            )}
          />
        </Form.Item>
      )}

      {selectedCategory === CardCategory.Debit && (
        <Form.Item label="Linked Account">
          <Controller name="linkedAccountId" control={control}
            render={({ field }) => (
              <Select
                {...field}
                value={field.value ?? undefined}
                options={[{ label: 'No linked account', value: '' }, ...accountOptions]}
                size="large"
              />
            )}
          />
          <Text type="secondary">Select the account this debit card is linked to</Text>
        </Form.Item>
      )}

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

function EditCardForm({ onSubmit, isSubmitting, apiErrorMessage, submitLabel, initialValues, cardCategory }: EditProps) {
  const { data: accounts } = useAccounts()

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<EditCardFormValues>({
    resolver: zodResolver(editCardSchema),
    defaultValues: initialValues,
  })

  const selectedColor = watch('color')
  const accountOptions = (accounts ?? []).map((a) => ({ label: a.name, value: a.id }))

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className={styles.form}>
      <Form.Item label="Card Name" validateStatus={errors.name ? 'error' : ''} help={errors.name?.message}>
        <Controller name="name" control={control}
          render={({ field }) => <Input {...field} size="large" />}
        />
      </Form.Item>

      <Form.Item label="Card Type" validateStatus={errors.cardType ? 'error' : ''} help={errors.cardType?.message}>
        <Controller name="cardType" control={control}
          render={({ field }) => <Select {...field} options={cardTypeOptions} size="large" />}
        />
      </Form.Item>

      <Row gutter={12}>
        <Col span={12}>
          <Form.Item label="Last 4 Digits" validateStatus={errors.last4Digits ? 'error' : ''} help={errors.last4Digits?.message}>
            <Controller name="last4Digits" control={control}
              render={({ field }) => <Input {...field} maxLength={4} size="large" />}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Expiry Date" validateStatus={errors.expiryDate ? 'error' : ''} help={errors.expiryDate?.message}>
            <Controller name="expiryDate" control={control}
              render={({ field }) => <Input {...field} placeholder="MM/YY" maxLength={5} size="large" />}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label="Currency" validateStatus={errors.currency ? 'error' : ''} help={errors.currency?.message}>
        <Controller name="currency" control={control}
          render={({ field }) => <Select {...field} options={currencyOptions} size="large" />}
        />
      </Form.Item>

      <ColorSwatchField
        colors={CARD_COLORS}
        selected={selectedColor}
        onSelect={(c) => setValue('color', c)}
      />

      {cardCategory === CardCategory.Credit && (
        <Form.Item label="Credit Limit" validateStatus={errors.creditLimit ? 'error' : ''} help={errors.creditLimit?.message}>
          <Controller name="creditLimit" control={control}
            render={({ field }) => (
              <InputNumber {...field} value={field.value ?? undefined} prefix="$" min={0} step={0.01} size="large" className={styles.inputFull} />
            )}
          />
        </Form.Item>
      )}

      {cardCategory === CardCategory.Debit && (
        <Form.Item label="Linked Account">
          <Controller name="linkedAccountId" control={control}
            render={({ field }) => (
              <Select
                {...field}
                value={field.value ?? undefined}
                options={[{ label: 'No linked account', value: '' }, ...accountOptions]}
                size="large"
              />
            )}
          />
        </Form.Item>
      )}

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

export default CardForm
