/**
 * SpaceCard Component Tests
 * Story 2.3: Space Card Component and Grid View
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { SpaceCard } from './SpaceCard';
import type { Space } from '@/types/space';
import type { SpaceAvailability } from '@/types/availability';

const mockSpace: Space = {
  id: 'space-1',
  name: 'Study Room 101',
  type: 'Study Room',
  capacity: 4,
  equipment: ['Whiteboard', 'Computer', 'Monitor'],
  floorId: 'floor-1',
  description: 'A quiet study room with modern equipment',
  photos: ['/photo1.jpg', '/photo2.jpg'],
};

const mockAvailability: SpaceAvailability = {
  spaceId: 'space-1',
  status: 'AVAILABLE',
};

describe('SpaceCard', () => {
  it('renders space information', () => {
    render(<SpaceCard space={mockSpace} />);

    expect(screen.getByText('Study Room 101')).toBeTruthy();
    expect(screen.getByText('Study Room')).toBeTruthy();
    expect(screen.getByText('4')).toBeTruthy();
  });

  it('displays availability badge when provided', () => {
    render(<SpaceCard space={mockSpace} availability={mockAvailability} />);

    expect(screen.getByText(/available/i)).toBeTruthy();
  });

  it('shows description if available', () => {
    render(<SpaceCard space={mockSpace} />);

    expect(screen.getByText(/quiet study room/i)).toBeTruthy();
  });

  it('calls onClick handler when card is clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<SpaceCard space={mockSpace} onClick={handleClick} />);

    const card = screen.getByText('Study Room 101').closest('.space-card');
    if (card) {
      await user.click(card);
      expect(handleClick).toHaveBeenCalledWith(mockSpace);
    }
  });

  it('displays equipment icons', () => {
    const { container } = render(<SpaceCard space={mockSpace} />);

    // Equipment icons should be rendered
    const equipmentIcons = container.querySelectorAll('.group.relative.inline-flex');
    expect(equipmentIcons.length).toBeGreaterThan(0);
  });

  it('shows photo carousel navigation on hover', async () => {
    const user = userEvent.setup();
    const { container } = render(<SpaceCard space={mockSpace} />);

    const card = container.querySelector('.space-card');
    if (card) {
      await user.hover(card);

      // Navigation arrows should appear
      const prevButton = screen.getByLabelText(/previous photo/i);
      const nextButton = screen.getByLabelText(/next photo/i);

      expect(prevButton).toBeTruthy();
      expect(nextButton).toBeTruthy();
    }
  });
});
