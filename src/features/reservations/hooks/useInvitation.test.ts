import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useInvitationDetails, useJoinInvitation } from './useInvitation';
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

describe('useInvitationDetails', () => {
  beforeEach(() => {
    localStorage.setItem('auth_token', 'test-token');
  });

  it('fetches invitation details successfully', async () => {
    const { result } = renderHook(
      () => useInvitationDetails('valid-token'),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.reservation).toBeDefined();
  });

  it('handles error when token is invalid', async () => {
    const { result } = renderHook(
      () => useInvitationDetails('invalid-token'),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it('does not fetch when token is not provided', () => {
    const { result } = renderHook(
      () => useInvitationDetails(''),
      { wrapper: createWrapper() }
    );

    expect(result.current.isFetching).toBe(false);
  });
});

describe('useJoinInvitation', () => {
  beforeEach(() => {
    localStorage.setItem('auth_token', 'test-token');
  });

  it('joins invitation successfully', async () => {
    const { result } = renderHook(
      () => useJoinInvitation(),
      { wrapper: createWrapper() }
    );

    result.current.mutate('valid-token');

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
  });

  it('handles error when joining fails', async () => {
    const { result } = renderHook(
      () => useJoinInvitation(),
      { wrapper: createWrapper() }
    );

    result.current.mutate('invalid-token');

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it('calls onSuccess callback when provided', async () => {
    let successCalled = false;

    const { result } = renderHook(
      () => useJoinInvitation({
        onSuccess: () => {
          successCalled = true;
        },
      }),
      { wrapper: createWrapper() }
    );

    result.current.mutate('valid-token');

    await waitFor(() => expect(successCalled).toBe(true));
  });

  it('calls onError callback when provided', async () => {
    let errorCalled = false;

    const { result } = renderHook(
      () => useJoinInvitation({
        onError: () => {
          errorCalled = true;
        },
      }),
      { wrapper: createWrapper() }
    );

    result.current.mutate('invalid-token');

    await waitFor(() => expect(errorCalled).toBe(true));
  });
});
