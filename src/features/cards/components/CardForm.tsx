import { CreditCardOutlined, EllipsisOutlined, SearchOutlined, WalletOutlined } from '@ant-design/icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Card, Col, Flex, Form, Input, InputNumber, Pagination, Row, Select, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { useAccounts } from '../../accounts/hooks/useAccounts'
import { ACCOUNT_TYPE_ICONS, CURRENCY_LABELS, type Account } from '../../accounts/types/AccountTypes'
import { formatBalance } from '../../../lib/formatCurrency'
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

// ── Schemas ───────────────────────────────────────────────────────────────────

const baseCardSchema = {
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  cardType: z.nativeEnum(CardType),
  last4Digits: z.string().length(4, 'Must be exactly 4 digits').regex(/^\d{4}$/, 'Must be 4 digits'),
  expiryDate: z
    .string()
    .regex(/^\d{2}\/\d{2}$/, 'Format must be MM/YY')
    .refine((val) => {
      const month = parseInt(val.split('/')[0], 10)
      return month >= 1 && month <= 12
    }, 'Month must be 01–12'),
  currency: z.nativeEnum(Currency),
  color: z.string().min(1, 'Select a color'),
  creditLimit: z.coerce.number().positive('Must be positive').nullable().optional(),
  linkedAccountId: z.string().nullable().optional(),
}

const createCardSchema = z
  .object({ ...baseCardSchema, cardCategory: z.nativeEnum(CardCategory) })
  .superRefine((data, ctx) => {
    if (data.cardCategory === CardCategory.Debit && !data.linkedAccountId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Linked account is required for debit cards',
        path: ['linkedAccountId'],
      })
    }
  })
const editCardSchema = z.object(baseCardSchema)

type CreateCardFormValues = z.infer<typeof createCardSchema>
type EditCardFormValues = z.infer<typeof editCardSchema>

// ── Props ─────────────────────────────────────────────────────────────────────

interface BaseProps {
  isSubmitting: boolean
  apiErrorMessage?: string
  submitLabel: string
  onCancel?: () => void
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

const currencyOptions = Object.values(Currency).map((c) => ({ label: CURRENCY_LABELS[c], value: c }))

// ── Sub-components ────────────────────────────────────────────────────────────

interface CategorySelectorProps {
  value: CardCategory
  onChange: (v: CardCategory) => void
}

function CategorySelector({ value, onChange }: CategorySelectorProps) {
  const { t } = useTranslation()
  const options = [
    {
      category: CardCategory.Credit,
      icon: <CreditCardOutlined />,
      title: t('cards.creditCard'),
      desc: t('cards.creditCardDesc'),
    },
    {
      category: CardCategory.Debit,
      icon: <WalletOutlined />,
      title: t('cards.debitCard'),
      desc: t('cards.debitCardDesc'),
    },
  ]

  return (
    <Row gutter={12}>
      {options.map(({ category, icon, title, desc }) => {
        const isSelected = value === category
        return (
          <Col span={12} key={category}>
            <Card
              hoverable
              className={isSelected ? styles.catCardSelected : styles.catCard}
              onClick={() => onChange(category)}
            >
              <Flex vertical align="center" gap={8}>
                <Flex
                  justify="center"
                  align="center"
                  className={isSelected ? styles.catIconCircleActive : styles.catIconCircle}
                >
                  <Text className={isSelected ? styles.catIconActive : styles.catIcon}>{icon}</Text>
                </Flex>
                <Text className={isSelected ? styles.catTitleActive : styles.catTitle}>{title}</Text>
                <Text type="secondary" className={styles.catDesc}>{desc}</Text>
              </Flex>
            </Card>
          </Col>
        )
      })}
    </Row>
  )
}

interface CardTypeSelectorProps {
  value: CardType
  onChange: (v: CardType) => void
}

function CardTypeSelector({ value, onChange }: CardTypeSelectorProps) {
  return (
    <Row gutter={[8, 8]}>
      {Object.values(CardType).map((type) => (
        <Col span={6} key={type}>
          <Card
            hoverable
            className={value === type ? styles.typeCardSelected : styles.typeCard}
            onClick={() => onChange(type)}
          >
            <Flex vertical align="center" gap={4}>
              <CreditCardOutlined className={styles.typeCardIcon} />
              <Text className={styles.typeCardLabel}>{CARD_TYPE_LABELS[type]}</Text>
            </Flex>
          </Card>
        </Col>
      ))}
    </Row>
  )
}

interface LinkedAccountSelectorProps {
  value: string | null | undefined
  onChange: (v: string) => void
  accounts: Account[]
}

const ACCOUNTS_PAGE_SIZE = 5

function LinkedAccountSelector({ value, onChange, accounts }: LinkedAccountSelectorProps) {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const filtered = accounts.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  )
  const paginated = filtered.slice((page - 1) * ACCOUNTS_PAGE_SIZE, page * ACCOUNTS_PAGE_SIZE)

  const handleSearch = (val: string): void => {
    setSearch(val)
    setPage(1)
  }

