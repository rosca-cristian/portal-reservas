/**
 * useCreateReservation Hook Tests
 * Story 3.1 & 3.2: Booking Wizard - Create Reservation
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCreateReservation } from './useCreateReservation';
import apiClient from '../../../lib/api/client';
import { useReservationsStore } from '../stores/reservationsStore';
import type { ReactNode } from 'react';

// Mock modules
vi.mock('../../../lib/api/client');
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

// Create wrapper component for React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useCreateReservation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset Zustand store
    useReservationsStore.setState({
      reservations: [],
      currentStep: 1,
      stepOne: null,
      stepTwo: null,
    });
  });

  it('successfully creates a reservation', async () => {
    const mockReservation = {
      id: 'reservation-123',
      spaceId: 'space-456',
      spaceName: 'Conference Room A',
      startTime: '2025-01-15T10:00:00.000Z',
      endTime: '2025-01-15T12:00:00.000Z',
      status: 'confirmed' as const,
      notes: 'Team meeting',
      createdAt: '2025-01-10T08:00:00.000Z',
    };

    vi.mocked(apiClient.post).mockResolvedValueOnce({
      data: mockReservation,
    });

    const wrapper = createWrapper();
    const { result } = renderHook(() => useCreateReservation(), { wrapper });

    // Trigger mutation
    result.current.mutate({
      spaceId: 'space-456',
      startTime: '2025-01-15T10:00:00.000Z',
      endTime: '2025-01-15T12:00:00.000Z',
      notes: 'Team meeting',
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Verify API was called correctly
    expect(apiClient.post).toHaveBeenCalledWith('/api/reservations', {
      spaceId: 'space-456',
      startTime: '2025-01-15T10:00:00.000Z',
      endTime: '2025-01-15T12:00:00.000Z',
      notes: 'Team meeting',
    });

    // Verify reservation was added to store
    const state = useReservationsStore.getState();
    expect(state.reservations).toHaveLength(1);
    expect(state.reservations[0].id).toBe('reservation-123');
  });

  it('resets wizard state after successful creation', async () => {
    const mockReservation = {
      id: 'reservation-123',
      spaceId: 'space-456',
      spaceName: 'Room A',
      startTime: '2025-01-15T10:00:00.000Z',
      endTime: '2025-01-15T12:00:00.000Z',
      status: 'confirmed' as const,
      createdAt: '2025-01-10T08:00:00.000Z',
    };

    vi.mocked(apiClient.post).mockResolvedValueOnce({
      data: mockReservation,
    });

    // Set some wizard state
    useReservationsStore.setState({
      currentStep: 2,
      stepOne: {
        spaceId: 'space-456',
        date: new Date('2025-01-15'),
        startTime: '10:00',
        duration: 2,
      },
      stepTwo: {
        notes: 'Test notes',
      },
    });

    const wrapper = createWrapper();
    const { result } = renderHook(() => useCreateReservation(), { wrapper });

    result.current.mutate({
      spaceId: 'space-456',
      startTime: '2025-01-15T10:00:00.000Z',
      endTime: '2025-01-15T12:00:00.000Z',
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Verify wizard was reset
    const state = useReservationsStore.getState();
    expect(state.currentStep).toBe(1);
    expect(state.stepOne).toBeNull();
    expect(state.stepTwo).toBeNull();
  });

  it('handles 409 conflict error correctly', async () => {
    const conflictError = {
      response: {
        status: 409,
        data: {
          error: {
            code: 'BOOKING_CONFLICT',
            message: 'This time slot is already booked',
          },
        },
      },
    };

    vi.mocked(apiClient.post).mockRejectedValueOnce(conflictError);

    // Mock alert
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    // Set wizard to step 2
    useReservationsStore.setState({ currentStep: 2 });

    const wrapper = createWrapper();
    const { result } = renderHook(() => useCreateReservation(), { wrapper });

    result.current.mutate({
      spaceId: 'space-456',
      startTime: '2025-01-15T10:00:00.000Z',
      endTime: '2025-01-15T12:00:00.000Z',
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // Verify alert was shown with correct message
    expect(alertMock).toHaveBeenCalledWith(
      'This time slot is already booked. Please select a different time.'
    );

    // Verify user was returned to step 1
    const state = useReservationsStore.getState();
    expect(state.currentStep).toBe(1);

    alertMock.mockRestore();
  });

  it('handles generic 409 error without specific code', async () => {
    const conflictError = {
      response: {
        status: 409,
        data: {
          error: {
            message: 'Space is unavailable',
          },
        },
      },
    };

    vi.mocked(apiClient.post).mockRejectedValueOnce(conflictError);

    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    const wrapper = createWrapper();
    const { result } = renderHook(() => useCreateReservation(), { wrapper });

    result.current.mutate({
      spaceId: 'space-456',
      startTime: '2025-01-15T10:00:00.000Z',
      endTime: '2025-01-15T12:00:00.000Z',
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(alertMock).toHaveBeenCalledWith('Space is unavailable');

    alertMock.mockRestore();
  });

  it('handles network errors', async () => {
    const networkError = new Error('Network error');
    vi.mocked(apiClient.post).mockRejectedValueOnce(networkError);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useCreateReservation(), { wrapper });

    result.current.mutate({
      spaceId: 'space-456',
      startTime: '2025-01-15T10:00:00.000Z',
      endTime: '2025-01-15T12:00:00.000Z',
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // Verify reservation was not added to store
    const state = useReservationsStore.getState();
    expect(state.reservations).toHaveLength(0);
  });

  it('preserves reservation notes when provided', async () => {
    const mockReservation = {
      id: 'reservation-123',
      spaceId: 'space-456',
      spaceName: 'Room A',
      startTime: '2025-01-15T10:00:00.000Z',
      endTime: '2025-01-15T12:00:00.000Z',
      status: 'confirmed' as const,
      notes: 'Important meeting',
      createdAt: '2025-01-10T08:00:00.000Z',
    };

    vi.mocked(apiClient.post).mockResolvedValueOnce({
      data: mockReservation,
    });

    const wrapper = createWrapper();
    const { result } = renderHook(() => useCreateReservation(), { wrapper });

    result.current.mutate({
      spaceId: 'space-456',
      startTime: '2025-01-15T10:00:00.000Z',
      endTime: '2025-01-15T12:00:00.000Z',
      notes: 'Important meeting',
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const state = useReservationsStore.getState();
    expect(state.reservations[0].notes).toBe('Important meeting');
  });

  it('invalidates reservations query on success', async () => {
    const mockReservation = {
      id: 'reservation-123',
      spaceId: 'space-456',
      spaceName: 'Room A',
      startTime: '2025-01-15T10:00:00.000Z',
      endTime: '2025-01-15T12:00:00.000Z',
      status: 'confirmed' as const,
      createdAt: '2025-01-10T08:00:00.000Z',
    };

    vi.mocked(apiClient.post).mockResolvedValueOnce({
      data: mockReservation,
    });

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useCreateReservation(), { wrapper });

    result.current.mutate({
      spaceId: 'space-456',
      startTime: '2025-01-15T10:00:00.000Z',
      endTime: '2025-01-15T12:00:00.000Z',
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['reservations'] });
  });
});
