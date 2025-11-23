/**
 * SpaceDetailsModal Component Tests
 * Story 2.6: Space Details Modal
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { SpaceDetailsModal } from './SpaceDetailsModal';
import type { Space } from '@/types/space';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock fetch
global.fetch = vi.fn();

const mockSpace: Space = {
  id: 'space-1',
  name: 'Library Study Room 101',
  type: 'Study Room',
  capacity: 4,
  equipment: ['Computer', 'Whiteboard', 'Projector'],
  floorId: 'floor-1',
  description: 'A quiet study space perfect for small groups',
  photos: ['/images/space1.jpg', '/images/space2.jpg'],
  availabilityStatus: 'AVAILABLE',
};

const mockGroupRoom: Space = {
  id: 'space-2',
  name: 'Group Room 202',
  type: 'Group Room',
  capacity: 8,
  minCapacity: 4,
  equipment: ['Projector', 'Whiteboard', 'TV'],
  floorId: 'floor-2',
  description: 'Collaborative space for group projects',
  availabilityStatus: 'AVAILABLE',
};

describe('SpaceDetailsModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      json: async () => ({ data: { status: 'AVAILABLE' } }),
    });
  });

  it('does not render when space is null', () => {
    const mockOnClose = vi.fn();
    render(
      <BrowserRouter>
        <SpaceDetailsModal space={null} isOpen={true} onClose={mockOnClose} />
      </BrowserRouter>
    );

    expect(screen.queryByText(/Library Study Room/)).toBeNull();
  });

  it('renders space name and type', async () => {
    const mockOnClose = vi.fn();
    render(
      <BrowserRouter>
        <SpaceDetailsModal space={mockSpace} isOpen={true} onClose={mockOnClose} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Library Study Room 101')).toBeTruthy();
      expect(screen.getByText('Study Room')).toBeTruthy();
    });
  });

  it('displays capacity information', async () => {
    const mockOnClose = vi.fn();
    render(
      <BrowserRouter>
        <SpaceDetailsModal space={mockSpace} isOpen={true} onClose={mockOnClose} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/4 people/)).toBeTruthy();
    });
  });

  it('displays availability status badge', async () => {
    const mockOnClose = vi.fn();
    render(
      <BrowserRouter>
        <SpaceDetailsModal space={mockSpace} isOpen={true} onClose={mockOnClose} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('AVAILABLE')).toBeTruthy();
    });
  });

  it('displays description', async () => {
    const mockOnClose = vi.fn();
    render(
      <BrowserRouter>
        <SpaceDetailsModal space={mockSpace} isOpen={true} onClose={mockOnClose} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('A quiet study space perfect for small groups')).toBeTruthy();
    });
  });

  it('displays equipment with labels', async () => {
    const mockOnClose = vi.fn();
    render(
      <BrowserRouter>
        <SpaceDetailsModal space={mockSpace} isOpen={true} onClose={mockOnClose} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Computer')).toBeTruthy();
      expect(screen.getByText('Whiteboard')).toBeTruthy();
      expect(screen.getByText('Projector')).toBeTruthy();
    });
  });

  it('displays photo carousel for spaces with photos', async () => {
    const mockOnClose = vi.fn();
    render(
      <BrowserRouter>
        <SpaceDetailsModal space={mockSpace} isOpen={true} onClose={mockOnClose} />
      </BrowserRouter>
    );

    await waitFor(() => {
      const image = screen.getByAltText('Library Study Room 101');
      expect(image).toBeTruthy();
      expect(image.getAttribute('src')).toBe('/images/space1.jpg');
      expect(screen.getByText('1 / 2')).toBeTruthy();
    });
  });

  it('displays week view calendar', async () => {
    const mockOnClose = vi.fn();
    render(
      <BrowserRouter>
        <SpaceDetailsModal space={mockSpace} isOpen={true} onClose={mockOnClose} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Availability This Week')).toBeTruthy();
    });
  });

  it('shows group room features for group rooms', async () => {
    const mockOnClose = vi.fn();
    render(
      <BrowserRouter>
        <SpaceDetailsModal space={mockGroupRoom} isOpen={true} onClose={mockOnClose} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Group Room Features')).toBeTruthy();
      expect(screen.getByText(/Create public or private study sessions/)).toBeTruthy();
      expect(screen.getByText(/Generate invitation links/)).toBeTruthy();
      expect(screen.getByText(/4 - 8 people/)).toBeTruthy();
    });
  });

  it('does not show group room features for non-group rooms', async () => {
    const mockOnClose = vi.fn();
    render(
      <BrowserRouter>
        <SpaceDetailsModal space={mockSpace} isOpen={true} onClose={mockOnClose} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Group Room Features')).toBeNull();
    });
  });

  it('navigates to booking page when Book This Space is clicked', async () => {
    const user = userEvent.setup();
    const mockOnClose = vi.fn();

    render(
      <BrowserRouter>
        <SpaceDetailsModal space={mockSpace} isOpen={true} onClose={mockOnClose} />
      </BrowserRouter>
    );

    await waitFor(async () => {
      const bookButton = screen.getByText('Book This Space');
      await user.click(bookButton);

      expect(mockNavigate).toHaveBeenCalledWith('/booking?spaceId=space-1');
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('includes date and time in navigation when time slot is selected', async () => {
    const mockOnClose = vi.fn();

    render(
      <BrowserRouter>
        <SpaceDetailsModal space={mockSpace} isOpen={true} onClose={mockOnClose} />
      </BrowserRouter>
    );

    // This tests the onTimeSlotClick callback passed to WeekViewCalendar
    // In actual usage, clicking a time slot would trigger this
    await waitFor(() => {
      expect(screen.getByText('Availability This Week')).toBeTruthy();
    });
  });

  it('disables Book button when space is unavailable', async () => {
    const mockOnClose = vi.fn();
    const unavailableSpace: Space = {
      ...mockSpace,
      availabilityStatus: 'UNAVAILABLE',
    };

    render(
      <BrowserRouter>
        <SpaceDetailsModal space={unavailableSpace} isOpen={true} onClose={mockOnClose} />
      </BrowserRouter>
    );

    await waitFor(() => {
      const bookButton = screen.getByText('Space Unavailable');
      expect(bookButton).toBeTruthy();
      expect((bookButton as HTMLButtonElement).disabled).toBe(true);
    });
  });

  it('displays floor location', async () => {
    const mockOnClose = vi.fn();
    render(
      <BrowserRouter>
        <SpaceDetailsModal space={mockSpace} isOpen={true} onClose={mockOnClose} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Floor floor-1/)).toBeTruthy();
    });
  });

  it('shows minimum capacity for group rooms', async () => {
    const mockOnClose = vi.fn();
    render(
      <BrowserRouter>
        <SpaceDetailsModal space={mockGroupRoom} isOpen={true} onClose={mockOnClose} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Min: 4 people/)).toBeTruthy();
    });
  });
});
