/**
 * DateTimePicker Component Tests
 * Story 2.2: Real-Time Availability Overlay
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { DateTimePicker } from './DateTimePicker';

describe('DateTimePicker', () => {
  it('renders date and time inputs', () => {
    const mockOnChange = vi.fn();
    const testDate = new Date('2025-01-15T14:30:00');

    render(<DateTimePicker value={testDate} onChange={mockOnChange} />);

    expect(screen.getByLabelText(/date/i)).toBeTruthy();
    expect(screen.getByLabelText(/time/i)).toBeTruthy();
  });

  it('displays the correct date and time values', () => {
    const mockOnChange = vi.fn();
    const testDate = new Date('2025-01-15T14:30:00');

    render(<DateTimePicker value={testDate} onChange={mockOnChange} />);

    const dateInput = screen.getByLabelText(/date/i) as HTMLInputElement;
    const timeSelect = screen.getByLabelText(/time/i) as HTMLSelectElement;

    expect(dateInput.value).toBe('2025-01-15');
    expect(timeSelect.value).toBe('14:30');
  });

  it('calls onChange when date is changed', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    const testDate = new Date('2025-01-15T14:30:00');

    render(<DateTimePicker value={testDate} onChange={mockOnChange} />);

    const dateInput = screen.getByLabelText(/date/i) as HTMLInputElement;

    await user.clear(dateInput);
    await user.type(dateInput, '2025-01-16');

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('calls onChange when time is changed', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    const testDate = new Date('2025-01-15T14:30:00');

    render(<DateTimePicker value={testDate} onChange={mockOnChange} />);

    const timeSelect = screen.getByLabelText(/time/i) as HTMLSelectElement;

    await user.selectOptions(timeSelect, '16:00');

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('shows current datetime display', () => {
    const mockOnChange = vi.fn();
    const testDate = new Date('2025-01-15T14:30:00');

    render(<DateTimePicker value={testDate} onChange={mockOnChange} />);

    expect(screen.getByText(/showing availability for/i)).toBeTruthy();
  });

  it('respects maxDaysAhead limit', () => {
    const mockOnChange = vi.fn();
    const testDate = new Date();
    const maxDays = 7;

    render(
      <DateTimePicker value={testDate} onChange={mockOnChange} maxDaysAhead={maxDays} />
    );

    const dateInput = screen.getByLabelText(/date/i) as HTMLInputElement;

    // Calculate expected max date
    const maxDate = new Date(testDate);
    maxDate.setDate(maxDate.getDate() + maxDays);
    const maxDateStr = maxDate.toISOString().split('T')[0];

    expect(dateInput.max).toBe(maxDateStr);
  });
});
