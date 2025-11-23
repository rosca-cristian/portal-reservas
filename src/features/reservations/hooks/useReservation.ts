import { useQuery } from '@tanstack/react-query';
import { apiClient as api } from '@/lib/api/client';
import type { Reservation } from '@/types/reservation';

/**
 * Hook to fetch reservation details
 * @param reservationId - Reservation ID
 * @param enablePolling - Enable real-time participant updates (polls every 10 seconds)
 */
export function useReservation(reservationId: string | undefined, enablePolling = false) {
  return useQuery({
    queryKey: ['reservation', reservationId],
    queryFn: async (): Promise<Reservation> => {
      const response = await api.get(`/reservations/${reservationId}`);
      return response.data.data;
    },
    enabled: !!reservationId,
    refetchInterval: enablePolling ? 10000 : false, // Poll every 10 seconds if enabled
    refetchIntervalInBackground: false, // Don't poll when tab is not active
  });
}
