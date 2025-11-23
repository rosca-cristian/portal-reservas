import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRemoveParticipant } from './useParticipant';
import type { ReactNode } from 'react';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useRemoveParticipant', () => {
  beforeEach(() => {
    localStorage.setItem('auth_token', 'test-token');
  });

  it('removes participant successfully', async () => {
    const { result } = renderHook(
      () => useRemoveParticipant(),
      { wrapper: createWrapper() }
    );

    result.current.mutate({
      reservationId: 'reservation-1',
      participantId: 'user-2',
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it('handles error when removal fails', async () => {
    const { result } = renderHook(
      () => useRemoveParticipant(),
      { wrapper: createWrapper() }
    );

    result.current.mutate({
      reservationId: 'invalid-reservation',
      participantId: 'user-2',
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it('invalidates reservation queries on success', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );

    const { result } = renderHook(
      () => useRemoveParticipant(),
      { wrapper }
    );

    result.current.mutate({
      reservationId: 'reservation-1',
      participantId: 'user-2',
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['reservation', 'reservation-1'],
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['reservations'],
    });
  });

  it('provides error message when mutation fails', async () => {
    const { result } = renderHook(
      () => useRemoveParticipant(),
      { wrapper: createWrapper() }
    );

    result.current.mutate({
      reservationId: 'invalid-reservation',
      participantId: 'user-2',
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
  });
});
