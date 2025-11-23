/**
 * SpacesGrid Component Tests
 * Story 2.3: Space Card Component and Grid View
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SpacesGrid } from './SpacesGrid';
import type { Space } from '@/types/space';

const mockSpaces: Space[] = [
  {
    id: 'space-1',
    name: 'Study Room 101',
    type: 'Study Room',
    capacity: 4,
    equipment: ['Whiteboard'],
    floorId: 'floor-1',
  },
  {
    id: 'space-2',
    name: 'Group Room 102',
    type: 'Group Room',
    capacity: 8,
    equipment: ['Projector'],
    floorId: 'floor-1',
  },
];

describe('SpacesGrid', () => {
  it('renders all space cards', () => {
    render(<SpacesGrid spaces={mockSpaces} />);

    expect(screen.getByText('Study Room 101')).toBeTruthy();
    expect(screen.getByText('Group Room 102')).toBeTruthy();
  });

  it('shows loading skeletons when loading', () => {
    const { container } = render(<SpacesGrid spaces={[]} loading={true} />);

    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('shows empty state when no spaces', () => {
    render(<SpacesGrid spaces={[]} />);

    expect(screen.getByText(/no spaces found/i)).toBeTruthy();
  });

  it('uses responsive grid layout', () => {
    const { container } = render(<SpacesGrid spaces={mockSpaces} />);

    const grid = container.querySelector('.grid');
    expect(grid?.classList.contains('grid-cols-1')).toBe(true);
    expect(grid?.classList.contains('md:grid-cols-2')).toBe(true);
    expect(grid?.classList.contains('lg:grid-cols-3')).toBe(true);
    expect(grid?.classList.contains('xl:grid-cols-4')).toBe(true);
  });
});
