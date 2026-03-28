import axiosInstance from '../../../services/axiosInstance'
import type { Account, CreateAccountRequest, UpdateAccountRequest } from '../types/AccountTypes'

export async function getAccounts(): Promise<Account[]> {
  const response = await axiosInstance.get<Account[]>('/api/accounts')
  return response.data
}

export async function getAccountById(id: string): Promise<Account> {
  const response = await axiosInstance.get<Account>(`/api/accounts/${id}`)
  return response.data
}

export async function createAccount(data: CreateAccountRequest): Promise<Account> {
  const response = await axiosInstance.post<Account>('/api/accounts', data)
  return response.data
}

export async function updateAccount(id: string, data: UpdateAccountRequest): Promise<Account> {
  const response = await axiosInstance.put<Account>(`/api/accounts/${id}`, data)
  return response.data
}

export async function archiveAccount(id: string): Promise<void> {
  await axiosInstance.patch(`/api/accounts/${id}/archive`)
}
