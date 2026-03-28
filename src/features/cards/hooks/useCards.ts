import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { getCards } from '../api/cardsApi'
import type { ApiErrorResponse } from '../../auth/types/AuthTypes'
import type { Card } from '../types/CardTypes'

export const CARDS_QUERY_KEY = ['cards'] as const

export function useCards() {
  return useQuery<Card[], AxiosError<ApiErrorResponse>>({
    queryKey: CARDS_QUERY_KEY,
    queryFn: getCards,
  })
}
