import { useAccounts } from '../../accounts/hooks/useAccounts'
import { useCards } from '../../cards/hooks/useCards'
import type { TransactionType, TransactionsQueryParams } from '../types/TransactionTypes'
import styles from './TransactionFiltersBar.module.css'

interface TransactionFiltersBarProps {
  filters: TransactionsQueryParams
  onFiltersChange: (filters: TransactionsQueryParams) => void
}

function TransactionFiltersBar({ filters, onFiltersChange }: TransactionFiltersBarProps) {
  const { data: accounts } = useAccounts()
  const { data: cards } = useCards()

  const handleChange = (key: keyof TransactionsQueryParams, value: string): void => {
    onFiltersChange({ ...filters, [key]: value || undefined, page: 1 })
  }

  const handleClear = (): void => {
    onFiltersChange({ page: 1, pageSize: filters.pageSize })
  }

  return (
    <div className={styles.bar}>
      <div className={styles.field}>
        <label className={styles.label}>Account</label>
        <select
          className={styles.input}
          value={filters.accountId ?? ''}
          onChange={(e) => handleChange('accountId', e.target.value)}
        >
          <option value="">All accounts</option>
          {(accounts ?? []).map((a) => (
            <option value={a.id} key={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Card</label>
        <select
          className={styles.input}
          value={filters.cardId ?? ''}
          onChange={(e) => handleChange('cardId', e.target.value)}
        >
          <option value="">All cards</option>
          {(cards ?? []).map((c) => (
            <option value={c.id} key={c.id}>
              {c.name} (**** {c.last4Digits})
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Type</label>
        <select
          className={styles.input}
          value={filters.type ?? ''}
          onChange={(e) => handleChange('type', e.target.value as TransactionType)}
        >
          <option value="">All types</option>
          <option value="Expense">Expense</option>
          <option value="Income">Income</option>
          <option value="Installment">Installment</option>
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>From</label>
        <input
          type="date"
          className={styles.input}
          value={filters.startDate ?? ''}
          onChange={(e) => handleChange('startDate', e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>To</label>
        <input
          type="date"
          className={styles.input}
          value={filters.endDate ?? ''}
          onChange={(e) => handleChange('endDate', e.target.value)}
        />
      </div>

      <button type="button" className={styles.clearButton} onClick={handleClear}>
        Clear filters
      </button>
    </div>
  )
}

export default TransactionFiltersBar
