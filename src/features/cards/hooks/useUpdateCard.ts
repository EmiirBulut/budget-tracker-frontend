import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { updateCard } from '../api/cardsApi'
import { CARDS_QUERY_KEY } from './useCards'
import { cardDetailQueryKey } from './useCardDetail'
import type { Card, UpdateCardRequest } from '../types/CardTypes'
import type { ApiErrorResponse } from '../../auth/types/AuthTypes'

interface UpdateCardVariables {
  id: string
  data: UpdateCardRequest
}

export function useUpdateCard() {
  const queryClient = useQueryClient()

  return useMutation<Card, AxiosError<ApiErrorResponse>, UpdateCardVariables>({
    mutationFn: ({ id, data }) => updateCard(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: CARDS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: cardDetailQueryKey(variables.id) })
    },
  })
}
