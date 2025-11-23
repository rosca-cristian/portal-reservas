import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../lib/api/client';
import { useReservationsStore } from '../stores/reservationsStore';
import type { CreateReservation } from '../schemas/booking.schema';

interface ReservationResponse {
  id: string;
  spaceId: string;
  spaceName: string;
  startTime: string;
  endTime: string;
  status: 'confirmed';
  notes?: string;
  createdAt: string;
}

export function useCreateReservation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { addReservation, resetWizard, setWizardStep } = useReservationsStore();

  return useMutation({
    mutationFn: async (data: CreateReservation): Promise<ReservationResponse> => {
      const response = await apiClient.post('/api/reservations', data);
      return response.data;
    },
    onSuccess: (data) => {
      // Add to store
      addReservation({
        id: data.id,
        spaceId: data.spaceId,
        spaceName: data.spaceName,
        startTime: data.startTime,
        endTime: data.endTime,
        status: data.status,
        notes: data.notes,
        createdAt: data.createdAt,
      });

      // Reset wizard state
      resetWizard();

      // Invalidate reservations query
      queryClient.invalidateQueries({ queryKey: ['reservations'] });

      // Navigate to confirmation page
      navigate(`/booking/confirmation/${data.id}`, {
        state: { reservation: data },
      });
    },
    onError: (error: any) => {
      // Handle 409 Conflict (booking conflict or space unavailable)
      if (error.response?.status === 409) {
        const errorData = error.response.data;
        console.error('Booking conflict:', errorData);

        // Show detailed error message
        const message =
          errorData.error?.code === 'BOOKING_CONFLICT'
            ? 'This time slot is already booked. Please select a different time.'
            : errorData.error?.message || 'Unable to create reservation';

        alert(message); // In production, use a toast notification

        // Return user to step 1 to select different time
        setWizardStep(1);
      }
    },
  });
}
