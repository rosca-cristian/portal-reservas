/**
 * BookingConfirmation Page Tests
 * Story 3.3: Booking Confirmation Screen
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import BookingConfirmation from './BookingConfirmation';

// Mock generateICS
vi.mock('../lib/utils/icsGenerator', () => ({
  generateICS: vi.fn(() => 'MOCK_ICS_CONTENT'),
}));

const mockReservationData = {
  id: 'reservation-123-456-789',
  spaceName: 'Conference Room A',
  startTime: '2025-01-15T10:00:00.000Z',
  endTime: '2025-01-15T12:00:00.000Z',
  notes: 'Need projector for presentation',
  createdAt: '2025-01-10T08:00:00.000Z',
};

const renderWithRouter = (reservationData?: any) => {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/booking/confirmation/123', state: { reservation: reservationData } }]}>
      <Routes>
        <Route path="/booking/confirmation/:id" element={<BookingConfirmation />} />
        <Route path="/my-reservations" element={<div>My Reservations Page</div>} />
        <Route path="/spaces" element={<div>Spaces Page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('BookingConfirmation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays success message', () => {
    renderWithRouter(mockReservationData);

    expect(screen.getByText('Booking Confirmed!')).toBeTruthy();
    expect(screen.getByText('Your space has been successfully reserved')).toBeTruthy();
  });

  it('displays confirmation number', () => {
    renderWithRouter(mockReservationData);

    expect(screen.getByText('Confirmation Number')).toBeTruthy();
    // First 8 characters of reservation ID, uppercased
    expect(screen.getByText('RESERVAT')).toBeTruthy();
  });

  it('displays space name', () => {
    renderWithRouter(mockReservationData);

    expect(screen.getByText('Conference Room A')).toBeTruthy();
  });

  it('displays date in readable format', () => {
    renderWithRouter(mockReservationData);

    expect(screen.getByText(/Wednesday, January 15, 2025/)).toBeTruthy();
  });

  it('displays start and end time', () => {
    renderWithRouter(mockReservationData);

    expect(screen.getByText(/10:00 - 12:00/)).toBeTruthy();
  });

  it('displays notes when provided', () => {
    renderWithRouter(mockReservationData);

    expect(screen.getByText('Notes')).toBeTruthy();
    expect(screen.getByText('Need projector for presentation')).toBeTruthy();
  });

  it('does not display notes section when notes are not provided', () => {
    const dataWithoutNotes = {
      ...mockReservationData,
      notes: undefined,
    };

    renderWithRouter(dataWithoutNotes);

    expect(screen.queryByText('Notes')).toBeNull();
  });

  it('renders Add to Calendar button', () => {
    renderWithRouter(mockReservationData);

    expect(screen.getByText('Add to Calendar')).toBeTruthy();
  });

  it('renders My Reservations button', () => {
    renderWithRouter(mockReservationData);

    expect(screen.getByText('My Reservations')).toBeTruthy();
  });

  it('renders Browse Spaces button', () => {
    renderWithRouter(mockReservationData);

    expect(screen.getByText('Browse Spaces')).toBeTruthy();
  });

  it('downloads ICS file when Add to Calendar is clicked', async () => {
    const user = userEvent.setup();

    // Mock URL.createObjectURL and URL.revokeObjectURL
    URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    URL.revokeObjectURL = vi.fn();

    // Mock document.createElement and click
    const mockClick = vi.fn();
    const mockLink = {
      href: '',
      download: '',
      click: mockClick,
    };
    const originalCreateElement = document.createElement.bind(document);
    document.createElement = vi.fn((tagName) => {
      if (tagName === 'a') {
        return mockLink as any;
      }
      return originalCreateElement(tagName);
    });

    renderWithRouter(mockReservationData);

    const downloadButton = screen.getByText('Add to Calendar');
    await user.click(downloadButton);

    expect(mockClick).toHaveBeenCalled();
    expect(mockLink.download).toBe('reservation-reservation-123-456-789.ics');
  });

  it('displays success animation icon', () => {
    const { container } = renderWithRouter(mockReservationData);

    // Check for the CheckCircle SVG icon
    const checkIcon = container.querySelector('svg');
    expect(checkIcon).toBeTruthy();
    // Check parent div has animate-bounce
    const animatedElement = container.querySelector('.animate-bounce');
    expect(animatedElement).toBeTruthy();
  });

  it('displays QR code placeholder', () => {
    renderWithRouter(mockReservationData);

    expect(screen.getByText(/QR Code for Check-in/)).toBeTruthy();
    expect(screen.getByText(/Use this QR code for quick check-in/)).toBeTruthy();
  });

  it('displays email confirmation message', () => {
    renderWithRouter(mockReservationData);

    expect(screen.getByText(/A confirmation email has been sent/)).toBeTruthy();
  });

  it('shows error state when no reservation data is provided', () => {
    renderWithRouter(undefined);

    expect(screen.getByText('No reservation data found')).toBeTruthy();
    expect(screen.getByText('View My Reservations')).toBeTruthy();
  });

  it('navigates to my-reservations when View My Reservations is clicked in error state', async () => {
    const user = userEvent.setup();
    renderWithRouter(undefined);

    const button = screen.getByText('View My Reservations');
    await user.click(button);

    expect(screen.getByText('My Reservations Page')).toBeTruthy();
  });

  it('navigates to my-reservations when My Reservations button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(mockReservationData);

    const button = screen.getByText('My Reservations');
    await user.click(button);

    expect(screen.getByText('My Reservations Page')).toBeTruthy();
  });

  it('navigates to spaces when Browse Spaces button is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(mockReservationData);

    const button = screen.getByText('Browse Spaces');
    await user.click(button);

    expect(screen.getByText('Spaces Page')).toBeTruthy();
  });

  it('applies correct styling to confirmation card', () => {
    renderWithRouter(mockReservationData);

    const card = screen.getByText('Confirmation Number').closest('.bg-white');
    expect(card?.className).toContain('rounded-lg');
    expect(card?.className).toContain('shadow-md');
  });

  it('displays confirmation number in uppercase', () => {
    renderWithRouter(mockReservationData);

    const confirmationNumber = screen.getByText('RESERVAT');
    expect(confirmationNumber).toBeTruthy();
    // Verify it's uppercase
    expect(confirmationNumber.textContent).toBe(confirmationNumber.textContent?.toUpperCase());
  });

  it('truncates confirmation number to 8 characters', () => {
    renderWithRouter(mockReservationData);

    const confirmationNumber = screen.getByText('RESERVAT');
    expect(confirmationNumber.textContent?.length).toBe(8);
  });

  it('formats time in 24-hour format', () => {
    const morningReservation = {
      ...mockReservationData,
      startTime: '2025-01-15T09:30:00.000Z',
      endTime: '2025-01-15T11:30:00.000Z',
    };

    renderWithRouter(morningReservation);

    expect(screen.getByText(/09:30/)).toBeTruthy();
    expect(screen.getByText(/11:30/)).toBeTruthy();
  });

  it('handles reservations spanning across day boundary', () => {
    const lateReservation = {
      ...mockReservationData,
      startTime: '2025-01-15T23:00:00.000Z',
      endTime: '2025-01-16T01:00:00.000Z',
    };

    renderWithRouter(lateReservation);

    expect(screen.getByText(/23:00/)).toBeTruthy();
    expect(screen.getByText(/01:00/)).toBeTruthy();
  });
});
