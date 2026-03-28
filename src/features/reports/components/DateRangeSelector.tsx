import styles from './DateRangeSelector.module.css'

interface DateRangeSelectorProps {
  from: string
  to: string
  onChange: (from: string, to: string) => void
}

function toDateString(d: Date): string {
  return d.toISOString().split('T')[0]
}

function DateRangeSelector({ from, to, onChange }: DateRangeSelectorProps) {
  const applyPreset = (preset: 'this-month' | 'last-3' | 'last-6' | 'this-year'): void => {
    const now = new Date()
    let start: Date
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    if (preset === 'this-month') {
      start = new Date(now.getFullYear(), now.getMonth(), 1)
    } else if (preset === 'last-3') {
      start = new Date(now.getFullYear(), now.getMonth() - 2, 1)
    } else if (preset === 'last-6') {
      start = new Date(now.getFullYear(), now.getMonth() - 5, 1)
    } else {
      start = new Date(now.getFullYear(), 0, 1)
      end.setFullYear(now.getFullYear(), 11, 31)
    }

    onChange(toDateString(start), toDateString(end))
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.field}>
        <label className={styles.label}>From</label>
        <input
          type="date"
          className={styles.input}
          value={from}
          onChange={(e) => onChange(e.target.value, to)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>To</label>
        <input
          type="date"
          className={styles.input}
          value={to}
          onChange={(e) => onChange(from, e.target.value)}
        />
      </div>

      <div className={styles.presets}>
        <button type="button" className={styles.preset} onClick={() => applyPreset('this-month')}>
          This month
        </button>
        <button type="button" className={styles.preset} onClick={() => applyPreset('last-3')}>
          Last 3 months
        </button>
        <button type="button" className={styles.preset} onClick={() => applyPreset('last-6')}>
          Last 6 months
        </button>
        <button type="button" className={styles.preset} onClick={() => applyPreset('this-year')}>
          This year
        </button>
      </div>
    </div>
  )
}

export default DateRangeSelector
