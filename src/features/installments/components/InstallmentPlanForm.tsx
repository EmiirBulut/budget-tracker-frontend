import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
  const { data: cards } = useCards()
  const today = new Date().toISOString().split('T')[0]

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InstallmentPlanFormValues>({
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

  return (
    <form className={styles.form} onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <div className={styles.field}>
        <label htmlFor="cardId" className={styles.label}>
          Card
        </label>
        <select
          id="cardId"
          className={`${styles.input} ${errors.cardId ? styles.hasError : ''}`}
          {...register('cardId')}
        >
          <option value="">Select a card</option>
          {(cards ?? []).map((c) => (
            <option value={c.id} key={c.id}>
              {c.name} (**** {c.last4Digits})
            </option>
          ))}
        </select>
        {errors.cardId && <span className={styles.errorText}>{errors.cardId.message}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="name" className={styles.label}>
          Plan name
        </label>
        <input
          id="name"
          placeholder="e.g. Laptop purchase"
          className={`${styles.input} ${errors.name ? styles.hasError : ''}`}
          {...register('name')}
        />
        {errors.name && <span className={styles.errorText}>{errors.name.message}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="category" className={styles.label}>
          Category
        </label>
        <input
          id="category"
          placeholder="e.g. Electronics, Travel"
          className={`${styles.input} ${errors.category ? styles.hasError : ''}`}
          {...register('category')}
        />
        {errors.category && <span className={styles.errorText}>{errors.category.message}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="totalAmount" className={styles.label}>
          Total amount
        </label>
        <input
          id="totalAmount"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          className={`${styles.input} ${errors.totalAmount ? styles.hasError : ''}`}
          {...register('totalAmount')}
        />
        {errors.totalAmount && <span className={styles.errorText}>{errors.totalAmount.message}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="numberOfMonths" className={styles.label}>
          Number of months
        </label>
        <input
          id="numberOfMonths"
          type="number"
          min="1"
          max="360"
          className={`${styles.input} ${errors.numberOfMonths ? styles.hasError : ''}`}
          {...register('numberOfMonths')}
        />
        {errors.numberOfMonths && <span className={styles.errorText}>{errors.numberOfMonths.message}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="monthlyPayment" className={styles.label}>
          Monthly payment
        </label>
        <input
          id="monthlyPayment"
          type="number"
          step="0.01"
          min="0"
          placeholder="Auto-calculated"
          className={`${styles.input} ${errors.monthlyPayment ? styles.hasError : ''}`}
          {...register('monthlyPayment')}
        />
        <span className={styles.hint}>Auto-calculated from total ÷ months. You can override.</span>
        {errors.monthlyPayment && <span className={styles.errorText}>{errors.monthlyPayment.message}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="startDate" className={styles.label}>
          Start date
        </label>
        <input
          id="startDate"
          type="date"
          className={`${styles.input} ${errors.startDate ? styles.hasError : ''}`}
          {...register('startDate')}
        />
        {errors.startDate && <span className={styles.errorText}>{errors.startDate.message}</span>}
      </div>

      {apiErrorMessage && <p className={styles.apiError}>{apiErrorMessage}</p>}

      <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
        {isSubmitting ? 'Creating…' : submitLabel}
      </button>
    </form>
  )
}

export default InstallmentPlanForm
