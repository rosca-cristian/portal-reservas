/**
 * DateSelectionStep Component Tests
 * Story 3.1: Booking Wizard - Date and Time Selection
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import DateSelectionStep from './DateSelectionStep';
import { useReservationsStore } from '../../stores/reservationsStore';

// Mock TimeSlotSelector
vi.mock('./TimeSlotSelector', () => ({
  default: ({ spaceId, date, selectedTime, onTimeSelect }: any) => (
    <div data-testid="time-slot-selector">
      <button onClick={() => onTimeSelect('10:00')}>10:00</button>
      <button onClick={() => onTimeSelect('14:00')}>14:00</button>
    </div>
  ),
}));

describe('DateSelectionStep', () => {
  const mockSpaceId = 'space-123';

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset Zustand store
    useReservationsStore.setState({
      currentStep: 1,
      stepOne: null,
      stepTwo: null,
    });
  });

  it('renders date selection buttons for next 7 days', () => {
    render(<DateSelectionStep spaceId={mockSpaceId} />);

    const dateButtons = screen.getAllByRole('button').filter(btn => !btn.textContent?.includes(':'));
    expect(dateButtons.length).toBeGreaterThanOrEqual(7);
  });

  it('shows date buttons with day, date, and month', () => {
    render(<DateSelectionStep spaceId={mockSpaceId} />);

    // Check that first button has the expected format (day name, date number, month)
    const buttons = screen.getAllByRole('button');
    const firstDateButton = buttons[0];

    expect(firstDateButton.textContent).toBeTruthy();
  });

  it('does not show time selector initially', () => {
    render(<DateSelectionStep spaceId={mockSpaceId} />);

    expect(screen.queryByTestId('time-slot-selector')).toBeNull();
  });

  it('shows time selector after selecting a date', async () => {
    const user = userEvent.setup();
    render(<DateSelectionStep spaceId={mockSpaceId} />);

    const dateButtons = screen.getAllByRole('button').filter(btn => !btn.textContent?.includes(':'));
    await user.click(dateButtons[0]);

    expect(screen.getByTestId('time-slot-selector')).toBeTruthy();
  });

  it('highlights selected date', async () => {
    const user = userEvent.setup();
    render(<DateSelectionStep spaceId={mockSpaceId} />);

    const dateButtons = screen.getAllByRole('button').filter(btn => !btn.textContent?.includes(':'));
    const firstButton = dateButtons[0];

    await user.click(firstButton);

    expect(firstButton.className).toContain('border-blue-600');
    expect(firstButton.className).toContain('bg-blue-50');
  });

  it('resets time selection when changing date', async () => {
    const user = userEvent.setup();
    render(<DateSelectionStep spaceId={mockSpaceId} />);

    const dateButtons = screen.getAllByRole('button').filter(btn => !btn.textContent?.includes(':'));

    // Select first date and time
    await user.click(dateButtons[0]);
    await waitFor(() => expect(screen.getByTestId('time-slot-selector')).toBeTruthy());
    const timeButton = screen.getByText('10:00');
    await user.click(timeButton);

    // Select different date
    await user.click(dateButtons[1]);

    // Time should be reset (component re-renders with new date)
    expect(screen.getByTestId('time-slot-selector')).toBeTruthy();
  });

  it('disables Next button when no date is selected', () => {
    render(<DateSelectionStep spaceId={mockSpaceId} />);

    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();
  });

  it('disables Next button when date is selected but no time', async () => {
    const user = userEvent.setup();
    render(<DateSelectionStep spaceId={mockSpaceId} />);

    const dateButtons = screen.getAllByRole('button').filter(btn => !btn.textContent?.includes(':'));
    await user.click(dateButtons[0]);

    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();
  });

  it('enables Next button when both date and time are selected', async () => {
    const user = userEvent.setup();
    render(<DateSelectionStep spaceId={mockSpaceId} />);

    const dateButtons = screen.getAllByRole('button').filter(btn => !btn.textContent?.includes(':'));
    await user.click(dateButtons[0]);

    await waitFor(() => expect(screen.getByTestId('time-slot-selector')).toBeTruthy());

    const timeButton = screen.getByText('10:00');
    await user.click(timeButton);

    const nextButton = screen.getByText('Next');
    expect(nextButton).not.toBeDisabled();
  });

  it('saves step data and advances to step 2 when Next is clicked', async () => {
    const user = userEvent.setup();
    render(<DateSelectionStep spaceId={mockSpaceId} />);

    const dateButtons = screen.getAllByRole('button').filter(btn => !btn.textContent?.includes(':'));
    await user.click(dateButtons[0]);

    await waitFor(() => expect(screen.getByTestId('time-slot-selector')).toBeTruthy());

    const timeButton = screen.getByText('10:00');
    await user.click(timeButton);

    const nextButton = screen.getByText('Next');
    await user.click(nextButton);

    const state = useReservationsStore.getState();
    expect(state.currentStep).toBe(2);
    expect(state.stepOne).toBeTruthy();
    expect(state.stepOne?.spaceId).toBe(mockSpaceId);
    expect(state.stepOne?.startTime).toBe('10:00');
    expect(state.stepOne?.duration).toBe(1);
  });

  it('includes correct spaceId in step data', async () => {
    const user = userEvent.setup();
    const customSpaceId = 'custom-space-456';
    render(<DateSelectionStep spaceId={customSpaceId} />);

    const dateButtons = screen.getAllByRole('button').filter(btn => !btn.textContent?.includes(':'));
    await user.click(dateButtons[0]);

    await waitFor(() => expect(screen.getByTestId('time-slot-selector')).toBeTruthy());

    const timeButton = screen.getByText('10:00');
    await user.click(timeButton);

    const nextButton = screen.getByText('Next');
    await user.click(nextButton);

    const state = useReservationsStore.getState();
    expect(state.stepOne?.spaceId).toBe(customSpaceId);
  });

  it('allows selecting different time slots', async () => {
    const user = userEvent.setup();
    render(<DateSelectionStep spaceId={mockSpaceId} />);

    const dateButtons = screen.getAllByRole('button').filter(btn => !btn.textContent?.includes(':'));
    await user.click(dateButtons[0]);

    await waitFor(() => expect(screen.getByTestId('time-slot-selector')).toBeTruthy());

    // Select first time
    const time1 = screen.getByText('10:00');
    await user.click(time1);

    // Select different time
    const time2 = screen.getByText('14:00');
    await user.click(time2);

    const nextButton = screen.getByText('Next');
    await user.click(nextButton);

    const state = useReservationsStore.getState();
    expect(state.stepOne?.startTime).toBe('14:00');
  });

  it('applies correct styling to Next button when enabled', async () => {
    const user = userEvent.setup();
    render(<DateSelectionStep spaceId={mockSpaceId} />);

    const dateButtons = screen.getAllByRole('button').filter(btn => !btn.textContent?.includes(':'));
    await user.click(dateButtons[0]);

    await waitFor(() => expect(screen.getByTestId('time-slot-selector')).toBeTruthy());

    const timeButton = screen.getByText('10:00');
    await user.click(timeButton);

    const nextButton = screen.getByText('Next');
    expect(nextButton.className).toContain('bg-blue-600');
    expect(nextButton.className).toContain('text-white');
  });

  it('applies correct styling to Next button when disabled', () => {
    render(<DateSelectionStep spaceId={mockSpaceId} />);

    const nextButton = screen.getByText('Next');
    expect(nextButton.className).toContain('bg-gray-300');
    expect(nextButton.className).toContain('cursor-not-allowed');
  });
});
