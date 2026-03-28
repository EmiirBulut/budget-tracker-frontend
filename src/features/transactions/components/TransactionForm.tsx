import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAccounts } from '../../accounts/hooks/useAccounts'
import { useCards } from '../../cards/hooks/useCards'
import type { CreateTransactionRequest, TransactionType } from '../types/TransactionTypes'
import styles from './TransactionForm.module.css'

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

const transactionTypeOptions: TransactionType[] = ['Expense', 'Income', 'Installment']

function TransactionForm({ onSubmit, isSubmitting, apiErrorMessage, submitLabel }: TransactionFormProps) {
  const { data: accounts } = useAccounts()
  const { data: cards } = useCards()

  const today = new Date().toISOString().split('T')[0]

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TransactionFormValues>({
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

  return (
    <form className={styles.form} onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <div className={styles.field}>
        <label htmlFor="type" className={styles.label}>
          Type
        </label>
        <select id="type" className={styles.input} {...register('type')}>
          {transactionTypeOptions.map((t) => (
            <option value={t} key={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="amount" className={styles.label}>
          Amount
        </label>
        <input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          className={`${styles.input} ${errors.amount ? styles.hasError : ''}`}
          {...register('amount')}
        />
        {errors.amount && <span className={styles.errorText}>{errors.amount.message}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="category" className={styles.label}>
          Category
        </label>
        <input
          id="category"
          placeholder="e.g. Food, Rent, Salary"
          className={`${styles.input} ${errors.category ? styles.hasError : ''}`}
          {...register('category')}
        />
        {errors.category && <span className={styles.errorText}>{errors.category.message}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="description" className={styles.label}>
          Description
        </label>
        <input
          id="description"
          placeholder="Optional note"
          className={`${styles.input} ${errors.description ? styles.hasError : ''}`}
          {...register('description')}
        />
        {errors.description && <span className={styles.errorText}>{errors.description.message}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="date" className={styles.label}>
          Date
        </label>
        <input
          id="date"
          type="date"
          className={`${styles.input} ${errors.date ? styles.hasError : ''}`}
          {...register('date')}
        />
        {errors.date && <span className={styles.errorText}>{errors.date.message}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="accountId" className={styles.label}>
          Account <span style={{ fontWeight: 400, color: 'var(--color-text-secondary)' }}>(optional)</span>
        </label>
        <select id="accountId" className={styles.input} {...register('accountId')}>
          <option value="">None</option>
          {(accounts ?? []).map((a) => (
            <option value={a.id} key={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="cardId" className={styles.label}>
          Card <span style={{ fontWeight: 400, color: 'var(--color-text-secondary)' }}>(optional)</span>
        </label>
        <select id="cardId" className={styles.input} {...register('cardId')}>
          <option value="">None</option>
          {(cards ?? []).map((c) => (
            <option value={c.id} key={c.id}>
              {c.name} (**** {c.last4Digits})
            </option>
          ))}
        </select>
      </div>

      {apiErrorMessage && <p className={styles.apiError}>{apiErrorMessage}</p>}

      <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : submitLabel}
      </button>
    </form>
  )
}

export default TransactionForm
