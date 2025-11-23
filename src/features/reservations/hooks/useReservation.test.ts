import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useReservation } from './useReservation';
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

describe('useReservation', () => {
  beforeEach(() => {
    localStorage.setItem('auth_token', 'test-token');
  });

  it('fetches reservation details successfully', async () => {
    const { result } = renderHook(
      () => useReservation('reservation-1'),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.id).toBe('reservation-1');
  });

  it('does not fetch when reservationId is undefined', () => {
    const { result } = renderHook(
      () => useReservation(undefined),
      { wrapper: createWrapper() }
    );

    expect(result.current.isFetching).toBe(false);
  });

  it('enables polling when specified', async () => {
    const { result } = renderHook(
      () => useReservation('reservation-1', true),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Polling is configured (we can't easily test the actual polling behavior in unit tests)
    expect(result.current.data).toBeDefined();
  });

  it('handles error when reservation not found', async () => {
    const { result } = renderHook(
      () => useReservation('invalid-reservation'),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it('refetches data when polling is enabled', async () => {
    vi.useFakeTimers();

    const { result } = renderHook(
      () => useReservation('reservation-1', true),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const initialFetchCount = result.current.dataUpdatedAt;

    // Advance time by 10 seconds (polling interval)
    vi.advanceTimersByTime(10000);

    await waitFor(() => {
      expect(result.current.dataUpdatedAt).toBeGreaterThan(initialFetchCount);
    });

    vi.useRealTimers();
  });
});
