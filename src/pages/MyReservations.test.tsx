/**
 * MyReservations Page Tests
 * Story 3.4: My Reservations Dashboard
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyReservations from './MyReservations';
import apiClient from '../lib/api/client';
import type { ReactNode } from 'react';

// Mock API client
vi.mock('../lib/api/client');

// Mock useReservationsStore
vi.mock('../features/reservations/stores/reservationsStore', () => ({
  useReservationsStore: () => ({
    removeReservation: vi.fn(),
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const mockUpcomingReservations = [
  {
    id: 'reservation-1',
    spaceId: 'space-123',
    startTime: '2025-12-25T10:00:00.000Z',
    endTime: '2025-12-25T12:00:00.000Z',
    status: 'confirmed' as const,
    notes: 'Team meeting',
    createdAt: '2025-01-10T08:00:00.000Z',
  },
  {
    id: 'reservation-2',
    spaceId: 'space-456',
    startTime: '2025-12-26T14:00:00.000Z',
    endTime: '2025-12-26T16:00:00.000Z',
    status: 'confirmed' as const,
    createdAt: '2025-01-10T09:00:00.000Z',
  },
];

const mockPastReservations = [
  {
    id: 'reservation-3',
    spaceId: 'space-789',
    startTime: '2024-01-10T10:00:00.000Z',
    endTime: '2024-01-10T12:00:00.000Z',
    status: 'completed' as const,
    createdAt: '2024-01-05T08:00:00.000Z',
  },
];

describe('MyReservations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays loading state initially', () => {
    vi.mocked(apiClient.get).mockImplementation(() => new Promise(() => {}));

    const wrapper = createWrapper();
    render(<MyReservations />, { wrapper });

    expect(screen.getByText('Loading reservations...')).toBeTruthy();
  });

  it('displays page title', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: { data: [] },
    });

    const wrapper = createWrapper();
    render(<MyReservations />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('My Reservations')).toBeTruthy();
    });
  });

  it('displays upcoming and past tabs', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: { data: [] },
    });

    const wrapper = createWrapper();
    render(<MyReservations />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/Upcoming/)).toBeTruthy();
      expect(screen.getByText(/Past/)).toBeTruthy();
    });
  });

  it('displays count of upcoming reservations in tab', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: { data: mockUpcomingReservations },
    });

    const wrapper = createWrapper();
    render(<MyReservations />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/Upcoming \(2\)/)).toBeTruthy();
    });
  });

  it('displays count of past reservations in tab', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: { data: [...mockUpcomingReservations, ...mockPastReservations] },
    });

    const wrapper = createWrapper();
    render(<MyReservations />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/Past \(1\)/)).toBeTruthy();
    });
  });

  it('shows upcoming reservations by default', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: { data: mockUpcomingReservations },
    });

    const wrapper = createWrapper();
    render(<MyReservations />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('Space #space-12')).toBeTruthy();
      expect(screen.getByText('Team meeting')).toBeTruthy();
    });
  });

  it('switches to past reservations when Past tab is clicked', async () => {
    const user = userEvent.setup();

    vi.mocked(apiClient.get).mockResolvedValue({
      data: { data: [...mockUpcomingReservations, ...mockPastReservations] },
    });

    const wrapper = createWrapper();
    render(<MyReservations />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/Past \(1\)/)).toBeTruthy();
    });

    const pastTab = screen.getByText(/Past/);
    await user.click(pastTab);

    await waitFor(() => {
      expect(screen.getByText('Space #space-78')).toBeTruthy();
    });
  });

  it('displays empty state for upcoming reservations', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: { data: [] },
    });

    const wrapper = createWrapper();
    render(<MyReservations />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('No upcoming reservations')).toBeTruthy();
      expect(screen.getByText(/You don't have any upcoming reservations/)).toBeTruthy();
    });
  });

  it('displays Browse Spaces button in empty state', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: { data: [] },
    });

    const wrapper = createWrapper();
    render(<MyReservations />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('Browse Spaces')).toBeTruthy();
    });
  });

  it('does not show Browse Spaces button in past tab empty state', async () => {
    const user = userEvent.setup();

    vi.mocked(apiClient.get).mockResolvedValue({
      data: { data: [] },
    });

    const wrapper = createWrapper();
    render(<MyReservations />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/Past/)).toBeTruthy();
    });

    const pastTab = screen.getByText(/Past/);
    await user.click(pastTab);

    expect(screen.queryByText('Browse Spaces')).toBeNull();
  });

  it('displays reservation cards with correct information', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: { data: mockUpcomingReservations },
    });

    const wrapper = createWrapper();
    render(<MyReservations />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('Space #space-12')).toBeTruthy();
      expect(screen.getByText(/Thursday, December 25, 2025/)).toBeTruthy();
      expect(screen.getByText(/10:00 - 12:00/)).toBeTruthy();
      expect(screen.getByText('CONFIRMED')).toBeTruthy();
    });
  });

  it('displays notes when provided', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: { data: mockUpcomingReservations },
    });

    const wrapper = createWrapper();
    render(<MyReservations />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('Notes:')).toBeTruthy();
      expect(screen.getByText('Team meeting')).toBeTruthy();
    });
  });

  it('shows Cancel button for confirmed upcoming reservations', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: { data: mockUpcomingReservations },
    });

    const wrapper = createWrapper();
    render(<MyReservations />, { wrapper });

    await waitFor(() => {
      const cancelButtons = screen.getAllByText('Cancel');
      expect(cancelButtons.length).toBe(2);
    });
  });

  it('does not show Cancel button for past reservations', async () => {
    const user = userEvent.setup();

    vi.mocked(apiClient.get).mockResolvedValue({
      data: { data: [...mockUpcomingReservations, ...mockPastReservations] },
    });

    const wrapper = createWrapper();
    render(<MyReservations />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/Past/)).toBeTruthy();
    });

    const pastTab = screen.getByText(/Past/);
    await user.click(pastTab);

    await waitFor(() => {
      expect(screen.queryByText('Cancel')).toBeNull();
    });
  });

  it('prompts for confirmation when Cancel is clicked', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

    vi.mocked(apiClient.get).mockResolvedValue({
      data: { data: mockUpcomingReservations },
    });

    const wrapper = createWrapper();
    render(<MyReservations />, { wrapper });

    await waitFor(() => {
      expect(screen.getAllByText('Cancel')[0]).toBeTruthy();
    });

    const cancelButton = screen.getAllByText('Cancel')[0];
    await user.click(cancelButton);

    expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to cancel this reservation?');

    confirmSpy.mockRestore();
  });

  it('calls API to delete reservation when confirmed', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    vi.mocked(apiClient.get).mockResolvedValue({
      data: { data: mockUpcomingReservations },
    });
    vi.mocked(apiClient.delete).mockResolvedValue({});

    const wrapper = createWrapper();
    render(<MyReservations />, { wrapper });

    await waitFor(() => {
      expect(screen.getAllByText('Cancel')[0]).toBeTruthy();
    });

    const cancelButton = screen.getAllByText('Cancel')[0];
    await user.click(cancelButton);

    await waitFor(() => {
      expect(apiClient.delete).toHaveBeenCalledWith('/api/reservations/reservation-1');
    });

    confirmSpy.mockRestore();
  });

  it('displays status badges with correct styling', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: {
        data: [
          { ...mockUpcomingReservations[0], status: 'confirmed' },
          { ...mockUpcomingReservations[0], id: 'res-2', status: 'in_progress' },
        ],
      },
    });

    const wrapper = createWrapper();
    render(<MyReservations />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('CONFIRMED')).toBeTruthy();
      expect(screen.getByText('IN PROGRESS')).toBeTruthy();
    });
  });

  it('highlights active tab', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: { data: [] },
    });

    const wrapper = createWrapper();
    render(<MyReservations />, { wrapper });

    await waitFor(() => {
      const upcomingTab = screen.getByText(/Upcoming/).closest('button');
      expect(upcomingTab?.className).toContain('text-blue-600');
      expect(upcomingTab?.className).toContain('border-blue-600');
    });
  });

  it('applies hover effect to inactive tab', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: { data: [] },
    });

    const wrapper = createWrapper();
    render(<MyReservations />, { wrapper });

    await waitFor(() => {
      const pastTab = screen.getByText(/Past/).closest('button');
      expect(pastTab?.className).toContain('text-gray-600');
      expect(pastTab?.className).toContain('hover:text-gray-800');
    });
  });

  it('formats date correctly', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: { data: mockUpcomingReservations },
    });

    const wrapper = createWrapper();
    render(<MyReservations />, { wrapper });

    await waitFor(() => {
      // Check for full date format
      expect(screen.getByText(/Thursday, December 25, 2025/)).toBeTruthy();
    });
  });

  it('formats time in 24-hour format', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: { data: mockUpcomingReservations },
    });

    const wrapper = createWrapper();
    render(<MyReservations />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/10:00 - 12:00/)).toBeTruthy();
    });
  });
});
