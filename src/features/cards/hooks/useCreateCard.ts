import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { createCard } from '../api/cardsApi'
import { CARDS_QUERY_KEY } from './useCards'
import type { Card, CreateCardRequest } from '../types/CardTypes'
import type { ApiErrorResponse } from '../../auth/types/AuthTypes'

export function useCreateCard() {
  const queryClient = useQueryClient()

  return useMutation<Card, AxiosError<ApiErrorResponse>, CreateCardRequest>({
    mutationFn: createCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CARDS_QUERY_KEY })
    },
  })
}
