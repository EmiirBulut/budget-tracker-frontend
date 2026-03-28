import axiosInstance from '../../../services/axiosInstance'
import type { CreateInstallmentPlanRequest, InstallmentPlan } from '../types/InstallmentTypes'

export async function getInstallmentPlans(): Promise<InstallmentPlan[]> {
  const response = await axiosInstance.get<InstallmentPlan[]>('/api/installments')
  return response.data
}

export async function getInstallmentPlanById(id: string): Promise<InstallmentPlan> {
  const response = await axiosInstance.get<InstallmentPlan>(`/api/installments/${id}`)
  return response.data
}

export async function createInstallmentPlan(data: CreateInstallmentPlanRequest): Promise<InstallmentPlan> {
  const response = await axiosInstance.post<InstallmentPlan>('/api/installments', data)
  return response.data
}

export async function markPaymentPaid(planId: string, paymentId: string): Promise<void> {
  await axiosInstance.patch(`/api/installments/${planId}/payments/${paymentId}/pay`)
}
