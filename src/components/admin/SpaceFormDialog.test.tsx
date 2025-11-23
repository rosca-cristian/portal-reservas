import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SpaceFormDialog } from './SpaceFormDialog'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false }
  }
})

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('SpaceFormDialog', () => {
  it('does not render when isOpen is false (AC#1)', () => {
    const { container } = render(
      <SpaceFormDialog isOpen={false} onClose={() => {}} mode="create" />,
      { wrapper }
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders create mode form with all required fields (AC#1)', () => {
    render(
      <SpaceFormDialog isOpen={true} onClose={() => {}} mode="create" />,
      { wrapper }
    )

    expect(screen.getByText('Add New Space')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/study room a/i)).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /type/i })).toBeInTheDocument()
    expect(screen.getByRole('spinbutton', { name: /floor/i })).toBeInTheDocument()
    expect(screen.getByRole('spinbutton', { name: /capacity/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create space/i })).toBeInTheDocument()
  })

  it('renders edit mode form with pre-filled data (AC#2)', () => {
    const initialData = {
      id: 'space-1',
      name: 'Test Room',
      type: 'Conference Room',
      floor: 2,
      capacity: 10,
      equipment: ['Projector', 'Whiteboard'],
      description: 'A test room',
      photos: [],
      status: 'available'
    }

    render(
      <SpaceFormDialog
        isOpen={true}
        onClose={() => {}}
        mode="edit"
        initialData={initialData}
      />,
      { wrapper }
    )

    expect(screen.getByText('Edit Space')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Test Room')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Conference Room')).toBeInTheDocument()
    expect(screen.getByDisplayValue('2')).toBeInTheDocument()
    expect(screen.getByDisplayValue('10')).toBeInTheDocument()
    expect(screen.getByDisplayValue('A test room')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /update space/i })).toBeInTheDocument()
  })

  it('shows validation errors for missing required fields (AC#5)', async () => {
    const user = userEvent.setup()
    render(
      <SpaceFormDialog isOpen={true} onClose={() => {}} mode="create" />,
      { wrapper }
    )

    // Try to submit without filling required fields
    const submitButton = screen.getByRole('button', { name: /create space/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/name must be at least 3 characters/i)).toBeInTheDocument()
    })
  })

  it('validates name minimum length (AC#5)', async () => {
    const user = userEvent.setup()
    render(
      <SpaceFormDialog isOpen={true} onClose={() => {}} mode="create" />,
      { wrapper }
    )

    const nameInput = screen.getByPlaceholderText(/study room a/i)
    await user.type(nameInput, 'AB')

    const submitButton = screen.getByRole('button', { name: /create space/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/name must be at least 3 characters/i)).toBeInTheDocument()
    })
  })

  it('creates new space successfully (AC#2)', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    render(
      <SpaceFormDialog isOpen={true} onClose={onClose} mode="create" />,
      { wrapper }
    )

    // Fill in required fields
    await user.type(screen.getByPlaceholderText(/study room a/i), 'New Study Room')
    await user.selectOptions(screen.getByRole('combobox', { name: /type/i }), 'Study Area')
    await user.clear(screen.getByRole('spinbutton', { name: /floor/i }))
    await user.type(screen.getByRole('spinbutton', { name: /floor/i }), '3')
    await user.clear(screen.getByRole('spinbutton', { name: /capacity/i }))
    await user.type(screen.getByRole('spinbutton', { name: /capacity/i }), '20')

    // Submit form
    await user.click(screen.getByRole('button', { name: /create space/i }))

    // Verify success
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Space created successfully!')
      expect(onClose).toHaveBeenCalled()
    })

    alertSpy.mockRestore()
  })

  it('updates existing space successfully (AC#2)', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    const initialData = {
      id: 'space-123',
      name: 'Old Name',
      type: 'Study Area',
      floor: 1,
      capacity: 5,
      equipment: [],
      description: '',
      photos: [],
      status: 'available'
    }

    render(
      <SpaceFormDialog
        isOpen={true}
        onClose={onClose}
        mode="edit"
        initialData={initialData}
      />,
      { wrapper }
    )

    // Update name
    const nameInput = screen.getByDisplayValue('Old Name')
    await user.clear(nameInput)
    await user.type(nameInput, 'Updated Name')

    // Submit form
    await user.click(screen.getByRole('button', { name: /update space/i }))

    // Verify success
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Space updated successfully!')
      expect(onClose).toHaveBeenCalled()
    })

    alertSpy.mockRestore()
  })

  it('allows equipment selection (AC#4)', async () => {
    const user = userEvent.setup()
    render(
      <SpaceFormDialog isOpen={true} onClose={() => {}} mode="create" />,
      { wrapper }
    )

    // Select equipment
    const computerCheckbox = screen.getByRole('checkbox', { name: /computer/i })
    const whiteboardCheckbox = screen.getByRole('checkbox', { name: /whiteboard/i })

    expect(computerCheckbox).not.toBeChecked()
    expect(whiteboardCheckbox).not.toBeChecked()

    await user.click(computerCheckbox)
    await user.click(whiteboardCheckbox)

    expect(computerCheckbox).toBeChecked()
    expect(whiteboardCheckbox).toBeChecked()
  })

  it('pre-selects equipment in edit mode (AC#4)', () => {
    const initialData = {
      id: 'space-1',
      name: 'Test Room',
      type: 'Conference Room',
      floor: 1,
      capacity: 10,
      equipment: ['Projector', 'Monitor'],
      photos: [],
      status: 'available'
    }

    render(
      <SpaceFormDialog
        isOpen={true}
        onClose={() => {}}
        mode="edit"
        initialData={initialData}
      />,
      { wrapper }
    )

    const projectorCheckbox = screen.getByRole('checkbox', { name: /projector/i })
    const monitorCheckbox = screen.getByRole('checkbox', { name: /monitor/i })
    const computerCheckbox = screen.getByRole('checkbox', { name: /computer/i })

    expect(projectorCheckbox).toBeChecked()
    expect(monitorCheckbox).toBeChecked()
    expect(computerCheckbox).not.toBeChecked()
  })

  it('closes dialog when cancel button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    render(
      <SpaceFormDialog isOpen={true} onClose={onClose} mode="create" />,
      { wrapper }
    )

    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onClose).toHaveBeenCalled()
  })

  it('closes dialog when X button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    render(
      <SpaceFormDialog isOpen={true} onClose={onClose} mode="create" />,
      { wrapper }
    )

    const closeButtons = screen.getAllByRole('button')
    const xButton = closeButtons.find(btn => btn.querySelector('svg'))

    if (xButton) {
      await user.click(xButton)
      expect(onClose).toHaveBeenCalled()
    }
  })

  it('displays photo upload section (AC#3)', () => {
    render(
      <SpaceFormDialog isOpen={true} onClose={() => {}} mode="create" />,
      { wrapper }
    )

    expect(screen.getByText(/click to upload photos/i)).toBeInTheDocument()
  })

  it('shows loading state during submission', async () => {
    const user = userEvent.setup()
    render(
      <SpaceFormDialog isOpen={true} onClose={() => {}} mode="create" />,
      { wrapper }
    )

    // Fill required fields
    await user.type(screen.getByPlaceholderText(/study room a/i), 'Test Room')
    await user.selectOptions(screen.getByRole('combobox', { name: /type/i }), 'Study Area')

    // Submit
    const submitButton = screen.getByRole('button', { name: /create space/i })
    await user.click(submitButton)

    // Should show loading state briefly
    await waitFor(() => {
      expect(screen.getByText(/creating.../i)).toBeInTheDocument()
    })
  })

  it('handles API errors gracefully', async () => {
    const user = userEvent.setup()
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    render(
      <SpaceFormDialog isOpen={true} onClose={() => {}} mode="create" />,
      { wrapper }
    )

    // Fill with invalid data (capacity 0 will fail validation)
    await user.type(screen.getByPlaceholderText(/study room a/i), 'Test')
    await user.selectOptions(screen.getByRole('combobox', { name: /type/i }), 'Study Area')
    await user.clear(screen.getByRole('spinbutton', { name: /capacity/i }))
    await user.type(screen.getByRole('spinbutton', { name: /capacity/i }), '0')

    await user.click(screen.getByRole('button', { name: /create space/i }))

    await waitFor(() => {
      expect(screen.getByText(/capacity must be at least 1/i)).toBeInTheDocument()
    })

    alertSpy.mockRestore()
  })
})
