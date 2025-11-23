import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useReservationsStore } from '../../stores/reservationsStore';
import GroupSizeInput from './GroupSizeInput';

describe('GroupSizeInput', () => {
  beforeEach(() => {
    useReservationsStore.getState().resetWizard();
  });

  it('renders with default value equal to minimum capacity', () => {
    render(<GroupSizeInput minCapacity={4} maxCapacity={10} />);

    const input = screen.getByLabelText(/group size/i);
    expect(input).toHaveValue(4);
  });

  it('displays capacity range', () => {
    render(<GroupSizeInput minCapacity={4} maxCapacity={10} />);

    expect(screen.getByText(/capacity: 4-10 participants/i)).toBeInTheDocument();
  });

  it('shows error when group size is below minimum', async () => {
    const user = userEvent.setup();
    render(<GroupSizeInput minCapacity={4} maxCapacity={10} />);

    const input = screen.getByLabelText(/group size/i);
    await user.clear(input);
    await user.type(input, '2');

    expect(screen.getByText(/this room requires at least 4 participants/i)).toBeInTheDocument();
  });

  it('shows error when group size exceeds maximum', async () => {
    const user = userEvent.setup();
    render(<GroupSizeInput minCapacity={4} maxCapacity={10} />);

    const input = screen.getByLabelText(/group size/i);
    await user.clear(input);
    await user.type(input, '12');

    expect(screen.getByText(/this room can accommodate maximum 10 participants/i)).toBeInTheDocument();
  });

  it('updates store when valid value is entered', async () => {
    const user = userEvent.setup();
    render(<GroupSizeInput minCapacity={4} maxCapacity={10} />);

    const input = screen.getByLabelText(/group size/i);
    await user.clear(input);
    await user.type(input, '6');

    expect(useReservationsStore.getState().wizard.groupSize).toBe(6);
  });

  it('does not show error for valid group size', () => {
    useReservationsStore.getState().setGroupSize(6);
    render(<GroupSizeInput minCapacity={4} maxCapacity={10} />);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
