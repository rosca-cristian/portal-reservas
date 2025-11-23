import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ReservationsFilters from './ReservationsFilters'

describe('ReservationsFilters', () => {
  const mockFilters = {
    dateFrom: '',
    dateTo: '',
    spaceId: '',
    user: '',
    status: '',
  }

  const mockOnFiltersChange = vi.fn()

  it('renders all filter inputs', () => {
    render(<ReservationsFilters filters={mockFilters} onFiltersChange={mockOnFiltersChange} />)

    expect(screen.getByLabelText('From Date')).toBeInTheDocument()
    expect(screen.getByLabelText('To Date')).toBeInTheDocument()
    expect(screen.getByLabelText('User')).toBeInTheDocument()
    expect(screen.getByLabelText('Status')).toBeInTheDocument()
  })

  it('calls onFiltersChange when date from is changed', async () => {
    const user = userEvent.setup()
    render(<ReservationsFilters filters={mockFilters} onFiltersChange={mockOnFiltersChange} />)

    const dateFromInput = screen.getByLabelText('From Date')
    await user.type(dateFromInput, '2024-01-15')

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...mockFilters,
      dateFrom: '2024-01-15',
    })
  })

  it('calls onFiltersChange when user search is changed', async () => {
    const user = userEvent.setup()
    render(<ReservationsFilters filters={mockFilters} onFiltersChange={mockOnFiltersChange} />)

    const userInput = screen.getByLabelText('User')
    await user.type(userInput, 'john')

    expect(mockOnFiltersChange).toHaveBeenCalled()
  })

  it('shows clear filters button when filters are active', () => {
    const activeFilters = {
      ...mockFilters,
      user: 'john',
    }

    render(<ReservationsFilters filters={activeFilters} onFiltersChange={mockOnFiltersChange} />)

    expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument()
  })

  it('does not show clear filters button when no filters are active', () => {
    render(<ReservationsFilters filters={mockFilters} onFiltersChange={mockOnFiltersChange} />)

    expect(screen.queryByRole('button', { name: /clear filters/i })).not.toBeInTheDocument()
  })

  it('clears all filters when clear button is clicked', async () => {
    const user = userEvent.setup()
    const activeFilters = {
      dateFrom: '2024-01-15',
      dateTo: '2024-01-20',
      spaceId: 'space-1',
      user: 'john',
      status: 'confirmed',
    }

    render(<ReservationsFilters filters={activeFilters} onFiltersChange={mockOnFiltersChange} />)

    const clearButton = screen.getByRole('button', { name: /clear filters/i })
    await user.click(clearButton)

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      dateFrom: '',
      dateTo: '',
      spaceId: '',
      user: '',
      status: '',
    })
  })
})
