export interface InstallmentPayment {
  id: string
  monthNumber: number
  dueDate: string
  paidDate: string | null
  isPaid: boolean
}

export interface InstallmentPlan {
  id: string
  cardId: string
  name: string
  category: string
  totalAmount: number
  monthlyPayment: number
  numberOfMonths: number
  startDate: string
  createdAt: string
  payments?: InstallmentPayment[]
}

export interface CreateInstallmentPlanRequest {
  cardId: string
  name: string
  category: string
  totalAmount: number
  monthlyPayment: number
  numberOfMonths: number
  startDate: string
}
