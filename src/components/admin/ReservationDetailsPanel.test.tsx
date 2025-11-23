import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ReservationDetailsPanel from './ReservationDetailsPanel'
import type { AdminReservation } from '@/types/reservation'

// Mock fetch
global.fetch = vi.fn()

describe('ReservationDetailsPanel', () => {
  const mockReservation: AdminReservation = {
    id: 'res-1',
    userId: 'user-1',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    spaceId: 'space-1',
    spaceName: 'Room A',
    spaceType: 'Meeting Room',
    type: 'individual',
    startTime: '2024-01-15T10:00:00Z',
    endTime: '2024-01-15T11:00:00Z',
    status: 'confirmed',
    createdAt: '2024-01-10T10:00:00Z',
  }

  const mockGroupReservation: AdminReservation = {
    ...mockReservation,
    id: 'res-2',
    type: 'group',
    participants: [
      {
        id: 'part-1',
        userId: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        joinedAt: new Date('2024-01-10T10:00:00Z'),
        joinedVia: 'direct',
        role: 'organizer',
      },
      {
        id: 'part-2',
        userId: 'user-2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        joinedAt: new Date('2024-01-10T11:00:00Z'),
        joinedVia: 'invitation',
        role: 'member',
      },
    ],
  }

  const mockOnOpenChange = vi.fn()
  const mockOnReservationCancelled = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not render when reservation is null', () => {
    const { container } = render(
      <ReservationDetailsPanel
        reservation={null}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('renders reservation details when open', () => {
    render(
      <ReservationDetailsPanel
        reservation={mockReservation}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    )

    expect(screen.getAllByText('Reservation Details').length).toBeGreaterThan(0)
    expect(screen.getByText(/Reservation ID:/)).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(screen.getByText('Room A')).toBeInTheDocument()
  })

  it('displays user information correctly', () => {
    render(
      <ReservationDetailsPanel
        reservation={mockReservation}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    )

    expect(screen.getByText('User Information')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send email/i })).toBeInTheDocument()
  })

  it('displays space information correctly', () => {
    render(
      <ReservationDetailsPanel
        reservation={mockReservation}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    )

    expect(screen.getByText('Space Information')).toBeInTheDocument()
    expect(screen.getByText('Room A')).toBeInTheDocument()
    expect(screen.getByText('Meeting Room')).toBeInTheDocument()
  })

  it('displays reservation details correctly', () => {
    render(
      <ReservationDetailsPanel
        reservation={mockReservation}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    )

    expect(screen.getAllByText('Reservation Details').length).toBeGreaterThan(0)
    expect(screen.getByText('confirmed')).toBeInTheDocument()
    expect(screen.getByText('individual')).toBeInTheDocument()
  })

  it('displays group booking details for group reservations', () => {
    render(
      <ReservationDetailsPanel
        reservation={mockGroupReservation}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    )

    expect(screen.getByText('Group Booking Details')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('jane@example.com')).toBeInTheDocument()
    expect(screen.getByText('Organizer')).toBeInTheDocument()
    expect(screen.getByText('Via Invitation')).toBeInTheDocument()
  })

  it('does not display group booking details for individual reservations', () => {
    render(
      <ReservationDetailsPanel
        reservation={mockReservation}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    )

    expect(screen.queryByText('Group Booking Details')).not.toBeInTheDocument()
  })

  it('displays history timeline', () => {
    render(
      <ReservationDetailsPanel
        reservation={mockReservation}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    )

    expect(screen.getByText('History')).toBeInTheDocument()
    expect(screen.getByText('Reservation Created')).toBeInTheDocument()
    expect(screen.getByText(/Created by John Doe/)).toBeInTheDocument()
  })

  it('shows cancelled status in history for cancelled reservations', () => {
    const cancelledReservation = {
      ...mockReservation,
      status: 'cancelled' as const,
    }

    render(
      <ReservationDetailsPanel
        reservation={cancelledReservation}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    )

    expect(screen.getByText('Reservation Cancelled')).toBeInTheDocument()
  })

  it('handles send email button click', async () => {
    const user = userEvent.setup()
    delete (window as any).location
    window.location = { href: '' } as any

    render(
      <ReservationDetailsPanel
        reservation={mockReservation}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    )

    const sendEmailButton = screen.getByRole('button', { name: /send email/i })
    await user.click(sendEmailButton)

    expect(window.location.href).toBe('mailto:john@example.com')
  })

  describe('Cancel Reservation', () => {
    it('shows cancel button for confirmed reservations', () => {
      render(
        <ReservationDetailsPanel
          reservation={mockReservation}
          open={true}
          onOpenChange={mockOnOpenChange}
          onReservationCancelled={mockOnReservationCancelled}
        />
      )

      expect(screen.getByRole('button', { name: /cancel reservation/i })).toBeInTheDocument()
    })

    it('shows cancel button for in-progress reservations', () => {
      const inProgressReservation = {
        ...mockReservation,
        status: 'in_progress' as const,
      }

      render(
        <ReservationDetailsPanel
          reservation={inProgressReservation}
          open={true}
          onOpenChange={mockOnOpenChange}
          onReservationCancelled={mockOnReservationCancelled}
        />
      )

      expect(screen.getByRole('button', { name: /cancel reservation/i })).toBeInTheDocument()
    })

    it('does not show cancel button for cancelled reservations', () => {
      const cancelledReservation = {
        ...mockReservation,
        status: 'cancelled' as const,
      }

      render(
        <ReservationDetailsPanel
          reservation={cancelledReservation}
          open={true}
          onOpenChange={mockOnOpenChange}
          onReservationCancelled={mockOnReservationCancelled}
        />
      )

      expect(screen.queryByRole('button', { name: /cancel reservation/i })).not.toBeInTheDocument()
    })

    it('does not show cancel button for completed reservations', () => {
      const completedReservation = {
        ...mockReservation,
        status: 'completed' as const,
      }

      render(
        <ReservationDetailsPanel
          reservation={completedReservation}
          open={true}
          onOpenChange={mockOnOpenChange}
          onReservationCancelled={mockOnReservationCancelled}
        />
      )

      expect(screen.queryByRole('button', { name: /cancel reservation/i })).not.toBeInTheDocument()
    })

    it('opens cancel dialog when cancel button is clicked', async () => {
      const user = userEvent.setup()

      render(
        <ReservationDetailsPanel
          reservation={mockReservation}
          open={true}
          onOpenChange={mockOnOpenChange}
          onReservationCancelled={mockOnReservationCancelled}
        />
      )

      const cancelButton = screen.getByRole('button', { name: /cancel reservation/i })
      await user.click(cancelButton)

      // Check that dialog opened by looking for dialog content
      expect(screen.getByText(/You are about to cancel reservation/i)).toBeInTheDocument()
    })

    it('calls API when reservation is cancelled', async () => {
      const user = userEvent.setup()
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: { ...mockReservation, status: 'cancelled' } }),
      })
      global.fetch = mockFetch

      render(
        <ReservationDetailsPanel
          reservation={mockReservation}
          open={true}
          onOpenChange={mockOnOpenChange}
          onReservationCancelled={mockOnReservationCancelled}
        />
      )

      // Open cancel dialog
      const cancelButton = screen.getByRole('button', { name: /cancel reservation/i })
      await user.click(cancelButton)

      // Select a reason
      const selectTrigger = screen.getByRole('button', { name: /cancellation reason/i })
      await user.click(selectTrigger)
      await user.click(screen.getByText('Emergency'))

      // Confirm cancellation - get all buttons and click the last one (the one in the dialog)
      const confirmButtons = screen.getAllByRole('button', { name: /cancel reservation/i })
      await user.click(confirmButtons[confirmButtons.length - 1])

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          `/api/admin/reservations/${mockReservation.id}`,
          expect.objectContaining({
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason: 'Emergency', notes: '' }),
          })
        )
      })
    })

    it('calls onReservationCancelled callback after successful cancellation', async () => {
      const user = userEvent.setup()
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: { ...mockReservation, status: 'cancelled' } }),
      })
      global.fetch = mockFetch

      render(
        <ReservationDetailsPanel
          reservation={mockReservation}
          open={true}
          onOpenChange={mockOnOpenChange}
          onReservationCancelled={mockOnReservationCancelled}
        />
      )

      // Open cancel dialog
      const cancelButton = screen.getByRole('button', { name: /cancel reservation/i })
      await user.click(cancelButton)

      // Select a reason
      const selectTrigger = screen.getByRole('button', { name: /cancellation reason/i })
      await user.click(selectTrigger)
      await user.click(screen.getByText('Emergency'))

      // Confirm cancellation - get all buttons and click the last one (the one in the dialog)
      const confirmButtons = screen.getAllByRole('button', { name: /cancel reservation/i })
      await user.click(confirmButtons[confirmButtons.length - 1])

      await waitFor(() => {
        expect(mockOnReservationCancelled).toHaveBeenCalled()
      })
    })

    it('closes details panel after successful cancellation', async () => {
      const user = userEvent.setup()
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: { ...mockReservation, status: 'cancelled' } }),
      })
      global.fetch = mockFetch

      render(
        <ReservationDetailsPanel
          reservation={mockReservation}
          open={true}
          onOpenChange={mockOnOpenChange}
          onReservationCancelled={mockOnReservationCancelled}
        />
      )

      // Open cancel dialog
      const cancelButton = screen.getByRole('button', { name: /cancel reservation/i })
      await user.click(cancelButton)

      // Select a reason
      const selectTrigger = screen.getByRole('button', { name: /cancellation reason/i })
      await user.click(selectTrigger)
      await user.click(screen.getByText('Emergency'))

      // Confirm cancellation - get all buttons and click the last one (the one in the dialog)
      const confirmButtons = screen.getAllByRole('button', { name: /cancel reservation/i })
      await user.click(confirmButtons[confirmButtons.length - 1])

      await waitFor(() => {
        expect(mockOnOpenChange).toHaveBeenCalledWith(false)
      })
    })
  })
})
