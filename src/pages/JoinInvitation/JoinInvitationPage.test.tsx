import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import JoinInvitationPage from './JoinInvitationPage';

const createWrapper = (token: string = 'valid-token') => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/join/${token}`]}>
        <Routes>
          <Route path="/join/:token" element={<JoinInvitationPage />} />
          <Route path="/my-reservations" element={<div>My Reservations</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('JoinInvitationPage', () => {
  beforeEach(() => {
    localStorage.setItem('auth_token', 'test-token');
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(createWrapper());

    expect(screen.getByText(/loading invitation/i)).toBeInTheDocument();
  });

  it('displays invitation details when loaded', async () => {
    render(createWrapper('valid-token'));

    await waitFor(() => {
      expect(screen.getByText(/you've been invited/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/study room/i)).toBeInTheDocument();
  });

  it('shows error message for invalid token', async () => {
    render(createWrapper('invalid-token'));

    await waitFor(() => {
      expect(screen.getByText(/invitation not found/i)).toBeInTheDocument();
    });
  });

  it('shows error message for expired invitation', async () => {
    render(createWrapper('expired-token'));

    await waitFor(() => {
      expect(screen.getByText(/invitation has expired/i)).toBeInTheDocument();
    });
  });

  it('displays reservation details correctly', async () => {
    render(createWrapper('valid-token'));

    await waitFor(() => {
      expect(screen.getByText(/study room/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/participants/i)).toBeInTheDocument();
    expect(screen.getByText(/capacity/i)).toBeInTheDocument();
  });

  it('shows participant list', async () => {
    render(createWrapper('valid-token'));

    await waitFor(() => {
      expect(screen.getByText(/study room/i)).toBeInTheDocument();
    });

    // Participants should be displayed
    const participants = screen.getAllByRole('listitem');
    expect(participants.length).toBeGreaterThan(0);
  });

  it('enables join button when invitation is valid', async () => {
    render(createWrapper('valid-token'));

    await waitFor(() => {
      expect(screen.getByText(/study room/i)).toBeInTheDocument();
    });

    const joinButton = screen.getByRole('button', { name: /join group/i });
    expect(joinButton).toBeEnabled();
  });

  it('disables join button when invitation is invalid', async () => {
    render(createWrapper('full-capacity-token'));

    await waitFor(() => {
      expect(screen.getByText(/study room/i)).toBeInTheDocument();
    });

    const joinButton = screen.getByRole('button', { name: /join group/i });
    expect(joinButton).toBeDisabled();
  });

  it('shows validation errors', async () => {
    render(createWrapper('full-capacity-token'));

    await waitFor(() => {
      expect(screen.getByText(/at full capacity/i)).toBeInTheDocument();
    });
  });

  it('handles join button click', async () => {
    const user = userEvent.setup();
    render(createWrapper('valid-token'));

    await waitFor(() => {
      expect(screen.getByText(/study room/i)).toBeInTheDocument();
    });

    const joinButton = screen.getByRole('button', { name: /join group/i });
    await user.click(joinButton);

    await waitFor(() => {
      expect(screen.getByText(/joining/i)).toBeInTheDocument();
    });
  });

  it('redirects to my reservations after successful join', async () => {
    const user = userEvent.setup();
    render(createWrapper('valid-token'));

    await waitFor(() => {
      expect(screen.getByText(/study room/i)).toBeInTheDocument();
    });

    const joinButton = screen.getByRole('button', { name: /join group/i });
    await user.click(joinButton);

    await waitFor(() => {
      expect(screen.getByText(/my reservations/i)).toBeInTheDocument();
    });
  });

  it('displays organizer badge for reservation creator', async () => {
    render(createWrapper('valid-token'));

    await waitFor(() => {
      expect(screen.getByText(/study room/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/organizer/i)).toBeInTheDocument();
  });

  it('shows privacy status for private reservations', async () => {
    render(createWrapper('private-token'));

    await waitFor(() => {
      expect(screen.getByText(/private group/i)).toBeInTheDocument();
    });
  });

  it('formats date and time correctly', async () => {
    render(createWrapper('valid-token'));

    await waitFor(() => {
      expect(screen.getByText(/study room/i)).toBeInTheDocument();
    });

    // Should display formatted date and time
    expect(screen.getByText(/\d{1,2}:\d{2} [AP]M/)).toBeInTheDocument();
  });

  it('shows capacity information', async () => {
    render(createWrapper('valid-token'));

    await waitFor(() => {
      expect(screen.getByText(/study room/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/\d+\/\d+/)).toBeInTheDocument();
  });
});
