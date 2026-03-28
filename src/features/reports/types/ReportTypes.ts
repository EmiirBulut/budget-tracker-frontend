export interface CategoryBreakdown {
  category: string
  total: number
}

export interface MonthlyBreakdown {
  year: number
  month: number
  income: number
  expense: number
}

export interface ReportSummary {
  totalIncome: number
  totalExpense: number
  netBalance: number
  byCategory: CategoryBreakdown[]
  byMonth: MonthlyBreakdown[]
}

export interface ReportParams {
  from: string
  to: string
}
