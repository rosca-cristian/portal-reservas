import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

interface RemoveParticipantParams {
  reservationId: string;
  participantId: string;
}

export function useRemoveParticipant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reservationId, participantId }: RemoveParticipantParams) => {
      const response = await apiClient.delete(
        `/api/reservations/${reservationId}/participants/${participantId}`
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate reservation queries to refresh participant list
      queryClient.invalidateQueries({
        queryKey: ['reservation', variables.reservationId],
      });
      queryClient.invalidateQueries({
        queryKey: ['reservations'],
      });
    },
  });
}
