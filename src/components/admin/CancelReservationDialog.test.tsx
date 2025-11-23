import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CancelReservationDialog, { CANCELLATION_REASONS } from './CancelReservationDialog'
import type { AdminReservation } from '@/types/reservation'

describe('CancelReservationDialog', () => {
  const mockReservation: AdminReservation = {
    id: 'res-1',
    spaceId: 'space-1',
    spaceName: 'Conference Room A',
    spaceType: 'conference',
    startTime: '2025-11-20T10:00:00Z',
    endTime: '2025-11-20T11:00:00Z',
    status: 'confirmed',
    type: 'individual',
    createdAt: '2025-11-19T10:00:00Z',
    userId: 'user-1',
    userName: 'John Doe',
    userEmail: 'john@example.com',
  }

  const mockGroupReservation: AdminReservation = {
    ...mockReservation,
    id: 'res-2',
    type: 'group',
    participants: [
      { id: 'p1', name: 'John Doe', email: 'john@example.com', role: 'organizer', joinedVia: 'direct', joinedAt: '2025-11-19T10:00:00Z' },
      { id: 'p2', name: 'Jane Smith', email: 'jane@example.com', role: 'member', joinedVia: 'invitation', joinedAt: '2025-11-19T10:30:00Z' },
      { id: 'p3', name: 'Bob Wilson', email: 'bob@example.com', role: 'member', joinedVia: 'invitation', joinedAt: '2025-11-19T11:00:00Z' },
    ],
  }

  it('renders dialog when open', () => {
    render(
      <CancelReservationDialog
        reservation={mockReservation}
        open={true}
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
      />
    )

    expect(screen.getAllByText('Cancel Reservation').length).toBeGreaterThan(0)
    expect(screen.getByText(`You are about to cancel reservation ${mockReservation.id}.`)).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(
      <CancelReservationDialog
        reservation={mockReservation}
        open={false}
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
      />
    )

    expect(screen.queryByText('Cancel Reservation')).not.toBeInTheDocument()
  })

  it('does not render when reservation is null', () => {
    render(
      <CancelReservationDialog
        reservation={null}
        open={true}
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
      />
    )

    expect(screen.queryByText('Cancel Reservation')).not.toBeInTheDocument()
  })

  it('displays all cancellation reasons', () => {
    render(
      <CancelReservationDialog
        reservation={mockReservation}
        open={true}
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
      />
    )

    // Click the select to open the dropdown
    const selectTrigger = screen.getByRole('button', { name: /cancellation reason/i })
    fireEvent.click(selectTrigger)

    // Check that all reasons are displayed
    Object.values(CANCELLATION_REASONS).forEach(reason => {
      expect(screen.getByText(reason)).toBeInTheDocument()
    })
  })

  it('allows user to select a reason and add notes', async () => {
    render(
      <CancelReservationDialog
        reservation={mockReservation}
        open={true}
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
      />
    )

    // Select a reason
    const selectTrigger = screen.getByRole('button', { name: /cancellation reason/i })
    fireEvent.click(selectTrigger)
    fireEvent.click(screen.getByText(CANCELLATION_REASONS.EMERGENCY))

    // Add notes
    const notesInput = screen.getByPlaceholderText(/Add any additional information/i)
    fireEvent.change(notesInput, { target: { value: 'Emergency maintenance required' } })

    expect(notesInput).toHaveValue('Emergency maintenance required')
  })

  it('disables confirm button when no reason is selected', () => {
    render(
      <CancelReservationDialog
        reservation={mockReservation}
        open={true}
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
      />
    )

    const confirmButton = screen.getByRole('button', { name: /Cancel Reservation/i })
    expect(confirmButton).toBeDisabled()
  })

  it('enables confirm button when reason is selected', async () => {
    render(
      <CancelReservationDialog
        reservation={mockReservation}
        open={true}
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
      />
    )

    // Select a reason
    const selectTrigger = screen.getByRole('button', { name: /cancellation reason/i })
    fireEvent.click(selectTrigger)
    fireEvent.click(screen.getByText(CANCELLATION_REASONS.EMERGENCY))

    await waitFor(() => {
      const confirmButton = screen.getByRole('button', { name: /Cancel Reservation/i })
      expect(confirmButton).not.toBeDisabled()
    })
  })

  it('calls onConfirm with reason and notes when confirmed', async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined)

    render(
      <CancelReservationDialog
        reservation={mockReservation}
        open={true}
        onOpenChange={vi.fn()}
        onConfirm={onConfirm}
      />
    )

    // Select a reason
    const selectTrigger = screen.getByRole('button', { name: /cancellation reason/i })
    fireEvent.click(selectTrigger)
    fireEvent.click(screen.getByText(CANCELLATION_REASONS.POLICY_VIOLATION))

    // Add notes
    const notesInput = screen.getByPlaceholderText(/Add any additional information/i)
    fireEvent.change(notesInput, { target: { value: 'User violated terms of service' } })

    // Click confirm
    const confirmButton = screen.getByRole('button', { name: /Cancel Reservation/i })
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledWith(
        CANCELLATION_REASONS.POLICY_VIOLATION,
        'User violated terms of service'
      )
    })
  })

  it('calls onOpenChange(false) when cancel button is clicked', () => {
    const onOpenChange = vi.fn()

    render(
      <CancelReservationDialog
        reservation={mockReservation}
        open={true}
        onOpenChange={onOpenChange}
        onConfirm={vi.fn()}
      />
    )

    const cancelButton = screen.getByRole('button', { name: /^Cancel$/i })
    fireEvent.click(cancelButton)

    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('shows group reservation warning', () => {
    render(
      <CancelReservationDialog
        reservation={mockGroupReservation}
        open={true}
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
      />
    )

    expect(screen.getByText(/This will affect 3 participant\(s\)/i)).toBeInTheDocument()
    expect(screen.getByText(/All 3 participant\(s\) will be notified/i)).toBeInTheDocument()
  })

  it('does not show group warning for individual reservations', () => {
    render(
      <CancelReservationDialog
        reservation={mockReservation}
        open={true}
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
      />
    )

    expect(screen.queryByText(/participant\(s\) will be notified/i)).not.toBeInTheDocument()
  })

  it('shows loading state while submitting', async () => {
    const onConfirm = vi.fn().mockImplementation(() => new Promise(() => {})) // Never resolves

    render(
      <CancelReservationDialog
        reservation={mockReservation}
        open={true}
        onOpenChange={vi.fn()}
        onConfirm={onConfirm}
      />
    )

    // Select a reason
    const selectTrigger = screen.getByRole('button', { name: /cancellation reason/i })
    fireEvent.click(selectTrigger)
    fireEvent.click(screen.getByText(CANCELLATION_REASONS.EMERGENCY))

    // Click confirm
    const confirmButton = screen.getByRole('button', { name: /Cancel Reservation/i })
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(screen.getByText('Cancelling...')).toBeInTheDocument()
      expect(confirmButton).toBeDisabled()
    })
  })

  it('resets form when dialog is closed after successful submission', async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined)
    const onOpenChange = vi.fn()

    const { rerender } = render(
      <CancelReservationDialog
        reservation={mockReservation}
        open={true}
        onOpenChange={onOpenChange}
        onConfirm={onConfirm}
      />
    )

    // Select a reason and add notes
    const selectTrigger = screen.getByRole('button', { name: /cancellation reason/i })
    fireEvent.click(selectTrigger)
    fireEvent.click(screen.getByText(CANCELLATION_REASONS.EMERGENCY))

    const notesInput = screen.getByPlaceholderText(/Add any additional information/i)
    fireEvent.change(notesInput, { target: { value: 'Test notes' } })

    // Click confirm
    const confirmButton = screen.getByRole('button', { name: /Cancel Reservation/i })
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })

    // Reopen the dialog
    rerender(
      <CancelReservationDialog
        reservation={mockReservation}
        open={true}
        onOpenChange={onOpenChange}
        onConfirm={onConfirm}
      />
    )

    // Form should be reset
    expect(notesInput).toHaveValue('')
  })
})
