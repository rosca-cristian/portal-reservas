/**
 * TimeSlotSelector Component Tests
 * Story 3.1: Booking Wizard - Date and Time Selection
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import TimeSlotSelector from './TimeSlotSelector';

// Mock useAvailability hook
vi.mock('../../../hooks/useAvailability', () => ({
  useAvailability: vi.fn(),
}));

import { useAvailability } from '../../../hooks/useAvailability';

describe('TimeSlotSelector', () => {
  const mockOnTimeSelect = vi.fn();
  const mockDate = new Date('2025-01-15T00:00:00.000Z');
  const mockSpaceId = 'space-123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    vi.mocked(useAvailability).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(
      <TimeSlotSelector
        spaceId={mockSpaceId}
        date={mockDate}
        selectedTime={null}
        onTimeSelect={mockOnTimeSelect}
      />
    );

    expect(screen.getByText('Loading availability...')).toBeTruthy();
  });

  it('renders all time slots from 7 AM to 10 PM', async () => {
    vi.mocked(useAvailability).mockReturnValue({
      data: { occupiedSlots: [] },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(
      <TimeSlotSelector
        spaceId={mockSpaceId}
        date={mockDate}
        selectedTime={null}
        onTimeSelect={mockOnTimeSelect}
      />
    );

    // Should render 15 slots (7:00 to 21:00)
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(15);

    // Check first and last slots
    expect(screen.getByText('07:00')).toBeTruthy();
    expect(screen.getByText('21:00')).toBeTruthy();
  });

  it('marks occupied slots as disabled', () => {
    vi.mocked(useAvailability).mockReturnValue({
      data: { occupiedSlots: ['09:00', '10:00', '14:00'] },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(
      <TimeSlotSelector
        spaceId={mockSpaceId}
        date={mockDate}
        selectedTime={null}
        onTimeSelect={mockOnTimeSelect}
      />
    );

    // Check that occupied slots are disabled
    const slot9am = screen.getByText('09:00').closest('button');
    expect(slot9am?.disabled).toBe(true);
    expect(screen.getAllByText('Occupied')).toHaveLength(3);
  });

  it('allows selecting available time slots', async () => {
    const user = userEvent.setup();

    vi.mocked(useAvailability).mockReturnValue({
      data: { occupiedSlots: ['09:00'] },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(
      <TimeSlotSelector
        spaceId={mockSpaceId}
        date={mockDate}
        selectedTime={null}
        onTimeSelect={mockOnTimeSelect}
      />
    );

    const availableSlot = screen.getByText('10:00').closest('button');
    await user.click(availableSlot!);

    expect(mockOnTimeSelect).toHaveBeenCalledWith('10:00');
  });

  it('prevents selecting occupied time slots', async () => {
    const user = userEvent.setup();

    vi.mocked(useAvailability).mockReturnValue({
      data: { occupiedSlots: ['10:00'] },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(
      <TimeSlotSelector
        spaceId={mockSpaceId}
        date={mockDate}
        selectedTime={null}
        onTimeSelect={mockOnTimeSelect}
      />
    );

    const occupiedSlot = screen.getByText('10:00').closest('button');
    await user.click(occupiedSlot!);

    expect(mockOnTimeSelect).not.toHaveBeenCalled();
  });

  it('highlights selected time slot', () => {
    vi.mocked(useAvailability).mockReturnValue({
      data: { occupiedSlots: [] },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(
      <TimeSlotSelector
        spaceId={mockSpaceId}
        date={mockDate}
        selectedTime="10:00"
        onTimeSelect={mockOnTimeSelect}
      />
    );

    const selectedSlot = screen.getByText('10:00').closest('button');
    expect(selectedSlot?.className).toContain('bg-blue-600');
    expect(selectedSlot?.className).toContain('text-white');
  });

  it('handles empty availability data', () => {
    vi.mocked(useAvailability).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(
      <TimeSlotSelector
        spaceId={mockSpaceId}
        date={mockDate}
        selectedTime={null}
        onTimeSelect={mockOnTimeSelect}
      />
    );

    // All slots should be available
    const buttons = screen.getAllByRole('button');
    const disabledButtons = buttons.filter(btn => btn.hasAttribute('disabled'));
    expect(disabledButtons).toHaveLength(0);
  });

  it('displays time in correct format', () => {
    vi.mocked(useAvailability).mockReturnValue({
      data: { occupiedSlots: [] },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(
      <TimeSlotSelector
        spaceId={mockSpaceId}
        date={mockDate}
        selectedTime={null}
        onTimeSelect={mockOnTimeSelect}
      />
    );

    // Check single-digit hours have leading zero
    expect(screen.getByText('07:00')).toBeTruthy();
    expect(screen.getByText('08:00')).toBeTruthy();
    expect(screen.getByText('09:00')).toBeTruthy();
  });

  it('applies correct styling for available slots', () => {
    vi.mocked(useAvailability).mockReturnValue({
      data: { occupiedSlots: [] },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(
      <TimeSlotSelector
        spaceId={mockSpaceId}
        date={mockDate}
        selectedTime={null}
        onTimeSelect={mockOnTimeSelect}
      />
    );

    const availableSlot = screen.getByText('10:00').closest('button');
    expect(availableSlot?.className).toContain('border-gray-300');
    expect(availableSlot?.className).toContain('hover:border-blue-400');
  });

  it('applies correct styling for occupied slots', () => {
    vi.mocked(useAvailability).mockReturnValue({
      data: { occupiedSlots: ['10:00'] },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    render(
      <TimeSlotSelector
        spaceId={mockSpaceId}
        date={mockDate}
        selectedTime={null}
        onTimeSelect={mockOnTimeSelect}
      />
    );

    const occupiedSlot = screen.getByText('10:00').closest('button');
    expect(occupiedSlot?.className).toContain('bg-gray-100');
    expect(occupiedSlot?.className).toContain('text-gray-400');
    expect(occupiedSlot?.className).toContain('cursor-not-allowed');
  });
});
