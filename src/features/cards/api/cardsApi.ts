import axiosInstance from '../../../services/axiosInstance'
import type { Card, CreateCardRequest, UpdateCardRequest } from '../types/CardTypes'

export async function getCards(): Promise<Card[]> {
  const response = await axiosInstance.get<Card[]>('/api/cards')
  return response.data
}

export async function getCardById(id: string): Promise<Card> {
  const response = await axiosInstance.get<Card>(`/api/cards/${id}`)
  return response.data
}

export async function createCard(data: CreateCardRequest): Promise<Card> {
  const response = await axiosInstance.post<Card>('/api/cards', data)
  return response.data
}

export async function updateCard(id: string, data: UpdateCardRequest): Promise<Card> {
  const response = await axiosInstance.put<Card>(`/api/cards/${id}`, data)
  return response.data
}

export async function archiveCard(id: string): Promise<void> {
  await axiosInstance.patch(`/api/cards/${id}/archive`)
}
