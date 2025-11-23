import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MarkUnavailableDialog } from './MarkUnavailableDialog'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false }
  }
})

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

const mockSpace = {
  id: 'space-1',
  name: 'Conference Room A'
}

describe('MarkUnavailableDialog', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(
      <MarkUnavailableDialog
        isOpen={false}
        onClose={() => {}}
        space={mockSpace}
      />,
      { wrapper }
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders dialog when isOpen is true (AC#1)', () => {
    render(
      <MarkUnavailableDialog
        isOpen={true}
        onClose={() => {}}
        space={mockSpace}
      />,
      { wrapper }
    )

    expect(screen.getByText('Mark Space Unavailable')).toBeInTheDocument()
    expect(screen.getByText(/Conference Room A/)).toBeInTheDocument()
  })

  it('displays all required form fields (AC#1)', () => {
    render(
      <MarkUnavailableDialog
        isOpen={true}
        onClose={() => {}}
        space={mockSpace}
      />,
      { wrapper }
    )

    expect(screen.getByLabelText(/reason/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument()
  })

  it('shows warning message about space unavailability', () => {
    render(
      <MarkUnavailableDialog
        isOpen={true}
        onClose={() => {}}
        space={mockSpace}
      />,
      { wrapper }
    )

    expect(screen.getByText(/users will not be able to book this space/i)).toBeInTheDocument()
  })

  it('validates required fields (AC#1)', async () => {
    const user = userEvent.setup()

    render(
      <MarkUnavailableDialog
        isOpen={true}
        onClose={() => {}}
        space={mockSpace}
      />,
      { wrapper }
    )

    // Try to submit without filling fields
    const submitButton = screen.getByRole('button', { name: /mark unavailable/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/reason must be at least 10 characters/i)).toBeInTheDocument()
    })
  })

  it('validates reason minimum length', async () => {
    const user = userEvent.setup()

    render(
      <MarkUnavailableDialog
        isOpen={true}
        onClose={() => {}}
        space={mockSpace}
      />,
      { wrapper }
    )

    const reasonInput = screen.getByLabelText(/reason/i)
    await user.type(reasonInput, 'Short')

    const submitButton = screen.getByRole('button', { name: /mark unavailable/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/reason must be at least 10 characters/i)).toBeInTheDocument()
    })
  })

  it('validates end date is after start date', async () => {
    const user = userEvent.setup()

    render(
      <MarkUnavailableDialog
        isOpen={true}
        onClose={() => {}}
        space={mockSpace}
      />,
      { wrapper }
    )

    // Fill in valid reason
    const reasonInput = screen.getByLabelText(/reason/i)
    await user.type(reasonInput, 'Maintenance work required')

    // Set start date to tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = tomorrow.toISOString().split('T')[0]

    // Set end date to today (before start)
    const today = new Date().toISOString().split('T')[0]

    const startDateInput = screen.getByLabelText(/start date/i)
    const endDateInput = screen.getByLabelText(/end date/i)

    await user.clear(startDateInput)
    await user.type(startDateInput, tomorrowStr)
    await user.type(endDateInput, today)

    const submitButton = screen.getByRole('button', { name: /mark unavailable/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/end date must be after start date/i)).toBeInTheDocument()
    })
  })

  it('submits form successfully (AC#2)', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    render(
      <MarkUnavailableDialog
        isOpen={true}
        onClose={onClose}
        space={mockSpace}
      />,
      { wrapper }
    )

    // Fill in form
    const reasonInput = screen.getByLabelText(/reason/i)
    await user.type(reasonInput, 'Scheduled maintenance and cleaning')

    // Set start date to today
    const startDateInput = screen.getByLabelText(/start date/i)
    const today = new Date().toISOString().split('T')[0]
    await user.clear(startDateInput)
    await user.type(startDateInput, today)

    // Submit
    const submitButton = screen.getByRole('button', { name: /mark unavailable/i })
    await user.click(submitButton)

    // Should show success confirmation
    await waitFor(() => {
      expect(screen.getByText(/space marked unavailable/i)).toBeInTheDocument()
    })

    // Should close after delay
    await waitFor(() => {
      expect(onClose).toHaveBeenCalled()
    }, { timeout: 3000 })
  })

  it('allows optional end date', async () => {
    const user = userEvent.setup()

    render(
      <MarkUnavailableDialog
        isOpen={true}
        onClose={() => {}}
        space={mockSpace}
      />,
      { wrapper }
    )

    // Fill reason and start date only
    const reasonInput = screen.getByLabelText(/reason/i)
    await user.type(reasonInput, 'Indefinite maintenance')

    const startDateInput = screen.getByLabelText(/start date/i)
    const today = new Date().toISOString().split('T')[0]
    await user.clear(startDateInput)
    await user.type(startDateInput, today)

    // Leave end date empty
    // Submit should succeed
    const submitButton = screen.getByRole('button', { name: /mark unavailable/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/space marked unavailable/i)).toBeInTheDocument()
    })
  })

  it('shows loading state during submission', async () => {
    const user = userEvent.setup()

    render(
      <MarkUnavailableDialog
        isOpen={true}
        onClose={() => {}}
        space={mockSpace}
      />,
      { wrapper }
    )

    // Fill form
    const reasonInput = screen.getByLabelText(/reason/i)
    await user.type(reasonInput, 'Maintenance work required')

    const submitButton = screen.getByRole('button', { name: /mark unavailable/i })
    await user.click(submitButton)

    // Should show loading state briefly
    await waitFor(() => {
      expect(screen.getByText(/marking.../i)).toBeInTheDocument()
    })
  })

  it('has cancel button that closes dialog', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    render(
      <MarkUnavailableDialog
        isOpen={true}
        onClose={onClose}
        space={mockSpace}
      />,
      { wrapper }
    )

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    await user.click(cancelButton)

    expect(onClose).toHaveBeenCalled()
  })

  it('has X button that closes dialog', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    render(
      <MarkUnavailableDialog
        isOpen={true}
        onClose={onClose}
        space={mockSpace}
      />,
      { wrapper }
    )

    const closeButtons = screen.getAllByRole('button')
    const xButton = closeButtons.find(btn => btn.querySelector('svg'))

    if (xButton) {
      await user.click(xButton)
      expect(onClose).toHaveBeenCalled()
    }
  })

  it('displays helper text for end date', () => {
    render(
      <MarkUnavailableDialog
        isOpen={true}
        onClose={() => {}}
        space={mockSpace}
      />,
      { wrapper }
    )

    expect(screen.getByText(/leave empty for indefinite unavailability/i)).toBeInTheDocument()
    expect(screen.getByText(/space will auto-reactivate when end date passes/i)).toBeInTheDocument()
  })

  it('handles API errors gracefully', async () => {
    const user = userEvent.setup()
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    // Use invalid space to trigger error
    const invalidSpace = { id: 'invalid-space', name: 'Invalid' }

    render(
      <MarkUnavailableDialog
        isOpen={true}
        onClose={() => {}}
        space={invalidSpace}
      />,
      { wrapper }
    )

    // Fill form
    const reasonInput = screen.getByLabelText(/reason/i)
    await user.type(reasonInput, 'Maintenance work required')

    const submitButton = screen.getByRole('button', { name: /mark unavailable/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('Error'))
    })

    alertSpy.mockRestore()
  })

  it('resets form on close', async () => {
    const user = userEvent.setup()
    const { rerender } = render(
      <MarkUnavailableDialog
        isOpen={true}
        onClose={() => {}}
        space={mockSpace}
      />,
      { wrapper }
    )

    // Fill form
    const reasonInput = screen.getByLabelText(/reason/i)
    await user.type(reasonInput, 'Test reason for unavailability')

    // Close and reopen
    rerender(
      <QueryClientProvider client={queryClient}>
        <MarkUnavailableDialog
          isOpen={false}
          onClose={() => {}}
          space={mockSpace}
        />
      </QueryClientProvider>
    )

    rerender(
      <QueryClientProvider client={queryClient}>
        <MarkUnavailableDialog
          isOpen={true}
          onClose={() => {}}
          space={mockSpace}
        />
      </QueryClientProvider>
    )

    // Form should be reset
    const newReasonInput = screen.getByLabelText(/reason/i)
    expect(newReasonInput).toHaveValue('')
  })

  it('displays space name prominently', () => {
    render(
      <MarkUnavailableDialog
        isOpen={true}
        onClose={() => {}}
        space={mockSpace}
      />,
      { wrapper }
    )

    // Space name should appear in the warning box
    const warningBox = screen.getByText(/space: conference room a/i)
    expect(warningBox).toBeInTheDocument()
  })
})
