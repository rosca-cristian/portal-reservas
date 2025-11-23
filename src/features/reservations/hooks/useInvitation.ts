import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient as api } from '@/lib/api/client';

export interface InvitationDetails {
  token: string;
  reservation: {
    id: string;
    spaceName: string;
    spaceType: string;
    startTime: string;
    endTime: string;
    groupSize: number;
    maxCapacity: number;
    currentCapacity: number;
    privacyOption: 'public' | 'private';
    organizerId: string;
    organizerName: string;
    participants: Array<{
      id: string;
      userId: string;
      name: string;
      joinedAt: Date;
      role: 'organizer' | 'member';
    }>;
    status: string;
    createdAt: string;
  };
  invitationCreatedAt: string;
  isValid: boolean;
  canJoin: boolean;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Hook to fetch and validate invitation details
 * @param token - Invitation token
 * @param enablePolling - Enable real-time participant updates (polls every 10 seconds)
 */
export function useInvitation(token: string, enablePolling = false) {
  return useQuery({
    queryKey: ['invitation', token],
    queryFn: async (): Promise<InvitationDetails> => {
      const response = await api.get(`/invitations/${token}`);
      return response.data.data;
    },
    retry: false,
    staleTime: 0, // Always fetch fresh data
    refetchInterval: enablePolling ? 10000 : false, // Poll every 10 seconds if enabled
    refetchIntervalInBackground: false, // Don't poll when tab is not active
  });
}

/**
 * Hook to join a reservation via invitation
 */
export function useJoinInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (token: string) => {
      const response = await api.post(`/invitations/${token}/join`);
      return response.data.data;
    },
    onSuccess: () => {
      // Invalidate reservations to refresh the list
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
}
