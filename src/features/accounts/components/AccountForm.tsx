import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AccountType, CURRENCY_LABELS, Currency, type CreateAccountRequest, type UpdateAccountRequest } from '../types/AccountTypes'
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

const accountTypeOptions = Object.values(AccountType)
const currencyOptions = Object.values(Currency)

function AccountForm(props: AccountFormProps) {
  if (props.mode === 'create') {
    return <CreateAccountForm {...props} />
  }

  return <EditAccountForm {...props} />
}

function CreateAccountForm({
  onSubmit,
  isSubmitting,
  apiErrorMessage,
  submitLabel,
  initialValues,
}: CreateProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAccountFormValues>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      type: initialValues?.type ?? AccountType.BankAccount,
      currency: initialValues?.currency ?? Currency.USD,
      initialBalance: initialValues?.initialBalance ?? 0,
    },
  })

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={styles.field}>
        <label htmlFor="name" className={styles.label}>
          Name
        </label>
        <input id="name" className={`${styles.input} ${errors.name ? styles.hasError : ''}`} {...register('name')} />
        {errors.name && <span className={styles.errorText}>{errors.name.message}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="type" className={styles.label}>
          Account type
        </label>
        <select id="type" className={`${styles.input} ${errors.type ? styles.hasError : ''}`} {...register('type')}>
          {accountTypeOptions.map((type) => (
            <option value={type} key={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.type && <span className={styles.errorText}>{errors.type.message}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="currency" className={styles.label}>
          Currency
        </label>
        <select id="currency" className={`${styles.input} ${errors.currency ? styles.hasError : ''}`} {...register('currency')}>
          {currencyOptions.map((currency) => (
            <option value={currency} key={currency}>
              {CURRENCY_LABELS[currency]}
            </option>
          ))}
        </select>
        {errors.currency && <span className={styles.errorText}>{errors.currency.message}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="initialBalance" className={styles.label}>
          Initial balance
        </label>
        <input
          id="initialBalance"
          type="number"
          step="0.01"
          className={`${styles.input} ${errors.initialBalance ? styles.hasError : ''}`}
          {...register('initialBalance')}
        />
        {errors.initialBalance && <span className={styles.errorText}>{errors.initialBalance.message}</span>}
      </div>

      {apiErrorMessage && <p className={styles.apiError}>{apiErrorMessage}</p>}

      <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : submitLabel}
      </button>
    </form>
  )
}

function EditAccountForm({ onSubmit, isSubmitting, apiErrorMessage, submitLabel, initialValues }: EditProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditAccountFormValues>({
    resolver: zodResolver(editAccountSchema),
    defaultValues: initialValues,
  })

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={styles.field}>
        <label htmlFor="name" className={styles.label}>
          Name
        </label>
        <input id="name" className={`${styles.input} ${errors.name ? styles.hasError : ''}`} {...register('name')} />
        {errors.name && <span className={styles.errorText}>{errors.name.message}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="type" className={styles.label}>
          Account type
        </label>
        <select id="type" className={`${styles.input} ${errors.type ? styles.hasError : ''}`} {...register('type')}>
          {accountTypeOptions.map((type) => (
            <option value={type} key={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.type && <span className={styles.errorText}>{errors.type.message}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="currency" className={styles.label}>
          Currency
        </label>
        <select id="currency" className={`${styles.input} ${errors.currency ? styles.hasError : ''}`} {...register('currency')}>
          {currencyOptions.map((currency) => (
            <option value={currency} key={currency}>
              {CURRENCY_LABELS[currency]}
            </option>
          ))}
        </select>
        {errors.currency && <span className={styles.errorText}>{errors.currency.message}</span>}
      </div>

      {apiErrorMessage && <p className={styles.apiError}>{apiErrorMessage}</p>}

      <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : submitLabel}
      </button>
    </form>
  )
}

export default AccountForm
