/**
 * Integration tests for Group Room Capacity Validation
 * Story 4.6: Group Room Capacity Validation
 *
 * This test file demonstrates the complete capacity validation flow:
 * 1. Minimum capacity enforcement on booking
 * 2. Maximum capacity enforcement on joining
 * 3. Capacity indicators throughout the UI
 * 4. Real-time capacity updates
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useReservationsStore } from '../stores/reservationsStore';
import GroupSizeInput from '../components/BookingWizard/GroupSizeInput';
import ParticipantList from '../components/Participants/ParticipantList';
import PrivacyIndicator from '@/features/spaces/components/PrivacyIndicator';
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

describe('Capacity Validation Integration', () => {
  beforeEach(() => {
    useReservationsStore.getState().resetWizard();
    localStorage.setItem('auth_token', 'test-token');
  });

  describe('Minimum Capacity Validation', () => {
    it('prevents booking with group size below minimum', async () => {
      const user = userEvent.setup();
      render(<GroupSizeInput minCapacity={4} maxCapacity={10} />, { wrapper: createWrapper() });

      const input = screen.getByLabelText(/group size/i);
      await user.clear(input);
      await user.type(input, '2');

      expect(screen.getByText(/this room requires at least 4 participants/i)).toBeInTheDocument();
      expect(useReservationsStore.getState().wizard.groupSize).toBe(2);
    });

    it('allows booking at minimum capacity', async () => {
      const user = userEvent.setup();
      render(<GroupSizeInput minCapacity={4} maxCapacity={10} />, { wrapper: createWrapper() });

      const input = screen.getByLabelText(/group size/i);
      await user.clear(input);
      await user.type(input, '4');

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(useReservationsStore.getState().wizard.groupSize).toBe(4);
    });

    it('displays minimum capacity requirement', () => {
      render(<GroupSizeInput minCapacity={4} maxCapacity={10} />);

      expect(screen.getByText(/capacity: 4-10 participants/i)).toBeInTheDocument();
    });
  });

  describe('Maximum Capacity Validation', () => {
    it('prevents booking with group size above maximum', async () => {
      const user = userEvent.setup();
      render(<GroupSizeInput minCapacity={4} maxCapacity={10} />, { wrapper: createWrapper() });

      const input = screen.getByLabelText(/group size/i);
      await user.clear(input);
      await user.type(input, '12');

      expect(screen.getByText(/this room can accommodate maximum 10 participants/i)).toBeInTheDocument();
    });

    it('allows booking at maximum capacity', async () => {
      const user = userEvent.setup();
      render(<GroupSizeInput minCapacity={4} maxCapacity={10} />, { wrapper: createWrapper() });

      const input = screen.getByLabelText(/group size/i);
      await user.clear(input);
      await user.type(input, '10');

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(useReservationsStore.getState().wizard.groupSize).toBe(10);
    });

    it('shows full indicator when at maximum capacity', () => {
      render(
        <PrivacyIndicator
          privacyOption="public"
          currentCapacity={10}
          maxCapacity={10}
        />
      );

      expect(screen.getByText(/full/i)).toBeInTheDocument();
    });
  });

  describe('Capacity Indicators', () => {
    it('displays current capacity in participant list', () => {
      const participants: Participant[] = [
        {
          id: '1',
          userId: 'user-1',
          name: 'Alice',
          email: 'alice@example.com',
          joinedAt: new Date(),
          joinedVia: 'direct',
          role: 'organizer',
        },
        {
          id: '2',
          userId: 'user-2',
          name: 'Bob',
          email: 'bob@example.com',
          joinedAt: new Date(),
          joinedVia: 'invitation',
          role: 'member',
        },
      ];

      render(
        <ParticipantList
          participants={participants}
          reservationId="res-1"
          isOrganizer={true}
          currentUserId="user-1"
        />,
        { wrapper: createWrapper() }
      );

      expect(screen.getByText(/participants \(2\)/i)).toBeInTheDocument();
    });

    it('displays capacity in privacy indicator', () => {
      render(
        <PrivacyIndicator
          privacyOption="public"
          currentCapacity={7}
          maxCapacity={10}
        />
      );

      expect(screen.getByText('7/10')).toBeInTheDocument();
    });

    it('shows join available when below capacity', () => {
      render(
        <PrivacyIndicator
          privacyOption="public"
          currentCapacity={7}
          maxCapacity={10}
        />
      );

      expect(screen.getByText(/join available/i)).toBeInTheDocument();
    });
  });

  describe('Real-time Capacity Updates', () => {
    it('updates participant count when new member joins', async () => {
      const initialParticipants: Participant[] = [
        {
          id: '1',
          userId: 'user-1',
          name: 'Alice',
          email: 'alice@example.com',
          joinedAt: new Date(),
          joinedVia: 'direct',
          role: 'organizer',
        },
      ];

      const { rerender } = render(
        <ParticipantList
          participants={initialParticipants}
          reservationId="res-1"
          isOrganizer={true}
          currentUserId="user-1"
        />,
        { wrapper: createWrapper() }
      );

      expect(screen.getByText(/participants \(1\)/i)).toBeInTheDocument();

      // Simulate new participant joining
      const updatedParticipants: Participant[] = [
        ...initialParticipants,
        {
          id: '2',
          userId: 'user-2',
          name: 'Bob',
          email: 'bob@example.com',
          joinedAt: new Date(),
          joinedVia: 'invitation',
          role: 'member',
        },
      ];

      rerender(
        <ParticipantList
          participants={updatedParticipants}
          reservationId="res-1"
          isOrganizer={true}
          currentUserId="user-1"
        />
      );

      expect(screen.getByText(/participants \(2\)/i)).toBeInTheDocument();
    });

    it('updates capacity indicator when participant count changes', () => {
      const { rerender } = render(
        <PrivacyIndicator
          privacyOption="public"
          currentCapacity={5}
          maxCapacity={10}
        />
      );

      expect(screen.getByText('5/10')).toBeInTheDocument();

      rerender(
        <PrivacyIndicator
          privacyOption="public"
          currentCapacity={6}
          maxCapacity={10}
        />
      );

      expect(screen.getByText('6/10')).toBeInTheDocument();
    });
  });

  describe('Capacity Status Changes', () => {
    it('shows join available when below capacity', () => {
      render(
        <PrivacyIndicator
          privacyOption="public"
          currentCapacity={4}
          maxCapacity={10}
        />
      );

      expect(screen.getByText(/join available/i)).toBeInTheDocument();
    });

    it('shows full status when at capacity', () => {
      render(
        <PrivacyIndicator
          privacyOption="public"
          currentCapacity={10}
          maxCapacity={10}
        />
      );

      expect(screen.getByText(/full/i)).toBeInTheDocument();
    });

    it('transitions from join available to full', () => {
      const { rerender } = render(
        <PrivacyIndicator
          privacyOption="public"
          currentCapacity={9}
          maxCapacity={10}
        />
      );

      expect(screen.getByText(/join available/i)).toBeInTheDocument();

      rerender(
        <PrivacyIndicator
          privacyOption="public"
          currentCapacity={10}
          maxCapacity={10}
        />
      );

      expect(screen.getByText(/full/i)).toBeInTheDocument();
    });
  });

  describe('Error Messages', () => {
    it('shows specific error for below minimum', async () => {
      const user = userEvent.setup();
      render(<GroupSizeInput minCapacity={4} maxCapacity={10} />);

      const input = screen.getByLabelText(/group size/i);
      await user.clear(input);
      await user.type(input, '3');

      expect(screen.getByText(/this room requires at least 4 participants/i)).toBeInTheDocument();
    });

    it('shows specific error for above maximum', async () => {
      const user = userEvent.setup();
      render(<GroupSizeInput minCapacity={4} maxCapacity={10} />);

      const input = screen.getByLabelText(/group size/i);
      await user.clear(input);
      await user.type(input, '11');

      expect(screen.getByText(/this room can accommodate maximum 10 participants/i)).toBeInTheDocument();
    });
  });
});
