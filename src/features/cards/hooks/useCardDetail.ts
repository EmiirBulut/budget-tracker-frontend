import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { getCardById } from '../api/cardsApi'
import type { ApiErrorResponse } from '../../auth/types/AuthTypes'
import type { Card } from '../types/CardTypes'

export const cardDetailQueryKey = (id: string) => ['cards', id] as const

export function useCardDetail(id: string) {
  return useQuery<Card, AxiosError<ApiErrorResponse>>({
    queryKey: cardDetailQueryKey(id),
    queryFn: () => getCardById(id),
    enabled: id.length > 0,
  })
}