  return (
    <Flex vertical gap={8}>
      <Input
        placeholder={t('cards.searchAccounts')}
        prefix={<SearchOutlined />}
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        allowClear
      />
      <Flex vertical gap={8}>
        {paginated.map((account) => (
          <Card
            key={account.id}
            hoverable
            className={value === account.id ? styles.accountCardSelected : styles.accountCard}
            onClick={() => onChange(account.id)}
          >
            <Flex align="center" gap={12}>
              <Text className={styles.accountIcon}>{ACCOUNT_TYPE_ICONS[account.type]}</Text>
              <Flex vertical gap={2}>
                <Text strong>{account.name}</Text>
                <Text type="secondary">{formatBalance(account.balance, account.currency)}</Text>
              </Flex>
            </Flex>
          </Card>
        ))}
        {paginated.length === 0 && (
          <Text type="secondary" className={styles.noAccountsText}>{t('cards.noAccountsFound')}</Text>
        )}
      </Flex>
      {filtered.length > ACCOUNTS_PAGE_SIZE && (
        <Pagination
          current={page}
          total={filtered.length}
          pageSize={ACCOUNTS_PAGE_SIZE}
          onChange={setPage}
          size="small"
          showSizeChanger={false}
        />
      )}
    </Flex>
  )
}

interface ColorSwatchFieldProps {
  colors: string[]
  selected: string
  onSelect: (c: string) => void
  error?: string
}

function ColorSwatchField({ colors, selected, onSelect, error }: ColorSwatchFieldProps) {
  const { t } = useTranslation()
  return (
    <Form.Item label={t('cards.cardColor')} validateStatus={error ? 'error' : ''} help={error}>
      <Flex gap={8} wrap>
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
      </Flex>
    </Form.Item>
  )
}

// ── Main form dispatcher ──────────────────────────────────────────────────────

function CardForm(props: CardFormProps) {
  if (props.mode === 'create') return <CreateCardForm {...props} />
  return <EditCardForm {...props} />
}

// ── Create form ───────────────────────────────────────────────────────────────

function CreateCardForm({ onSubmit, isSubmitting, apiErrorMessage, submitLabel, initialValues, onCancel }: CreateProps) {
  const { t } = useTranslation()
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

  const activeAccounts = (accounts ?? []).filter((a) => !a.isArchived)

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className={styles.form}>

      {/* Card Category */}
      <Form.Item label={t('cards.category')} validateStatus={errors.cardCategory ? 'error' : ''} help={errors.cardCategory?.message}>
        <Controller
          name="cardCategory"
          control={control}
          render={({ field }) => (
            <CategorySelector value={field.value} onChange={field.onChange} />
          )}
        />
      </Form.Item>

      {/* Linked Account — Debit only, above Card Name */}
      {selectedCategory === CardCategory.Debit && (
        <Form.Item
          label={
            <Flex gap={4} align="center">
              <Text>{t('cards.linkedAccount')}</Text>
              <Text className={styles.required}>*</Text>
            </Flex>
          }
          validateStatus={errors.linkedAccountId ? 'error' : ''}
          help={errors.linkedAccountId?.message}
        >
          <Text type="secondary" className={styles.linkedAccountHint}>
            {t('cards.linkedAccountHint')}
          </Text>
          <Controller
            name="linkedAccountId"
            control={control}
            render={({ field }) => (
              <LinkedAccountSelector
                value={field.value}
                onChange={field.onChange}
                accounts={activeAccounts}
              />
            )}
          />
        </Form.Item>
      )}

      {/* Card Name */}
      <Form.Item label={t('cards.cardName')} validateStatus={errors.name ? 'error' : ''} help={errors.name?.message}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder={selectedCategory === CardCategory.Credit ? t('cards.creditCardPlaceholder') : t('cards.debitCardPlaceholder')}
              size="large"
              suffix={<EllipsisOutlined className={styles.inputSuffix} />}
            />
          )}
        />
      </Form.Item>

      {/* Card Type */}
      <Form.Item label={t('cards.cardType')} validateStatus={errors.cardType ? 'error' : ''} help={errors.cardType?.message}>
        <Controller
          name="cardType"
          control={control}
          render={({ field }) => (
            <CardTypeSelector value={field.value} onChange={field.onChange} />
          )}
        />
      </Form.Item>

      {/* Last 4 Digits */}
      <Form.Item label={t('cards.last4')} validateStatus={errors.last4Digits ? 'error' : ''} help={errors.last4Digits?.message}>
        <Controller
          name="last4Digits"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              maxLength={4}
              placeholder="4532"
              size="large"
              onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
            />
          )}
        />
      </Form.Item>

      {/* Expiry Date + Currency side by side */}
      <Row gutter={12}>
        <Col xs={24} sm={12}>
          <Form.Item label={t('cards.expiry')} validateStatus={errors.expiryDate ? 'error' : ''} help={errors.expiryDate?.message}>
            <Controller
              name="expiryDate"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="MM/YY"
                  maxLength={5}
                  size="large"
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 4)
                    const formatted = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
                    field.onChange(formatted)
                  }}
                />
              )}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item label={t('cards.currency')} validateStatus={errors.currency ? 'error' : ''} help={errors.currency?.message}>
            <Controller
              name="currency"
              control={control}
              render={({ field }) => <Select {...field} options={currencyOptions} size="large" />}
            />
          </Form.Item>
        </Col>
      </Row>

      {/* Credit Limit — Credit only */}
      {selectedCategory === CardCategory.Credit && (
        <Form.Item label={t('cards.creditLimit')} validateStatus={errors.creditLimit ? 'error' : ''} help={errors.creditLimit?.message}>
          <Controller
            name="creditLimit"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                value={field.value ?? undefined}
                min={0}
                step={0.01}
                placeholder="10000"
                size="large"
                className={styles.inputFull}
              />
            )}
          />
        </Form.Item>
      )}

      {/* Card Color */}
      <ColorSwatchField
        colors={CARD_COLORS}
        selected={selectedColor}
        onSelect={(c) => setValue('color', c)}
        error={errors.color?.message}
      />

      {apiErrorMessage && (
        <Form.Item>
          <Alert message={apiErrorMessage} type="error" showIcon />
        </Form.Item>
      )}

      {/* Cancel + Submit */}
      <Row gutter={12}>
        <Col span={12}>
          <Button block size="large" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
        </Col>
        <Col span={12}>
          <Button type="primary" htmlType="submit" block size="large" loading={isSubmitting}>
            {isSubmitting ? t('common.saving') : submitLabel}
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

