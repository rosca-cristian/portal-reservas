import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, vi } from 'vitest'
import { AddSpaceDialog } from './AddSpaceDialog'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('AddSpaceDialog', () => {
  it('renders form fields when open (AC#1)', () => {
    render(<AddSpaceDialog isOpen={true} onClose={vi.fn()} />, { wrapper: createWrapper() })

    expect(screen.getByText('Add New Space')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/study room/i)).toBeInTheDocument()
    expect(screen.getByText('Type *')).toBeInTheDocument()
    expect(screen.getByText('Floor *')).toBeInTheDocument()
    expect(screen.getByText('Capacity *')).toBeInTheDocument()
    expect(screen.getByText('Equipment')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(screen.getByText('Photos')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(<AddSpaceDialog isOpen={false} onClose={vi.fn()} />, { wrapper: createWrapper() })
    expect(screen.queryByText('Add New Space')).not.toBeInTheDocument()
  })

  it('shows validation errors for empty required fields (AC#5)', async () => {
    render(<AddSpaceDialog isOpen={true} onClose={vi.fn()} />, { wrapper: createWrapper() })

    const submitButton = screen.getByRole('button', { name: /create space/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/name must be at least 3 characters/i)).toBeInTheDocument()
      expect(screen.getByText(/type is required/i)).toBeInTheDocument()
    })
  })

  it('renders equipment checkboxes (AC#4)', () => {
    render(<AddSpaceDialog isOpen={true} onClose={vi.fn()} />, { wrapper: createWrapper() })

    expect(screen.getByText('Computer')).toBeInTheDocument()
    expect(screen.getByText('Whiteboard')).toBeInTheDocument()
    expect(screen.getByText('Projector')).toBeInTheDocument()
    expect(screen.getByText('Monitor')).toBeInTheDocument()
  })

  it('allows selecting multiple equipment items (AC#4)', () => {
    render(<AddSpaceDialog isOpen={true} onClose={vi.fn()} />, { wrapper: createWrapper() })

    const computerCheckbox = screen.getByLabelText(/computer/i)
    const whiteboardCheckbox = screen.getByLabelText(/whiteboard/i)

    fireEvent.click(computerCheckbox)
    fireEvent.click(whiteboardCheckbox)

    expect(computerCheckbox).toBeChecked()
    expect(whiteboardCheckbox).toBeChecked()
  })

  it('closes dialog when cancel button clicked', () => {
    const onClose = vi.fn()
    render(<AddSpaceDialog isOpen={true} onClose={onClose} />, { wrapper: createWrapper() })

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    fireEvent.click(cancelButton)

    expect(onClose).toHaveBeenCalled()
  })
})
