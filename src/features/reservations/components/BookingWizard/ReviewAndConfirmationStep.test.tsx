/**
 * ReviewAndConfirmationStep Component Tests
 * Story 3.2: Booking Wizard - Review and Confirmation
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReviewAndConfirmationStep from './ReviewAndConfirmationStep';
import { useReservationsStore } from '../../stores/reservationsStore';
import type { ReactNode } from 'react';

// Mock useCreateReservation hook
vi.mock('../../hooks/useCreateReservation', () => ({
  useCreateReservation: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

// Create wrapper for React Query
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

describe('ReviewAndConfirmationStep', () => {
  const mockSpaceName = 'Conference Room A';
  const mockSpaceType = 'Meeting Room';

  beforeEach(() => {
    vi.clearAllMocks();
    // Set initial wizard state
    useReservationsStore.setState({
      currentStep: 2,
      wizard: {
        stepOne: {
          spaceId: 'space-123',
          date: new Date('2025-01-15T00:00:00.000Z'),
          startTime: '10:00',
          duration: 2,
        },
        stepTwo: null,
      },
      reservations: [],
    });
  });

  it('displays booking summary with space name', () => {
    const wrapper = createWrapper();
    render(
      <ReviewAndConfirmationStep spaceName={mockSpaceName} />,
      { wrapper }
    );

    expect(screen.getByText('Conference Room A')).toBeTruthy();
  });

  it('displays space type', () => {
    const wrapper = createWrapper();
    render(
      <ReviewAndConfirmationStep spaceName={mockSpaceName} spaceType={mockSpaceType} />,
      { wrapper }
    );

    expect(screen.getByText('Meeting Room')).toBeTruthy();
  });

  it('displays default space type when not provided', () => {
    const wrapper = createWrapper();
    render(
      <ReviewAndConfirmationStep spaceName={mockSpaceName} />,
      { wrapper }
    );

    expect(screen.getByText('Individual Desk')).toBeTruthy();
  });

  it('displays selected date in readable format', () => {
    const wrapper = createWrapper();
    render(
      <ReviewAndConfirmationStep spaceName={mockSpaceName} />,
      { wrapper }
    );

    expect(screen.getByText(/Wednesday, January 15, 2025/)).toBeTruthy();
  });

  it('displays start and end time', () => {
    const wrapper = createWrapper();
    render(
      <ReviewAndConfirmationStep spaceName={mockSpaceName} />,
      { wrapper }
    );

    expect(screen.getByText(/10:00 - 12:00/)).toBeTruthy();
  });

  it('displays duration', () => {
    const wrapper = createWrapper();
    render(
      <ReviewAndConfirmationStep spaceName={mockSpaceName} />,
      { wrapper }
    );

    expect(screen.getByText('2 hour(s)')).toBeTruthy();
  });

  it('renders notes textarea', () => {
    const wrapper = createWrapper();
    render(
      <ReviewAndConfirmationStep spaceName={mockSpaceName} />,
      { wrapper }
    );

    const textarea = screen.getByPlaceholderText(/Add any special requirements/);
    expect(textarea).toBeTruthy();
  });

  it('allows entering notes up to 500 characters', async () => {
    const user = userEvent.setup();
    const wrapper = createWrapper();
    render(
      <ReviewAndConfirmationStep spaceName={mockSpaceName} />,
      { wrapper }
    );

    const textarea = screen.getByPlaceholderText(/Add any special requirements/);
    const testNotes = 'Need extra monitors for presentation';

    await user.type(textarea, testNotes);

    expect((textarea as HTMLTextAreaElement).value).toBe(testNotes);
  });

  it('shows character count for notes', async () => {
    const user = userEvent.setup();
    const wrapper = createWrapper();
    render(
      <ReviewAndConfirmationStep spaceName={mockSpaceName} />,
      { wrapper }
    );

    const textarea = screen.getByPlaceholderText(/Add any special requirements/);
    await user.type(textarea, 'Test note');

    expect(screen.getByText(/9\/500 characters/)).toBeTruthy();
  });

  it('limits notes to 500 characters', async () => {
    const user = userEvent.setup();
    const wrapper = createWrapper();
    render(
      <ReviewAndConfirmationStep spaceName={mockSpaceName} />,
      { wrapper }
    );

    const textarea = screen.getByPlaceholderText(/Add any special requirements/);
    const longText = 'a'.repeat(600);

    await user.type(textarea, longText);

    expect((textarea as HTMLTextAreaElement).value.length).toBe(500);
  });

  it('renders Back button', () => {
    const wrapper = createWrapper();
    render(
      <ReviewAndConfirmationStep spaceName={mockSpaceName} />,
      { wrapper }
    );

    expect(screen.getByText('Back')).toBeTruthy();
  });

  it('renders Confirm Booking button', () => {
    const wrapper = createWrapper();
    render(
      <ReviewAndConfirmationStep spaceName={mockSpaceName} />,
      { wrapper }
    );

    expect(screen.getByText('Confirm Booking')).toBeTruthy();
  });

  it('navigates back to step 1 when Back is clicked', async () => {
    const user = userEvent.setup();
    const wrapper = createWrapper();
    render(
      <ReviewAndConfirmationStep spaceName={mockSpaceName} />,
      { wrapper }
    );

    const backButton = screen.getByText('Back');
    await user.click(backButton);

    const state = useReservationsStore.getState();
    expect(state.currentStep).toBe(1);
  });

  it('calculates correct end time for 1 hour duration', () => {
    useReservationsStore.setState({
      wizard: {
        stepOne: {
          spaceId: 'space-123',
          date: new Date('2025-01-15T00:00:00.000Z'),
          startTime: '14:00',
          duration: 1,
        },
        stepTwo: null,
      },
    });

    const wrapper = createWrapper();
    render(
      <ReviewAndConfirmationStep spaceName={mockSpaceName} />,
      { wrapper }
    );

    expect(screen.getByText(/14:00 - 15:00/)).toBeTruthy();
  });

  it('calculates correct end time for 3 hour duration', () => {
    useReservationsStore.setState({
      wizard: {
        stepOne: {
          spaceId: 'space-123',
          date: new Date('2025-01-15T00:00:00.000Z'),
          startTime: '09:00',
          duration: 3,
        },
        stepTwo: null,
      },
    });

    const wrapper = createWrapper();
    render(
      <ReviewAndConfirmationStep spaceName={mockSpaceName} />,
      { wrapper }
    );

    expect(screen.getByText(/09:00 - 12:00/)).toBeTruthy();
  });

  it('handles single-digit hours correctly in time display', () => {
    useReservationsStore.setState({
      wizard: {
        stepOne: {
          spaceId: 'space-123',
          date: new Date('2025-01-15T00:00:00.000Z'),
          startTime: '08:00',
          duration: 1,
        },
        stepTwo: null,
      },
    });

    const wrapper = createWrapper();
    render(
      <ReviewAndConfirmationStep spaceName={mockSpaceName} />,
      { wrapper }
    );

    expect(screen.getByText(/08:00 - 09:00/)).toBeTruthy();
  });

  it('has correct accessibility labels for form elements', () => {
    const wrapper = createWrapper();
    render(
      <ReviewAndConfirmationStep spaceName={mockSpaceName} />,
      { wrapper }
    );

    const textarea = screen.getByLabelText(/Notes \(Optional\)/);
    expect(textarea).toBeTruthy();
  });

  it('displays Booking Summary heading', () => {
    const wrapper = createWrapper();
    render(
      <ReviewAndConfirmationStep spaceName={mockSpaceName} />,
      { wrapper }
    );

    expect(screen.getByText('Booking Summary')).toBeTruthy();
  });

  it('applies correct styling to summary section', () => {
    const wrapper = createWrapper();
    render(
      <ReviewAndConfirmationStep spaceName={mockSpaceName} />,
      { wrapper }
    );

    const summarySection = screen.getByText('Booking Summary').closest('div');
    expect(summarySection?.className).toContain('bg-gray-50');
    expect(summarySection?.className).toContain('rounded-lg');
  });

  it('shows all summary labels', () => {
    const wrapper = createWrapper();
    render(
      <ReviewAndConfirmationStep spaceName={mockSpaceName} />,
      { wrapper }
    );

    expect(screen.getByText('Space:')).toBeTruthy();
    expect(screen.getByText('Type:')).toBeTruthy();
    expect(screen.getByText('Date:')).toBeTruthy();
    expect(screen.getByText('Time:')).toBeTruthy();
    expect(screen.getByText('Duration:')).toBeTruthy();
  });
});
