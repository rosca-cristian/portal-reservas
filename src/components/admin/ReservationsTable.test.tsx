import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ReservationsTable from './ReservationsTable'
import type { AdminReservation } from '@/types/reservation'

describe('ReservationsTable', () => {
  const mockReservations: AdminReservation[] = [
    {
      id: '1',
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
    },
    {
      id: '2',
      userId: 'user-2',
      userName: 'Jane Smith',
      userEmail: 'jane@example.com',
      spaceId: 'space-2',
      spaceName: 'Room B',
      spaceType: 'Conference Room',
      type: 'group',
      startTime: '2024-01-16T14:00:00Z',
      endTime: '2024-01-16T16:00:00Z',
      status: 'completed',
      createdAt: '2024-01-11T10:00:00Z',
    },
  ]

  const mockOnRefresh = vi.fn()

  it('shows loading state', () => {
    render(<ReservationsTable reservations={[]} loading={true} onRefresh={mockOnRefresh} />)

    const spinner = document.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveClass('animate-spin', 'rounded-full')
  })

  it('shows empty state when no reservations', () => {
    render(<ReservationsTable reservations={[]} loading={false} onRefresh={mockOnRefresh} />)

    expect(screen.getByText('No reservations found')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument()
  })

  it('renders table with reservations', () => {
    render(<ReservationsTable reservations={mockReservations} loading={false} onRefresh={mockOnRefresh} />)

    // Check table headers
    expect(screen.getByText('User')).toBeInTheDocument()
    expect(screen.getByText('Space')).toBeInTheDocument()
    expect(screen.getByText('Date')).toBeInTheDocument()
    expect(screen.getByText('Time')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Type')).toBeInTheDocument()
    expect(screen.getByText('Actions')).toBeInTheDocument()

    // Check user data
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('jane@example.com')).toBeInTheDocument()

    // Check space data
    expect(screen.getByText('Room A')).toBeInTheDocument()
    expect(screen.getByText('Room B')).toBeInTheDocument()
  })

  it('displays status badges with correct styling', () => {
    render(<ReservationsTable reservations={mockReservations} loading={false} onRefresh={mockOnRefresh} />)

    const confirmedBadge = screen.getByText('confirmed')
    const completedBadge = screen.getByText('completed')

    expect(confirmedBadge).toHaveClass('bg-blue-100', 'text-blue-800')
    expect(completedBadge).toHaveClass('bg-green-100', 'text-green-800')
  })

  it('displays type badges with correct styling', () => {
    render(<ReservationsTable reservations={mockReservations} loading={false} onRefresh={mockOnRefresh} />)

    const individualBadge = screen.getByText('individual')
    const groupBadge = screen.getByText('group')

    expect(individualBadge).toHaveClass('bg-purple-100', 'text-purple-800')
    expect(groupBadge).toHaveClass('bg-orange-100', 'text-orange-800')
  })

  it('calls onRefresh when refresh button is clicked in empty state', async () => {
    const user = userEvent.setup()
    render(<ReservationsTable reservations={[]} loading={false} onRefresh={mockOnRefresh} />)

    const refreshButton = screen.getByRole('button', { name: /refresh/i })
    await user.click(refreshButton)

    expect(mockOnRefresh).toHaveBeenCalled()
  })

  it('renders view action button for each reservation', () => {
    render(<ReservationsTable reservations={mockReservations} loading={false} onRefresh={mockOnRefresh} />)

    const viewButtons = screen.getAllByRole('button')
    expect(viewButtons.length).toBe(2) // One for each reservation
  })
})
