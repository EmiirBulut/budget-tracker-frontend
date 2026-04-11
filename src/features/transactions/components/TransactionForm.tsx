import { RetweetOutlined } from '@ant-design/icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Col, DatePicker, Flex, Form, InputNumber, Row, Select, Typography } from 'antd'
import dayjs from 'dayjs'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { useAccounts } from '../../accounts/hooks/useAccounts'
import { ACCOUNT_TYPE_ICONS, CURRENCY_SYMBOLS, Currency } from '../../accounts/types/AccountTypes'
import { usePreferences } from '../../settings/hooks/usePreferences'
import { formatBalance } from '../../../lib/formatCurrency'
import type { CreateTransactionRequest } from '../types/TransactionTypes'
import styles from './TransactionForm.module.css'

const { Text } = Typography

// ── Schema ────────────────────────────────────────────────────────────────────

const formSchema = z.object({
  type: z.enum(['Expense', 'Income'] as const),
  accountId: z.string().nullable().optional(),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  category: z.string().min(1, 'Please select a category'),
  date: z.string().min(1, 'Date is required'),
})

type FormValues = z.infer<typeof formSchema>

// ── Category definitions ──────────────────────────────────────────────────────

interface CategoryOption {
  label: string
  emoji: string
}

const EXPENSE_CATEGORIES: CategoryOption[] = [
  { label: 'Food', emoji: '🍔' },
  { label: 'Transportation', emoji: '🚗' },
  { label: 'Shopping', emoji: '🛍️' },
  { label: 'Entertainment', emoji: '🎬' },
  { label: 'Bills', emoji: '💡' },
  { label: 'Healthcare', emoji: '💊' },
  { label: 'Other', emoji: '📝' },
]

const INCOME_CATEGORIES: CategoryOption[] = [
  { label: 'Salary', emoji: '💼' },
  { label: 'Freelance', emoji: '💻' },
  { label: 'Investment', emoji: '📈' },
]

// Note: category label values must remain as English strings since they are stored in the backend.
// Display labels are translated separately in the UI.

