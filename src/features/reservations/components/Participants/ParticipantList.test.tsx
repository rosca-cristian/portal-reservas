import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ParticipantList from './ParticipantList';
import type { Participant } from '@/types/reservation';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

const mockParticipants: Participant[] = [
  {
    id: '1',
    userId: 'user-1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    joinedAt: new Date('2024-01-01T10:00:00'),
    joinedVia: 'direct',
    role: 'organizer',
  },
  {
    id: '2',
    userId: 'user-2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    joinedAt: new Date('2024-01-01T10:05:00'),
    joinedVia: 'invitation',
    role: 'member',
  },
  {
    id: '3',
    userId: 'user-3',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    joinedAt: new Date('2024-01-01T10:10:00'),
    joinedVia: 'invitation',
    role: 'member',
  },
];

describe('ParticipantList', () => {
  beforeEach(() => {
    localStorage.setItem('auth_token', 'test-token');
  });

  it('renders participant count correctly', () => {
    render(
      <ParticipantList
        participants={mockParticipants}
        reservationId="res-1"
        isOrganizer={false}
        currentUserId="user-2"
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText(/participants \(3\)/i)).toBeInTheDocument();
  });

  it('displays all participants', () => {
    render(
      <ParticipantList
        participants={mockParticipants}
        reservationId="res-1"
        isOrganizer={false}
        currentUserId="user-2"
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    expect(screen.getByText('Bob Smith')).toBeInTheDocument();
    expect(screen.getByText('Charlie Brown')).toBeInTheDocument();
  });

  it('shows organizer badge for organizer', () => {
    render(
      <ParticipantList
        participants={mockParticipants}
        reservationId="res-1"
        isOrganizer={false}
        currentUserId="user-2"
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('Organizer')).toBeInTheDocument();
  });

  it('displays organizer first in the list', () => {
    render(
      <ParticipantList
        participants={mockParticipants}
        reservationId="res-1"
        isOrganizer={false}
        currentUserId="user-2"
      />,
      { wrapper: createWrapper() }
    );

    const participants = screen.getAllByRole('listitem');
    expect(participants[0]).toHaveTextContent('Alice Johnson');
  });

  it('shows "You" label for current user', () => {
    render(
      <ParticipantList
        participants={mockParticipants}
        reservationId="res-1"
        isOrganizer={false}
        currentUserId="user-2"
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText(/\(You\)/i)).toBeInTheDocument();
  });

  it('shows remove buttons when user is organizer', () => {
    render(
      <ParticipantList
        participants={mockParticipants}
        reservationId="res-1"
        isOrganizer={true}
        currentUserId="user-1"
      />,
      { wrapper: createWrapper() }
    );

    const removeButtons = screen.getAllByRole('button', { name: /remove/i });
    // Should have remove buttons for 2 members (not organizer)
    expect(removeButtons).toHaveLength(2);
  });

  it('does not show remove buttons when user is not organizer', () => {
    render(
      <ParticipantList
        participants={mockParticipants}
        reservationId="res-1"
        isOrganizer={false}
        currentUserId="user-2"
      />,
      { wrapper: createWrapper() }
    );

    const removeButtons = screen.queryAllByRole('button', { name: /remove/i });
    expect(removeButtons).toHaveLength(0);
  });

  it('does not show remove button for organizer', () => {
    render(
      <ParticipantList
        participants={mockParticipants}
        reservationId="res-1"
        isOrganizer={true}
        currentUserId="user-1"
      />,
      { wrapper: createWrapper() }
    );

    // Alice is organizer, should not have remove button
    const aliceItem = screen.getByText('Alice Johnson').closest('li');
    const removeButton = aliceItem?.querySelector('button');
    expect(removeButton).not.toBeInTheDocument();
  });

  it('shows confirmation dialog when removing participant', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

    render(
      <ParticipantList
        participants={mockParticipants}
        reservationId="res-1"
        isOrganizer={true}
        currentUserId="user-1"
      />,
      { wrapper: createWrapper() }
    );

    const removeButtons = screen.getAllByRole('button', { name: /remove/i });
    await user.click(removeButtons[0]);

    expect(confirmSpy).toHaveBeenCalled();

    confirmSpy.mockRestore();
  });

  it('displays join timestamps for each participant', () => {
    render(
      <ParticipantList
        participants={mockParticipants}
        reservationId="res-1"
        isOrganizer={false}
        currentUserId="user-2"
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText(/joined jan 1, 2024 10:00 am/i)).toBeInTheDocument();
  });

  it('shows email addresses for all participants', () => {
    render(
      <ParticipantList
        participants={mockParticipants}
        reservationId="res-1"
        isOrganizer={false}
        currentUserId="user-2"
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
    expect(screen.getByText('bob@example.com')).toBeInTheDocument();
    expect(screen.getByText('charlie@example.com')).toBeInTheDocument();
  });

  it('displays empty state when no participants', () => {
    render(
      <ParticipantList
        participants={[]}
        reservationId="res-1"
        isOrganizer={false}
        currentUserId="user-1"
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText(/no participants yet/i)).toBeInTheDocument();
  });

  it('handles string date format for joinedAt', () => {
    const participantsWithStringDates: Participant[] = [
      {
        ...mockParticipants[0],
        joinedAt: '2024-01-01T10:00:00' as any,
      },
    ];

    render(
      <ParticipantList
        participants={participantsWithStringDates}
        reservationId="res-1"
        isOrganizer={false}
        currentUserId="user-2"
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText(/joined jan 1, 2024 10:00 am/i)).toBeInTheDocument();
  });
});
