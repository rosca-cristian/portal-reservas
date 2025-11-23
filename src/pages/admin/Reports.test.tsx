import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import Reports from './Reports'

// Mock fetch
global.fetch = vi.fn()

const mockMetrics = {
  totalReservations: 248,
  utilizationRate: 68,
  mostPopularSpace: 'Conference Room A',
  totalUsers: 142,
  popularSpaces: [
    { spaceId: 'space-1', spaceName: 'Conference Room A', count: 45 },
    { spaceId: 'space-2', spaceName: 'Study Room B', count: 38 },
  ],
  underutilizedSpaces: [
    { spaceId: 'space-10', spaceName: 'Basement Study Room', utilizationRate: 12.5 },
  ],
}

describe('Reports', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ data: mockMetrics }),
    })
  })

  it('renders reports page title', async () => {
    render(<Reports />)

    expect(screen.getByText('Utilization Reports')).toBeInTheDocument()
  })

  it('fetches and displays metrics', async () => {
    render(<Reports />)

    await waitFor(() => {
      expect(screen.getByText('248')).toBeInTheDocument()
      expect(screen.getByText('68%')).toBeInTheDocument()
      expect(screen.getByText('142')).toBeInTheDocument()
    })
  })

  it('displays date range section', async () => {
    render(<Reports />)

    await waitFor(() => {
      expect(screen.getByText('Date Range')).toBeInTheDocument()
    })
  })

  it('displays popular spaces', async () => {
    render(<Reports />)

    await waitFor(() => {
      expect(screen.getByText('Popular Spaces')).toBeInTheDocument()
      expect(screen.getByText('Study Room B')).toBeInTheDocument()
      expect(screen.getByText('45 reservations')).toBeInTheDocument()
    })
  })

  it('displays underutilized spaces', async () => {
    render(<Reports />)

    await waitFor(() => {
      expect(screen.getByText(/Underutilized Spaces/)).toBeInTheDocument()
      expect(screen.getByText('Basement Study Room')).toBeInTheDocument()
      expect(screen.getByText('12.5% utilized')).toBeInTheDocument()
    })
  })

  it('shows loading state', () => {
    ;(global.fetch as any).mockImplementation(() => new Promise(() => {}))

    render(<Reports />)

    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('handles error state', async () => {
    ;(global.fetch as any).mockRejectedValue(new Error('Network error'))
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(<Reports />)

    await waitFor(() => {
      expect(screen.getByText('No data available for the selected period')).toBeInTheDocument()
    })

    consoleSpy.mockRestore()
  })
})
