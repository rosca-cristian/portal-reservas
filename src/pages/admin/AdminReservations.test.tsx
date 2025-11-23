import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import AdminReservations from './AdminReservations'

// Mock child components
vi.mock('@/components/admin/ReservationsTable', () => ({
  default: ({ reservations, loading }: any) => (
    <div data-testid="reservations-table">
      {loading ? 'Loading...' : `${reservations.length} reservations`}
    </div>
  ),
}))

vi.mock('@/components/admin/ReservationsFilters', () => ({
  default: ({ filters, onFiltersChange }: any) => (
    <div data-testid="reservations-filters">
      <button onClick={() => onFiltersChange({ ...filters, user: 'test' })}>
        Apply Filter
      </button>
    </div>
  ),
}))

vi.mock('@/utils/exportToCSV', () => ({
  exportToCSV: vi.fn(),
}))

describe('AdminReservations', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'test-token')
    global.fetch = vi.fn()
  })

  it('renders admin reservations page', () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] }),
    })

    render(
      <BrowserRouter>
        <AdminReservations />
      </BrowserRouter>
    )

    expect(screen.getByText('Manage Reservations')).toBeInTheDocument()
    expect(screen.getByText('View and manage all reservations across the system')).toBeInTheDocument()
  })

  it('fetches and displays reservations', async () => {
    const mockReservations = [
      {
        id: '1',
        userName: 'John Doe',
        userEmail: 'john@example.com',
        spaceName: 'Room A',
        type: 'individual',
        startTime: '2024-01-15T10:00:00Z',
        endTime: '2024-01-15T11:00:00Z',
        status: 'confirmed',
        createdAt: '2024-01-10T10:00:00Z',
      },
    ]

    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockReservations }),
    })

    render(
      <BrowserRouter>
        <AdminReservations />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('1 reservations')).toBeInTheDocument()
    })
  })

  it('displays export button', () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] }),
    })

    render(
      <BrowserRouter>
        <AdminReservations />
      </BrowserRouter>
    )

    expect(screen.getByRole('button', { name: /export to csv/i })).toBeInTheDocument()
  })

  it('updates filters when filter changes', async () => {
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ data: [] }),
    })

    const user = userEvent.setup()

    render(
      <BrowserRouter>
        <AdminReservations />
      </BrowserRouter>
    )

    const applyFilterButton = screen.getByText('Apply Filter')
    await user.click(applyFilterButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('user=test'),
        expect.any(Object)
      )
    })
  })
})
