import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { formatTotalBalance } from '../../../lib/formatCurrency'
import type { CategoryBreakdown } from '../types/ReportTypes'

const COLORS = ['#2563eb', '#7c3aed', '#059669', '#ea580c', '#dc2626', '#0891b2', '#d97706', '#6d28d9']

interface CategoryPieChartProps {
  data: CategoryBreakdown[]
}

function CategoryPieChart({ data }: CategoryPieChartProps) {
  const chartData = data.map((item) => ({ name: item.category, value: item.total }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
          {chartData.map((entry, index) => (
            <Cell key={`slice-${entry.name}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => {
            const num = typeof value === 'number' ? value : Number(value ?? 0)
            return formatTotalBalance(Number.isFinite(num) ? num : 0)
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

export default CategoryPieChart
