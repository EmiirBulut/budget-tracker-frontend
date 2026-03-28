import { Button, Card, Col, DatePicker, Row, Select, Space } from 'antd'
import dayjs from 'dayjs'
import { useAccounts } from '../../accounts/hooks/useAccounts'
import { useCards } from '../../cards/hooks/useCards'
import type { TransactionType, TransactionsQueryParams } from '../types/TransactionTypes'

const { RangePicker } = DatePicker

interface TransactionFiltersBarProps {
  filters: TransactionsQueryParams
  onFiltersChange: (filters: TransactionsQueryParams) => void
}

const typeOptions = [
  { label: 'All types', value: '' },
  { label: 'Expense', value: 'Expense' },
  { label: 'Income', value: 'Income' },
  { label: 'Installment', value: 'Installment' },
]

function TransactionFiltersBar({ filters, onFiltersChange }: TransactionFiltersBarProps) {
  const { data: accounts } = useAccounts()
  const { data: cards } = useCards()

  const accountOptions = [
    { label: 'All accounts', value: '' },
    ...(accounts ?? []).map((a) => ({ label: a.name, value: a.id })),
  ]

  const cardOptions = [
    { label: 'All cards', value: '' },
    ...(cards ?? []).map((c) => ({ label: `${c.name} (**** ${c.last4Digits})`, value: c.id })),
  ]

  const handleChange = (key: keyof TransactionsQueryParams, value: string): void => {
    onFiltersChange({ ...filters, [key]: value || undefined, page: 1 })
  }

  const handleDateRange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null): void => {
    if (!dates || !dates[0] || !dates[1]) {
      const { startDate: _s, endDate: _e, ...rest } = filters
      onFiltersChange({ ...rest, page: 1 })
      return
    }
    onFiltersChange({
      ...filters,
      startDate: dates[0].toISOString().split('T')[0],
      endDate: dates[1].toISOString().split('T')[0],
      page: 1,
    })
  }

  const handleClear = (): void => {
    onFiltersChange({ page: 1, pageSize: filters.pageSize })
  }

  const dateRangeValue: [dayjs.Dayjs, dayjs.Dayjs] | null =
    filters.startDate && filters.endDate
      ? [dayjs(filters.startDate), dayjs(filters.endDate)]
      : null

  return (
    <Card size="small">
      <Row gutter={[12, 12]} align="middle">
        <Col xs={24} sm={12} md={6}>
          <Select
            options={accountOptions}
            value={filters.accountId ?? ''}
            onChange={(v) => handleChange('accountId', v)}
            placeholder="All accounts"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Select
            options={cardOptions}
            value={filters.cardId ?? ''}
            onChange={(v) => handleChange('cardId', v)}
            placeholder="All cards"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Select
            options={typeOptions}
            value={filters.type ?? ''}
            onChange={(v) => handleChange('type', v as TransactionType)}
            placeholder="All types"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Space>
            <RangePicker
              value={dateRangeValue}
              onChange={handleDateRange}
              size="middle"
            />
            <Button onClick={handleClear}>Clear</Button>
          </Space>
        </Col>
      </Row>
    </Card>
  )
}

export default TransactionFiltersBar
