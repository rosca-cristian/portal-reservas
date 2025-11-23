/**
 * useAvailability Hook Tests
 * Story 2.2: Real-Time Availability Overlay
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAvailability } from './useAvailability';

// Mock fetch globally
global.fetch = vi.fn();

describe('useAvailability Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('fetches availability data on mount', async () => {
    const mockDatetime = new Date('2025-01-15T14:00:00');
    const mockResponse = {
      data: {
        datetime: mockDatetime.toISOString(),
        spaces: [
          {
            spaceId: 'space-1',
            status: 'AVAILABLE',
          },
          {
            spaceId: 'space-2',
            status: 'OCCUPIED',
            nextAvailable: '2025-01-15T16:00:00',
          },
        ],
      },
    };

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const { result } = renderHook(() => useAvailability(mockDatetime));

    // Initially loading
    expect(result.current.loading).toBe(true);

    // Wait for fetch to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Check availability map
    expect(result.current.availability.size).toBe(2);
    expect(result.current.availability.get('space-1')?.status).toBe('AVAILABLE');
    expect(result.current.availability.get('space-2')?.status).toBe('OCCUPIED');
    expect(result.current.error).toBeNull();
  });

  it('handles fetch errors gracefully', async () => {
    const mockDatetime = new Date('2025-01-15T14:00:00');

    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error('Network error')
    );

    const { result } = renderHook(() => useAvailability(mockDatetime));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to load availability data');
    expect(result.current.availability.size).toBe(0);
  });

  it('polls for updates every 10 seconds', async () => {
    const mockDatetime = new Date('2025-01-15T14:00:00');
    const mockResponse = {
      data: {
        datetime: mockDatetime.toISOString(),
        spaces: [{ spaceId: 'space-1', status: 'AVAILABLE' }],
      },
    };

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    renderHook(() => useAvailability(mockDatetime));

    // Initial fetch
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    // Advance time by 10 seconds
    vi.advanceTimersByTime(10000);

    // Should poll again
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    // Advance time by another 10 seconds
    vi.advanceTimersByTime(10000);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });
  });

  it('refetches when datetime changes', async () => {
    const mockResponse = (datetime: Date) => ({
      data: {
        datetime: datetime.toISOString(),
        spaces: [{ spaceId: 'space-1', status: 'AVAILABLE' }],
      },
    });

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => mockResponse(new Date()),
    } as Response);

    const { rerender } = renderHook(({ datetime }) => useAvailability(datetime), {
      initialProps: { datetime: new Date('2025-01-15T14:00:00') },
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    // Change datetime
    rerender({ datetime: new Date('2025-01-15T16:00:00') });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  it('provides refetch function', async () => {
    const mockDatetime = new Date('2025-01-15T14:00:00');
    const mockResponse = {
      data: {
        datetime: mockDatetime.toISOString(),
        spaces: [{ spaceId: 'space-1', status: 'AVAILABLE' }],
      },
    };

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const { result } = renderHook(() => useAvailability(mockDatetime));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    // Manual refetch
    result.current.refetch();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });
});
