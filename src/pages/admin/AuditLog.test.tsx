import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AuditLog from './AuditLog'
import type { AuditLogEntry } from '@/types/auditLog'

// Mock fetch
global.fetch = vi.fn()

const mockAuditLog: AuditLogEntry[] = [
  {
    id: 'audit-1',
    timestamp: '2025-11-19T10:00:00Z',
    userId: 'user-1',
    userName: 'John Doe',
    userRole: 'user',
    action: 'CREATED',
    reservationId: 'res-1',
    details: 'Created reservation for Conference Room A',
  },
  {
    id: 'audit-2',
    timestamp: '2025-11-19T12:00:00Z',
    userId: 'admin-1',
    userName: 'Admin User',
    userRole: 'admin',
    action: 'ADMIN_CANCELLED',
    reservationId: 'res-2',
    details: 'Admin cancelled reservation',
    metadata: {
      reason: 'Emergency',
      notes: 'Building maintenance required',
    },
  },
]

describe('AuditLog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ data: mockAuditLog }),
    })
  })

  it('renders audit log page title', async () => {
    render(<AuditLog />)

    expect(screen.getByText('Audit Log')).toBeInTheDocument()
  })

  it('fetches and displays audit log entries', async () => {
    render(<AuditLog />)

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Admin User')).toBeInTheDocument()
    })
  })

  it('displays filter controls', () => {
    render(<AuditLog />)

    expect(screen.getByLabelText('Date From')).toBeInTheDocument()
    expect(screen.getByLabelText('Date To')).toBeInTheDocument()
    expect(screen.getByLabelText('Action Type')).toBeInTheDocument()
    expect(screen.getByLabelText('User')).toBeInTheDocument()
  })

  it('applies date from filter', async () => {
    render(<AuditLog />)

    const dateFromInput = screen.getByLabelText('Date From') as HTMLInputElement
    fireEvent.change(dateFromInput, { target: { value: '2025-11-19' } })

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('dateFrom=2025-11-19')
      )
    })
  })

  it('applies date to filter', async () => {
    render(<AuditLog />)

    const dateToInput = screen.getByLabelText('Date To') as HTMLInputElement
    fireEvent.change(dateToInput, { target: { value: '2025-11-20' } })

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('dateTo=2025-11-20')
      )
    })
  })

  it('applies action type filter', async () => {
    render(<AuditLog />)

    const actionTypeSelect = screen.getByLabelText('Action Type')
    fireEvent.click(actionTypeSelect)

    // Find and click the CREATED option
    const createdOption = await screen.findByText('CREATED')
    fireEvent.click(createdOption)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('actionType=CREATED')
      )
    })
  })

  it('applies user filter', async () => {
    render(<AuditLog />)

    const userInput = screen.getByLabelText('User') as HTMLInputElement
    fireEvent.change(userInput, { target: { value: 'John' } })

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('user=John')
      )
    })
  })

  it('clears all filters', async () => {
    render(<AuditLog />)

    // Set filters
    const dateFromInput = screen.getByLabelText('Date From') as HTMLInputElement
    const userInput = screen.getByLabelText('User') as HTMLInputElement

    fireEvent.change(dateFromInput, { target: { value: '2025-11-19' } })
    fireEvent.change(userInput, { target: { value: 'John' } })

    // Clear filters
    const clearButton = screen.getByRole('button', { name: /clear filters/i })
    fireEvent.click(clearButton)

    expect(dateFromInput.value).toBe('')
    expect(userInput.value).toBe('')
  })

  it('exports audit log to CSV', async () => {
    // Mock URL.createObjectURL
    global.URL.createObjectURL = vi.fn()

    // Save original createElement
    const originalCreateElement = document.createElement.bind(document)
    const mockClick = vi.fn()

    // Mock createElement to intercept anchor elements
    document.createElement = vi.fn((tagName: string) => {
      if (tagName === 'a') {
        const element = originalCreateElement(tagName)
        element.click = mockClick
        return element
      }
      return originalCreateElement(tagName)
    })

    render(<AuditLog />)

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    const exportButton = screen.getByRole('button', { name: /export to csv/i })
    fireEvent.click(exportButton)

    expect(mockClick).toHaveBeenCalled()

    // Restore
    document.createElement = originalCreateElement
  })

  it('refreshes audit log when refresh button clicked', async () => {
    render(<AuditLog />)

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    const refreshButton = screen.getByRole('button', { name: /refresh/i })
    fireEvent.click(refreshButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2) // Initial + refresh
    })
  })

  it('shows loading state', () => {
    ;(global.fetch as any).mockImplementation(() => new Promise(() => {})) // Never resolves

    render(<AuditLog />)

    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('handles fetch error gracefully', async () => {
    ;(global.fetch as any).mockRejectedValue(new Error('Network error'))
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(<AuditLog />)

    await waitFor(() => {
      expect(screen.getByText('No audit log entries found')).toBeInTheDocument()
    })

    consoleSpy.mockRestore()
  })
})