// Type-specific accent colors
const TYPE_COLORS: Record<'Expense' | 'Income', string> = {
  Expense: '#f59e0b',
  Income: '#22c55e',
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface TransactionFormProps {
  isSubmitting: boolean
  apiErrorMessage?: string
  submitLabel: string
  onSubmit: (data: CreateTransactionRequest) => void
}

// ── TransactionForm ───────────────────────────────────────────────────────────

function TransactionForm({ onSubmit, isSubmitting, apiErrorMessage, submitLabel }: TransactionFormProps) {
  const { t } = useTranslation()
  const { data: accounts } = useAccounts()
  const { data: preferences } = usePreferences()

  const today = new Date().toISOString().split('T')[0]

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'Expense',
      accountId: null,
      amount: undefined,
      category: '',
      date: today,
    },
  })

  const selectedType = watch('type')
  const selectedAccountId = watch('accountId')

  const categories = selectedType === 'Income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
  const catColSpan = selectedType === 'Income' ? 8 : 6
  const accentColor = TYPE_COLORS[selectedType]

  const activeAccount = (accounts ?? []).find((a) => a.id === selectedAccountId)

  const activeCurrency = (activeAccount?.currency ?? preferences?.defaultCurrency ?? Currency.USD) as Currency
  const currencySymbol = CURRENCY_SYMBOLS[activeCurrency] ?? activeCurrency

  const handleTypeChange = (type: 'Expense' | 'Income'): void => {
    setValue('type', type)
    setValue('category', '')
  }

  const handleFormSubmit = (values: FormValues): void => {
    onSubmit({
      type: values.type,
      amount: values.amount,
      category: values.category,
      description: values.category,
      date: new Date(values.date).toISOString(),
      accountId: values.accountId ?? null,
      cardId: null,
    })
  }

  const accountOptions = (accounts ?? [])
    .filter((a) => !a.isArchived)
    .map((a) => ({ label: `${a.name} (${a.currency})`, value: a.id }))

  return (
    <Form layout="vertical" colon={false} onFinish={handleSubmit(handleFormSubmit)} className={styles.form}>

      {/* ── Transaction Type ── */}
      <Form.Item label={<Text className={styles.fieldLabel}>{t('transactions.type')}</Text>}>
        <div className={styles.typeSelector}>
          {(['Expense', 'Income'] as const).map((type) => {
            const isActive = selectedType === type
            return (
              <button
                key={type}
                type="button"
                onClick={() => handleTypeChange(type)}
                className={styles.typeOption}
                style={{
                  color: isActive ? '#1a1a1a' : TYPE_COLORS[type],
                  background: isActive ? '#fff' : 'transparent',
                  boxShadow: isActive ? '0 1px 6px rgba(0,0,0,0.12)' : 'none',
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {type}
              </button>
            )
          })}
        </div>
      </Form.Item>

      {/* ── Account ── */}
      <Form.Item label={<Text className={styles.fieldLabel}>{t('transactions.account')}</Text>}>
        <Controller
          name="accountId"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value ?? undefined}
              options={accountOptions}
              placeholder={t('transactions.selectAccount')}
              className={styles.accountSelect}
              allowClear
              onChange={(val) => field.onChange(val ?? null)}
            />
          )}
        />
        {activeAccount && (
          <div className={styles.accountDetail}>
            <Flex justify="space-between" align="center">
              <Flex align="center" gap={10}>
                <Text className={styles.accountDetailIcon}>
                  {ACCOUNT_TYPE_ICONS[activeAccount.type]}
                </Text>
                <Flex vertical gap={1}>
                  <Text strong className={styles.accountDetailName}>{activeAccount.name}</Text>
                  <Text type="secondary" className={styles.accountDetailType}>Account</Text>
                </Flex>
              </Flex>
              <Flex vertical align="flex-end" gap={1}>
                <Text strong className={styles.accountDetailBalance}>
                  {formatBalance(activeAccount.balance, activeAccount.currency)}
                </Text>
                <Text type="secondary" className={styles.accountDetailCurrency}>
                  {activeAccount.currency}
                </Text>
              </Flex>
            </Flex>
          </div>
        )}
      </Form.Item>

      {/* ── Amount ── */}
      <Form.Item
        label={<Text className={styles.fieldLabel}>{t('transactions.amount')}</Text>}
        validateStatus={errors.amount ? 'error' : ''}
        help={errors.amount?.message}
      >
        <Controller
          name="amount"
          control={control}
          render={({ field }) => (
            <InputNumber
              {...field}
              value={field.value ?? undefined}
              prefix={<Text type="secondary" className={styles.amountPrefix}>{currencySymbol}</Text>}
              min={0}
              step={0.01}
              placeholder="0.00"
              size="large"
              className={styles.amountInput}
            />
          )}
        />
      </Form.Item>

      {/* ── Category grid ── */}
      <Form.Item
        label={<Text className={styles.fieldLabel}>{t('transactions.category')}</Text>}
        validateStatus={errors.category ? 'error' : ''}
        help={errors.category?.message}
      >
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Row gutter={[8, 8]}>
              {categories.map(({ label, emoji }) => {
                const isSelected = field.value === label
                return (
                  <Col span={catColSpan} key={label}>
                    <button
                      type="button"
                      className={styles.catCard}
                      style={{
                        borderColor: isSelected ? '#2563eb' : '#e8e8e8',
                        background: isSelected ? '#eff6ff' : '#fff',
                      }}
                      onClick={() => field.onChange(label)}
                    >
                      <Text className={styles.catEmoji}>{emoji}</Text>
                      <Text
                        className={styles.catLabel}
                        style={{ color: accentColor }}
                      >
                        {label}
                      </Text>
                    </button>
                  </Col>
                )
              })}
            </Row>
          )}
        />
      </Form.Item>

      {/* ── Date ── */}
      <Form.Item
        label={<Text className={styles.fieldLabel}>{t('transactions.date')}</Text>}
        validateStatus={errors.date ? 'error' : ''}
        help={errors.date?.message}
      >
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <DatePicker
              value={field.value ? dayjs(field.value) : null}
              onChange={(d) => field.onChange(d ? d.format('YYYY-MM-DD') : '')}
              size="large"
              format="MM/DD/YYYY"
              className={styles.datePicker}
            />
          )}
        />
      </Form.Item>

      {/* ── Recurrence ── */}
      <Form.Item label={<Text className={styles.fieldLabel}>{t('transactions.recurrence')}</Text>}>
        <div className={styles.recurrenceField}>
          <RetweetOutlined className={styles.recurrenceIcon} />
          <Text>{t('transactions.oneTime')}</Text>
        </div>
      </Form.Item>

      {apiErrorMessage && (
        <Form.Item>
          <Alert message={apiErrorMessage} type="error" showIcon />
        </Form.Item>
      )}

      {/* ── Submit ── */}
      <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
        <Button
          type="primary"
          htmlType="submit"
          block
          size="large"
          loading={isSubmitting}
          className={styles.submitBtn}
        >
          {isSubmitting ? 'Saving…' : submitLabel}
        </Button>
      </Form.Item>
    </Form>
  )
}

export default TransactionForm
