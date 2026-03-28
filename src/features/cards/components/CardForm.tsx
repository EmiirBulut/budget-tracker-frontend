import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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

const createCardSchema = z
  .object({
    ...baseCardSchema,
    cardCategory: z.nativeEnum(CardCategory),
  })
  .refine(
    (data) => {
      if (data.cardCategory === CardCategory.Credit) return true
      return true
    },
    { message: '' },
  )

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

function CardForm(props: CardFormProps) {
  if (props.mode === 'create') {
    return <CreateCardForm {...props} />
  }
  return <EditCardForm {...props} />
}

const cardTypeOptions = Object.values(CardType)
const currencyOptions = Object.values(Currency)

function CreateCardForm({ onSubmit, isSubmitting, apiErrorMessage, submitLabel, initialValues }: CreateProps) {
  const { data: accounts } = useAccounts()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateCardFormValues>({
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
        <label htmlFor="cardCategory" className={styles.label}>
          Card category
        </label>
        <select id="cardCategory" className={styles.input} {...register('cardCategory')}>
          <option value={CardCategory.Credit}>Credit</option>
          <option value={CardCategory.Debit}>Debit</option>
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="cardType" className={styles.label}>
          Card type
        </label>
        <select id="cardType" className={styles.input} {...register('cardType')}>
          {cardTypeOptions.map((t) => (
            <option value={t} key={t}>
              {CARD_TYPE_LABELS[t]}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="last4Digits" className={styles.label}>
          Last 4 digits
        </label>
        <input
          id="last4Digits"
          maxLength={4}
          placeholder="1234"
          className={`${styles.input} ${errors.last4Digits ? styles.hasError : ''}`}
          {...register('last4Digits')}
        />
        {errors.last4Digits && <span className={styles.errorText}>{errors.last4Digits.message}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="expiryDate" className={styles.label}>
          Expiry date
        </label>
        <input
          id="expiryDate"
          placeholder="MM/YY"
          maxLength={5}
          className={`${styles.input} ${errors.expiryDate ? styles.hasError : ''}`}
          {...register('expiryDate')}
        />
        {errors.expiryDate && <span className={styles.errorText}>{errors.expiryDate.message}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="currency" className={styles.label}>
          Currency
        </label>
        <select id="currency" className={styles.input} {...register('currency')}>
          {currencyOptions.map((c) => (
            <option value={c} key={c}>
              {CURRENCY_LABELS[c]}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <span className={styles.label}>Color</span>
        <div className={styles.colorGrid}>
          {CARD_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              className={`${styles.colorSwatch} ${selectedColor === color ? styles.selected : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => setValue('color', color)}
              aria-label={color}
            />
          ))}
        </div>
        {errors.color && <span className={styles.errorText}>{errors.color.message}</span>}
      </div>

      {selectedCategory === CardCategory.Credit && (
        <div className={styles.field}>
          <label htmlFor="creditLimit" className={styles.label}>
            Credit limit
          </label>
          <input
            id="creditLimit"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            className={`${styles.input} ${errors.creditLimit ? styles.hasError : ''}`}
            {...register('creditLimit')}
          />
          {errors.creditLimit && <span className={styles.errorText}>{errors.creditLimit.message}</span>}
        </div>
      )}

      {selectedCategory === CardCategory.Debit && (
        <div className={styles.field}>
          <label htmlFor="linkedAccountId" className={styles.label}>
            Linked account
          </label>
          <select id="linkedAccountId" className={styles.input} {...register('linkedAccountId')}>
            <option value="">No linked account</option>
            {(accounts ?? []).map((a) => (
              <option value={a.id} key={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {apiErrorMessage && <p className={styles.apiError}>{apiErrorMessage}</p>}

      <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : submitLabel}
      </button>
    </form>
  )
}

function EditCardForm({ onSubmit, isSubmitting, apiErrorMessage, submitLabel, initialValues, cardCategory }: EditProps) {
  const { data: accounts } = useAccounts()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EditCardFormValues>({
    resolver: zodResolver(editCardSchema),
    defaultValues: initialValues,
  })

  const selectedColor = watch('color')

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
        <label htmlFor="cardType" className={styles.label}>
          Card type
        </label>
        <select id="cardType" className={styles.input} {...register('cardType')}>
          {cardTypeOptions.map((t) => (
            <option value={t} key={t}>
              {CARD_TYPE_LABELS[t]}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="last4Digits" className={styles.label}>
          Last 4 digits
        </label>
        <input
          id="last4Digits"
          maxLength={4}
          className={`${styles.input} ${errors.last4Digits ? styles.hasError : ''}`}
          {...register('last4Digits')}
        />
        {errors.last4Digits && <span className={styles.errorText}>{errors.last4Digits.message}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="expiryDate" className={styles.label}>
          Expiry date
        </label>
        <input
          id="expiryDate"
          placeholder="MM/YY"
          maxLength={5}
          className={`${styles.input} ${errors.expiryDate ? styles.hasError : ''}`}
          {...register('expiryDate')}
        />
        {errors.expiryDate && <span className={styles.errorText}>{errors.expiryDate.message}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="currency" className={styles.label}>
          Currency
        </label>
        <select id="currency" className={styles.input} {...register('currency')}>
          {currencyOptions.map((c) => (
            <option value={c} key={c}>
              {CURRENCY_LABELS[c]}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <span className={styles.label}>Color</span>
        <div className={styles.colorGrid}>
          {CARD_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              className={`${styles.colorSwatch} ${selectedColor === color ? styles.selected : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => setValue('color', color)}
              aria-label={color}
            />
          ))}
        </div>
      </div>

      {cardCategory === CardCategory.Credit && (
        <div className={styles.field}>
          <label htmlFor="creditLimit" className={styles.label}>
            Credit limit
          </label>
          <input
            id="creditLimit"
            type="number"
            step="0.01"
            min="0"
            className={`${styles.input} ${errors.creditLimit ? styles.hasError : ''}`}
            {...register('creditLimit')}
          />
          {errors.creditLimit && <span className={styles.errorText}>{errors.creditLimit.message}</span>}
        </div>
      )}

      {cardCategory === CardCategory.Debit && (
        <div className={styles.field}>
          <label htmlFor="linkedAccountId" className={styles.label}>
            Linked account
          </label>
          <select id="linkedAccountId" className={styles.input} {...register('linkedAccountId')}>
            <option value="">No linked account</option>
            {(accounts ?? []).map((a) => (
              <option value={a.id} key={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {apiErrorMessage && <p className={styles.apiError}>{apiErrorMessage}</p>}

      <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : submitLabel}
      </button>
    </form>
  )
}

export default CardForm