// ── Edit form ─────────────────────────────────────────────────────────────────

function EditCardForm({ onSubmit, isSubmitting, apiErrorMessage, submitLabel, initialValues, cardCategory, onCancel }: EditProps) {
  const { t } = useTranslation()
  const { data: accounts } = useAccounts()

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<EditCardFormValues>({
    resolver: zodResolver(editCardSchema),
    defaultValues: initialValues,
  })

  const selectedColor = watch('color')
  const activeAccounts = (accounts ?? []).filter((a) => !a.isArchived)

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className={styles.form}>

      <Form.Item label={t('cards.cardName')} validateStatus={errors.name ? 'error' : ''} help={errors.name?.message}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              size="large"
              suffix={<EllipsisOutlined className={styles.inputSuffix} />}
            />
          )}
        />
      </Form.Item>

      <Form.Item label={t('cards.cardType')} validateStatus={errors.cardType ? 'error' : ''} help={errors.cardType?.message}>
        <Controller
          name="cardType"
          control={control}
          render={({ field }) => (
            <CardTypeSelector value={field.value} onChange={field.onChange} />
          )}
        />
      </Form.Item>

      <Form.Item label={t('cards.last4')} validateStatus={errors.last4Digits ? 'error' : ''} help={errors.last4Digits?.message}>
        <Controller
          name="last4Digits"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              maxLength={4}
              size="large"
              onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
            />
          )}
        />
      </Form.Item>

      <Row gutter={12}>
        <Col xs={24} sm={12}>
          <Form.Item label={t('cards.expiry')} validateStatus={errors.expiryDate ? 'error' : ''} help={errors.expiryDate?.message}>
            <Controller
              name="expiryDate"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="MM/YY"
                  maxLength={5}
                  size="large"
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 4)
                    const formatted = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
                    field.onChange(formatted)
                  }}
                />
              )}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item label={t('cards.currency')} validateStatus={errors.currency ? 'error' : ''} help={errors.currency?.message}>
            <Controller
              name="currency"
              control={control}
              render={({ field }) => <Select {...field} options={currencyOptions} size="large" />}
            />
          </Form.Item>
        </Col>
      </Row>

      {cardCategory === CardCategory.Credit && (
        <Form.Item label={t('cards.creditLimit')} validateStatus={errors.creditLimit ? 'error' : ''} help={errors.creditLimit?.message}>
          <Controller
            name="creditLimit"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                value={field.value ?? undefined}
                min={0}
                step={0.01}
                size="large"
                className={styles.inputFull}
              />
            )}
          />
        </Form.Item>
      )}

      {cardCategory === CardCategory.Debit && (
        <Form.Item label={t('cards.linkedAccount')}>
          <Controller
            name="linkedAccountId"
            control={control}
            render={({ field }) => (
              <LinkedAccountSelector
                value={field.value}
                onChange={field.onChange}
                accounts={activeAccounts}
              />
            )}
          />
        </Form.Item>
      )}

      <ColorSwatchField
        colors={CARD_COLORS}
        selected={selectedColor}
        onSelect={(c) => setValue('color', c)}
        error={errors.color?.message}
      />

      {apiErrorMessage && (
        <Form.Item>
          <Alert message={apiErrorMessage} type="error" showIcon />
        </Form.Item>
      )}

      <Row gutter={12}>
        <Col span={12}>
          <Button block size="large" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
        </Col>
        <Col span={12}>
          <Button type="primary" htmlType="submit" block size="large" loading={isSubmitting}>
            {isSubmitting ? t('common.saving') : submitLabel}
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

export default CardForm
