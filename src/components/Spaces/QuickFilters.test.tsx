/**
 * QuickFilters Component Tests
 * Story 2.4: Search Bar with Quick Filters
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { QuickFilters } from './QuickFilters';

describe('QuickFilters', () => {
  it('renders all space type filters', () => {
    const mockTypeToggle = vi.fn();
    const mockEquipmentToggle = vi.fn();

    render(
      <QuickFilters
        selectedTypes={[]}
        selectedEquipment={[]}
        onTypeToggle={mockTypeToggle}
        onEquipmentToggle={mockEquipmentToggle}
      />
    );

    expect(screen.getByText('Individual Desk')).toBeTruthy();
    expect(screen.getByText('Group Room')).toBeTruthy();
    expect(screen.getByText('Meeting Room')).toBeTruthy();
    expect(screen.getByText('Study Room')).toBeTruthy();
  });

  it('renders all equipment filters', () => {
    const mockTypeToggle = vi.fn();
    const mockEquipmentToggle = vi.fn();

    render(
      <QuickFilters
        selectedTypes={[]}
        selectedEquipment={[]}
        onTypeToggle={mockTypeToggle}
        onEquipmentToggle={mockEquipmentToggle}
      />
    );

    expect(screen.getByText('Computer')).toBeTruthy();
    expect(screen.getByText('Whiteboard')).toBeTruthy();
    expect(screen.getByText('Projector')).toBeTruthy();
    expect(screen.getByText('Monitor')).toBeTruthy();
  });

  it('calls onTypeToggle when type chip is clicked', async () => {
    const user = userEvent.setup();
    const mockTypeToggle = vi.fn();
    const mockEquipmentToggle = vi.fn();

    render(
      <QuickFilters
        selectedTypes={[]}
        selectedEquipment={[]}
        onTypeToggle={mockTypeToggle}
        onEquipmentToggle={mockEquipmentToggle}
      />
    );

    const groupRoomButton = screen.getByText('Group Room');
    await user.click(groupRoomButton);

    expect(mockTypeToggle).toHaveBeenCalledWith('Group Room');
  });

  it('calls onEquipmentToggle when equipment chip is clicked', async () => {
    const user = userEvent.setup();
    const mockTypeToggle = vi.fn();
    const mockEquipmentToggle = vi.fn();

    render(
      <QuickFilters
        selectedTypes={[]}
        selectedEquipment={[]}
        onTypeToggle={mockTypeToggle}
        onEquipmentToggle={mockEquipmentToggle}
      />
    );

    const computerButton = screen.getByText('Computer');
    await user.click(computerButton);

    expect(mockEquipmentToggle).toHaveBeenCalledWith('Computer');
  });

  it('highlights selected type chips', () => {
    const mockTypeToggle = vi.fn();
    const mockEquipmentToggle = vi.fn();

    render(
      <QuickFilters
        selectedTypes={['Group Room']}
        selectedEquipment={[]}
        onTypeToggle={mockTypeToggle}
        onEquipmentToggle={mockEquipmentToggle}
      />
    );

    const groupRoomButton = screen.getByText('Group Room').closest('button');
    expect(groupRoomButton?.classList.contains('bg-blue-500')).toBe(true);
  });

  it('highlights selected equipment chips', () => {
    const mockTypeToggle = vi.fn();
    const mockEquipmentToggle = vi.fn();

    render(
      <QuickFilters
        selectedTypes={[]}
        selectedEquipment={['Computer', 'Whiteboard']}
        onTypeToggle={mockTypeToggle}
        onEquipmentToggle={mockEquipmentToggle}
      />
    );

    const computerButton = screen.getByText('Computer').closest('button');
    const whiteboardButton = screen.getByText('Whiteboard').closest('button');

    expect(computerButton?.classList.contains('bg-green-500')).toBe(true);
    expect(whiteboardButton?.classList.contains('bg-green-500')).toBe(true);
  });
});
