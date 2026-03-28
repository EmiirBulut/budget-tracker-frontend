import { Button, Card, DatePicker, Space } from 'antd'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker

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

  const rangeValue: [dayjs.Dayjs, dayjs.Dayjs] | null =
    from && to ? [dayjs(from), dayjs(to)] : null

  const handleRangeChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null): void => {
    if (dates && dates[0] && dates[1]) {
      onChange(
        dates[0].toISOString().split('T')[0],
        dates[1].toISOString().split('T')[0],
      )
    }
  }

  return (
    <Card size="small">
      <Space wrap>
        <RangePicker value={rangeValue} onChange={handleRangeChange} />
        <Button size="small" onClick={() => applyPreset('this-month')}>This month</Button>
        <Button size="small" onClick={() => applyPreset('last-3')}>Last 3 months</Button>
        <Button size="small" onClick={() => applyPreset('last-6')}>Last 6 months</Button>
        <Button size="small" onClick={() => applyPreset('this-year')}>This year</Button>
      </Space>
    </Card>
  )
}

export default DateRangeSelector
