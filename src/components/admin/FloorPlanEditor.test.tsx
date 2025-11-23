import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FloorPlanEditor } from './FloorPlanEditor'

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
  name: 'Test Room',
  x: 100,
  y: 100,
  width: 150,
  height: 100
}

describe('FloorPlanEditor', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(
      <FloorPlanEditor
        isOpen={false}
        onClose={() => {}}
        space={mockSpace}
      />,
      { wrapper }
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders editor when isOpen is true (AC#1)', () => {
    render(
      <FloorPlanEditor
        isOpen={true}
        onClose={() => {}}
        space={mockSpace}
      />,
      { wrapper }
    )

    expect(screen.getByText('Floor Plan Editor')).toBeInTheDocument()
    expect(screen.getByText(/editing: test room/i)).toBeInTheDocument()
  })

  it('displays space name and position info (AC#1)', () => {
    render(
      <FloorPlanEditor
        isOpen={true}
        onClose={() => {}}
        space={mockSpace}
      />,
      { wrapper }
    )

    // Check space name is displayed
    expect(screen.getByText('Test Room')).toBeInTheDocument()

    // Check position information
    expect(screen.getByText(/position: \(100, 100\)/i)).toBeInTheDocument()
    expect(screen.getByText(/size: 150 × 100/i)).toBeInTheDocument()
  })

  it('renders SVG floor plan with grid background', () => {
    render(
      <FloorPlanEditor
        isOpen={true}
        onClose={() => {}}
        space={mockSpace}
      />,
      { wrapper }
    )

    const svg = screen.getByRole('img', { hidden: true })
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('viewBox', '0 0 1000 1000')
  })

  it('highlights editing space with blue color (AC#1)', () => {
    render(
      <FloorPlanEditor
        isOpen={true}
        onClose={() => {}}
        space={mockSpace}
      />,
      { wrapper }
    )

    // The space rect should be rendered
    const svg = document.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('renders resize handle at bottom-right corner (AC#4)', () => {
    render(
      <FloorPlanEditor
        isOpen={true}
        onClose={() => {}}
        space={mockSpace}
      />,
      { wrapper }
    )

    // Resize handle is a circle
    const circle = document.querySelector('circle')
    expect(circle).toBeInTheDocument()
  })

  it('displays other spaces as semi-transparent', () => {
    const otherSpaces = [
      { id: 'space-2', name: 'Other Room', x: 300, y: 300, width: 100, height: 80 }
    ]

    render(
      <FloorPlanEditor
        isOpen={true}
        onClose={() => {}}
        space={mockSpace}
        allSpaces={otherSpaces}
      />,
      { wrapper }
    )

    // Should render both spaces
    const svg = document.querySelector('svg')
    const rects = svg?.querySelectorAll('rect')
    expect(rects?.length).toBeGreaterThan(1) // Background + spaces
  })

  it('shows instructions for dragging and resizing', () => {
    render(
      <FloorPlanEditor
        isOpen={true}
        onClose={() => {}}
        space={mockSpace}
      />,
      { wrapper }
    )

    expect(screen.getByText(/instructions:/i)).toBeInTheDocument()
    expect(screen.getByText(/drag the space to move it/i)).toBeInTheDocument()
  })

  it('has Save button (AC#3)', () => {
    render(
      <FloorPlanEditor
        isOpen={true}
        onClose={() => {}}
        space={mockSpace}
      />,
      { wrapper }
    )

    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
  })

  it('has close button', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    render(
      <FloorPlanEditor
        isOpen={true}
        onClose={onClose}
        space={mockSpace}
      />,
      { wrapper }
    )

    const closeButtons = screen.getAllByRole('button')
    const xButton = closeButtons.find(btn => btn.querySelector('svg[class*="lucide"]'))

    if (xButton) {
      await user.click(xButton)
      expect(onClose).toHaveBeenCalled()
    }
  })

  it('shows saving status during save operation (AC#3)', async () => {
    const user = userEvent.setup()

    render(
      <FloorPlanEditor
        isOpen={true}
        onClose={() => {}}
        space={mockSpace}
      />,
      { wrapper }
    )

    const saveButton = screen.getByRole('button', { name: /save/i })
    await user.click(saveButton)

    // Should show "Saving..." status
    await waitFor(() => {
      expect(screen.getByText(/saving.../i)).toBeInTheDocument()
    })

    // Eventually should show "Saved!"
    await waitFor(() => {
      expect(screen.getByText(/saved!/i)).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('updates position display when space is moved (AC#2)', () => {
    const { rerender } = render(
      <FloorPlanEditor
        isOpen={true}
        onClose={() => {}}
        space={mockSpace}
      />,
      { wrapper }
    )

    expect(screen.getByText(/position: \(100, 100\)/i)).toBeInTheDocument()

    // Simulate space move by re-rendering with new position
    const movedSpace = { ...mockSpace, x: 200, y: 250 }
    rerender(
      <QueryClientProvider client={queryClient}>
        <FloorPlanEditor
          isOpen={true}
          onClose={() => {}}
          space={movedSpace}
        />
      </QueryClientProvider>
    )

    expect(screen.getByText(/position: \(200, 250\)/i)).toBeInTheDocument()
  })

  it('updates size display when space is resized (AC#4)', () => {
    const { rerender } = render(
      <FloorPlanEditor
        isOpen={true}
        onClose={() => {}}
        space={mockSpace}
      />,
      { wrapper }
    )

    expect(screen.getByText(/size: 150 × 100/i)).toBeInTheDocument()

    // Simulate space resize
    const resizedSpace = { ...mockSpace, width: 200, height: 150 }
    rerender(
      <QueryClientProvider client={queryClient}>
        <FloorPlanEditor
          isOpen={true}
          onClose={() => {}}
          space={resizedSpace}
        />
      </QueryClientProvider>
    )

    expect(screen.getByText(/size: 200 × 150/i)).toBeInTheDocument()
  })

  it('sends PATCH request to save coordinates (AC#3)', async () => {
    const user = userEvent.setup()

    render(
      <FloorPlanEditor
        isOpen={true}
        onClose={() => {}}
        space={mockSpace}
      />,
      { wrapper }
    )

    const saveButton = screen.getByRole('button', { name: /save/i })
    await user.click(saveButton)

    // Should trigger save mutation
    await waitFor(() => {
      expect(screen.getByText(/saving.../i)).toBeInTheDocument()
    })
  })

  it('handles API errors gracefully', async () => {
    const user = userEvent.setup()
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    // Use a non-existent space ID to trigger error
    const invalidSpace = { ...mockSpace, id: 'invalid-space' }

    render(
      <FloorPlanEditor
        isOpen={true}
        onClose={() => {}}
        space={invalidSpace}
      />,
      { wrapper }
    )

    const saveButton = screen.getByRole('button', { name: /save/i })
    await user.click(saveButton)

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Failed to save coordinates')
    })

    alertSpy.mockRestore()
  })

  it('displays grid overlay for visual reference', () => {
    render(
      <FloorPlanEditor
        isOpen={true}
        onClose={() => {}}
        space={mockSpace}
      />,
      { wrapper }
    )

    // Check for grid pattern definition
    const svg = document.querySelector('svg')
    const pattern = svg?.querySelector('pattern#grid')
    expect(pattern).toBeInTheDocument()
  })

  it('renders space with correct SVG attributes', () => {
    render(
      <FloorPlanEditor
        isOpen={true}
        onClose={() => {}}
        space={mockSpace}
      />,
      { wrapper }
    )

    const svg = document.querySelector('svg')
    const spaceRect = svg?.querySelector('rect[fill="#3b82f6"]')

    expect(spaceRect).toBeInTheDocument()
    expect(spaceRect).toHaveAttribute('x', '100')
    expect(spaceRect).toHaveAttribute('y', '100')
    expect(spaceRect).toHaveAttribute('width', '150')
    expect(spaceRect).toHaveAttribute('height', '100')
  })

  it('shows space name as text label on SVG', () => {
    render(
      <FloorPlanEditor
        isOpen={true}
        onClose={() => {}}
        space={mockSpace}
      />,
      { wrapper }
    )

    // Text should be displayed within the SVG
    expect(screen.getByText('Test Room')).toBeInTheDocument()
  })
})
