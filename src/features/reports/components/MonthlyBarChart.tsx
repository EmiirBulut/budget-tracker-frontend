import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatTotalBalance } from '../../../lib/formatCurrency'
import type { MonthlyBreakdown } from '../types/ReportTypes'

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

interface MonthlyBarChartProps {
  data: MonthlyBreakdown[]
}

function MonthlyBarChart({ data }: MonthlyBarChartProps) {
  const chartData = data.map((item) => ({
    label: `${MONTH_NAMES[item.month - 1]} ${item.year}`,
    Income: item.income,
    Expense: item.expense,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v as number).toLocaleString()}`} />
        <Tooltip formatter={(value) => formatTotalBalance(value as number)} />
        <Legend />
        <Bar dataKey="Income" fill="#16a34a" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Expense" fill="#dc2626" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default MonthlyBarChart
