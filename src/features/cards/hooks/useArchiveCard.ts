import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { archiveCard } from '../api/cardsApi'
import { CARDS_QUERY_KEY } from './useCards'
import { cardDetailQueryKey } from './useCardDetail'
import type { ApiErrorResponse } from '../../auth/types/AuthTypes'

export function useArchiveCard() {
  const queryClient = useQueryClient()

  return useMutation<void, AxiosError<ApiErrorResponse>, string>({
    mutationFn: archiveCard,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: CARDS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: cardDetailQueryKey(id) })
    },
  })
}
