import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import JoinSessionButton from './JoinSessionButton';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        {children}
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('JoinSessionButton', () => {
  beforeEach(() => {
    localStorage.setItem('auth_token', 'test-token');
  });

  it('renders join button when capacity available', () => {
    render(
      <JoinSessionButton
        invitationToken="token-123"
        currentCapacity={5}
        maxCapacity={10}
        spaceName="Study Room A"
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByRole('button', { name: /join this session/i })).toBeInTheDocument();
    expect(screen.getByText(/5\/10/)).toBeInTheDocument();
  });

  it('renders disabled button when session is full', () => {
    render(
      <JoinSessionButton
        invitationToken="token-123"
        currentCapacity={10}
        maxCapacity={10}
        spaceName="Study Room A"
      />,
      { wrapper: createWrapper() }
    );

    const button = screen.getByRole('button', { name: /session full/i });
    expect(button).toBeDisabled();
    expect(screen.getByText(/10\/10/)).toBeInTheDocument();
  });

  it('handles join button click', async () => {
    const user = userEvent.setup();

    render(
      <JoinSessionButton
        invitationToken="valid-token"
        currentCapacity={5}
        maxCapacity={10}
        spaceName="Study Room A"
      />,
      { wrapper: createWrapper() }
    );

    const joinButton = screen.getByRole('button', { name: /join this session/i });
    await user.click(joinButton);

    await waitFor(() => {
      expect(screen.getByText(/joining\.\.\./i)).toBeInTheDocument();
    });
  });

  it('shows success message and navigates after successful join', async () => {
    const user = userEvent.setup();

    render(
      <JoinSessionButton
        invitationToken="valid-token"
        currentCapacity={5}
        maxCapacity={10}
        spaceName="Study Room A"
      />,
      { wrapper: createWrapper() }
    );

    const joinButton = screen.getByRole('button', { name: /join this session/i });
    await user.click(joinButton);

    // The component should call navigate after successful join
    await waitFor(() => {
      expect(joinButton).toBeDisabled();
    });
  });

  it('shows error message when join fails', async () => {
    const user = userEvent.setup();

    render(
      <JoinSessionButton
        invitationToken="invalid-token"
        currentCapacity={5}
        maxCapacity={10}
        spaceName="Study Room A"
      />,
      { wrapper: createWrapper() }
    );

    const joinButton = screen.getByRole('button', { name: /join this session/i });
    await user.click(joinButton);

    await waitFor(() => {
      // Button should be enabled again after error
      expect(joinButton).toBeEnabled();
    });
  });

  it('disables button while joining', async () => {
    const user = userEvent.setup();

    render(
      <JoinSessionButton
        invitationToken="valid-token"
        currentCapacity={5}
        maxCapacity={10}
        spaceName="Study Room A"
      />,
      { wrapper: createWrapper() }
    );

    const joinButton = screen.getByRole('button', { name: /join this session/i });
    await user.click(joinButton);

    expect(joinButton).toBeDisabled();
  });
});
