/**
 * AdvancedFilters Component Tests
 * Story 2.5: Advanced Filter Panel
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { AdvancedFilters } from './AdvancedFilters';

describe('AdvancedFilters', () => {
  const defaultProps = {
    availableNow: false,
    minCapacity: 1,
    maxCapacity: null,
    requiredEquipment: [],
    onAvailableNowChange: vi.fn(),
    onMinCapacityChange: vi.fn(),
    onMaxCapacityChange: vi.fn(),
    onRequiredEquipmentToggle: vi.fn(),
  };

  it('renders collapsed by default', () => {
    render(<AdvancedFilters {...defaultProps} />);

    expect(screen.getByText('Advanced Filters')).toBeTruthy();
    // Content should not be visible
    expect(screen.queryByText('Show only available now')).toBeNull();
  });

  it('expands when clicked', async () => {
    const user = userEvent.setup();
    render(<AdvancedFilters {...defaultProps} />);

    const header = screen.getByText('Advanced Filters');
    await user.click(header);

    // Content should now be visible
    expect(screen.getByText('Show only available now')).toBeTruthy();
    expect(screen.getByText('Minimum Capacity')).toBeTruthy();
    expect(screen.getByText('Required Equipment')).toBeTruthy();
  });

  it('collapses when clicked again', async () => {
    const user = userEvent.setup();
    render(<AdvancedFilters {...defaultProps} />);

    const header = screen.getByText('Advanced Filters');

    // Expand
    await user.click(header);
    expect(screen.getByText('Show only available now')).toBeTruthy();

    // Collapse
    await user.click(header);
    expect(screen.queryByText('Show only available now')).toBeNull();
  });

  it('calls onAvailableNowChange when checkbox is toggled', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();

    render(<AdvancedFilters {...defaultProps} onAvailableNowChange={mockOnChange} />);

    // Expand the panel
    await user.click(screen.getByText('Advanced Filters'));

    const checkbox = screen.getByRole('checkbox', { name: /show only available now/i });
    await user.click(checkbox);

    expect(mockOnChange).toHaveBeenCalledWith(true);
  });

  it('displays current availableNow state', async () => {
    const user = userEvent.setup();

    render(<AdvancedFilters {...defaultProps} availableNow={true} />);

    // Expand the panel
    await user.click(screen.getByText('Advanced Filters'));

    const checkbox = screen.getByRole('checkbox', { name: /show only available now/i }) as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it('calls onMinCapacityChange when slider is moved', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();

    render(<AdvancedFilters {...defaultProps} onMinCapacityChange={mockOnChange} />);

    // Expand the panel
    await user.click(screen.getByText('Advanced Filters'));

    const slider = screen.getByRole('slider', { name: /minimum capacity/i });

    // Use fireEvent for range inputs
    fireEvent.change(slider, { target: { value: '5' } });

    expect(mockOnChange).toHaveBeenCalledWith(5);
  });

  it('displays current minCapacity value', async () => {
    const user = userEvent.setup();

    render(<AdvancedFilters {...defaultProps} minCapacity={8} />);

    // Expand the panel
    await user.click(screen.getByText('Advanced Filters'));

    expect(screen.getByText('8 people')).toBeTruthy();
  });

  it('displays singular "person" for capacity of 1', async () => {
    const user = userEvent.setup();

    render(<AdvancedFilters {...defaultProps} minCapacity={1} />);

    // Expand the panel
    await user.click(screen.getByText('Advanced Filters'));

    expect(screen.getByText('1 person')).toBeTruthy();
  });

  it('renders all equipment options', async () => {
    const user = userEvent.setup();

    render(<AdvancedFilters {...defaultProps} />);

    // Expand the panel
    await user.click(screen.getByText('Advanced Filters'));

    // Check for all equipment options
    expect(screen.getByText('Computer')).toBeTruthy();
    expect(screen.getByText('Whiteboard')).toBeTruthy();
    expect(screen.getByText('Projector')).toBeTruthy();
    expect(screen.getByText('Monitor')).toBeTruthy();
    expect(screen.getByText('TV')).toBeTruthy();
    expect(screen.getByText('HDMI Cable')).toBeTruthy();
    expect(screen.getByText('Desk Lamp')).toBeTruthy();
    expect(screen.getByText('USB Hub')).toBeTruthy();
  });

  it('calls onRequiredEquipmentToggle when equipment is clicked', async () => {
    const user = userEvent.setup();
    const mockToggle = vi.fn();

    render(<AdvancedFilters {...defaultProps} onRequiredEquipmentToggle={mockToggle} />);

    // Expand the panel
    await user.click(screen.getByText('Advanced Filters'));

    const computerCheckbox = screen.getByLabelText('Computer');
    await user.click(computerCheckbox);

    expect(mockToggle).toHaveBeenCalledWith('Computer');
  });

  it('displays selected equipment as checked', async () => {
    const user = userEvent.setup();

    render(<AdvancedFilters {...defaultProps} requiredEquipment={['Computer', 'Whiteboard']} />);

    // Expand the panel
    await user.click(screen.getByText('Advanced Filters'));

    const computerCheckbox = screen.getByLabelText('Computer') as HTMLInputElement;
    const whiteboardCheckbox = screen.getByLabelText('Whiteboard') as HTMLInputElement;
    const projectorCheckbox = screen.getByLabelText('Projector') as HTMLInputElement;

    expect(computerCheckbox.checked).toBe(true);
    expect(whiteboardCheckbox.checked).toBe(true);
    expect(projectorCheckbox.checked).toBe(false);
  });

  it('renders equipment options in a grid layout', async () => {
    const user = userEvent.setup();
    const { container } = render(<AdvancedFilters {...defaultProps} />);

    // Expand the panel
    await user.click(screen.getByText('Advanced Filters'));

    const equipmentGrid = container.querySelector('.grid.grid-cols-2');
    expect(equipmentGrid).toBeTruthy();
  });
});
