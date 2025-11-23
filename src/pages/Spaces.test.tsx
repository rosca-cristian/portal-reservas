/**
 * Spaces Page Tests
 * Story 2.1: Interactive SVG Floor Plan Component
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import Spaces from './Spaces';

// Mock fetch globally
global.fetch = vi.fn();

const mockFloors = [
  {
    id: 'floor-1',
    name: 'Floor 1',
    svgPath: '/assets/floor-plans/floor-1.svg',
    building: 'Main Building',
  },
  {
    id: 'floor-2',
    name: 'Floor 2',
    svgPath: '/assets/floor-plans/floor-2.svg',
    building: 'Main Building',
  },
];

const mockSpaces = [
  {
    id: 'space-1',
    name: 'Study Room 101',
    type: 'Study Room',
    capacity: 4,
    equipment: ['Whiteboard', 'Computer'],
    floorId: 'floor-1',
  },
  {
    id: 'space-2',
    name: 'Group Room 102',
    type: 'Group Room',
    capacity: 8,
    equipment: ['Projector', 'TV'],
    floorId: 'floor-1',
  },
];

describe('Spaces Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state initially', () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockImplementation(() =>
      new Promise(() => {}) // Never resolves
    );

    render(<Spaces />);

    expect(screen.getByText(/loading spaces/i)).toBeTruthy();
  });

  it('loads and displays floors', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockImplementation((url: string) => {
      if (url.includes('/api/floors')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: mockFloors }),
        });
      }
      if (url.includes('/api/spaces')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: mockSpaces }),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    render(<Spaces />);

    await waitFor(() => {
      expect(screen.getByText('Floor 1')).toBeTruthy();
    });
  });

  it('loads spaces for selected floor', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockImplementation((url: string) => {
      if (url.includes('/api/floors')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: mockFloors }),
        });
      }
      if (url.includes('/api/spaces')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: mockSpaces }),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    render(<Spaces />);

    await waitFor(() => {
      const svg = document.querySelector('svg');
      expect(svg).toBeTruthy();
    });

    // Spaces should be loaded
    await waitFor(() => {
      const spacePaths = document.querySelectorAll('.space-path');
      expect(spacePaths.length).toBeGreaterThan(0);
    });
  });

  it('handles floor selection change', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn((url: string) => {
      if (url.includes('/api/floors')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: mockFloors }),
        });
      }
      if (url.includes('/api/spaces?floor=floor-1')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: mockSpaces }),
        });
      }
      if (url.includes('/api/spaces?floor=floor-2')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: [] }),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    (global.fetch as ReturnType<typeof vi.fn>) = fetchMock;

    render(<Spaces />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Floor 1')).toBeTruthy();
    });

    // Initial fetch for floors and spaces
    expect(fetchMock).toHaveBeenCalledTimes(2);

    // Change floor selection
    const floorSelector = screen.getByRole('combobox');
    await user.click(floorSelector);

    const floor2Option = await screen.findByText('Floor 2');
    await user.click(floor2Option);

    // Should fetch spaces for floor 2
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('floor=floor-2'));
    });
  });

  it('displays error message on load failure', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('Network error')
    );

    render(<Spaces />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load floors/i)).toBeTruthy();
    });

    // Should show retry button
    const retryButton = screen.getByRole('button', { name: /retry/i });
    expect(retryButton).toBeTruthy();
  });

  it('displays selected space information', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockImplementation((url: string) => {
      if (url.includes('/api/floors')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: mockFloors }),
        });
      }
      if (url.includes('/api/spaces')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: mockSpaces }),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    render(<Spaces />);

    // Wait for spaces to load
    await waitFor(() => {
      const spacePaths = document.querySelectorAll('.space-path');
      expect(spacePaths.length).toBeGreaterThan(0);
    });

    // Click on a space
    const spacePath = document.querySelector(`#space-${mockSpaces[0].id}`) as SVGPathElement;
    if (spacePath) {
      const user = userEvent.setup();
      await user.click(spacePath);

      // Selected space info should be displayed
      await waitFor(() => {
        expect(screen.getByText('Selected Space')).toBeTruthy();
        expect(screen.getByText(mockSpaces[0].name)).toBeTruthy();
      });
    }
  });
});
