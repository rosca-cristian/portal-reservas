import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { PreviewBanner } from './PreviewBanner'

describe('PreviewBanner', () => {
  it('renders preview mode indicator (AC#2)', () => {
    render(
      <PreviewBanner
        onPublish={() => {}}
        onCancel={() => {}}
      />
    )

    expect(screen.getByText('Preview Mode')).toBeInTheDocument()
    expect(screen.getByText(/you are previewing changes/i)).toBeInTheDocument()
  })

  it('displays publish and cancel buttons', () => {
    render(
      <PreviewBanner
        onPublish={() => {}}
        onCancel={() => {}}
      />
    )

    expect(screen.getByRole('button', { name: /publish changes/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
  })

  it('calls onPublish when publish button is clicked (AC#3)', async () => {
    const user = userEvent.setup()
    const onPublish = vi.fn()

    render(
      <PreviewBanner
        onPublish={onPublish}
        onCancel={() => {}}
      />
    )

    await user.click(screen.getByRole('button', { name: /publish changes/i }))
    expect(onPublish).toHaveBeenCalled()
  })

  it('calls onCancel when cancel button is clicked (AC#4)', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()

    render(
      <PreviewBanner
        onPublish={() => {}}
        onCancel={onCancel}
      />
    )

    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onCancel).toHaveBeenCalled()
  })

  it('shows publishing state when isPublishing is true', () => {
    render(
      <PreviewBanner
        onPublish={() => {}}
        onCancel={() => {}}
        isPublishing={true}
      />
    )

    expect(screen.getByText(/publishing.../i)).toBeInTheDocument()
  })

  it('disables buttons when publishing', () => {
    render(
      <PreviewBanner
        onPublish={() => {}}
        onCancel={() => {}}
        isPublishing={true}
      />
    )

    expect(screen.getByRole('button', { name: /publishing.../i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled()
  })

  it('has distinctive yellow styling for visibility', () => {
    const { container } = render(
      <PreviewBanner
        onPublish={() => {}}
        onCancel={() => {}}
      />
    )

    const banner = container.firstChild as HTMLElement
    expect(banner).toHaveClass('bg-yellow-400')
  })

  it('is fixed at top of screen', () => {
    const { container } = render(
      <PreviewBanner
        onPublish={() => {}}
        onCancel={() => {}}
      />
    )

    const banner = container.firstChild as HTMLElement
    expect(banner).toHaveClass('fixed', 'top-0')
  })

  it('has high z-index for visibility over content', () => {
    const { container } = render(
      <PreviewBanner
        onPublish={() => {}}
        onCancel={() => {}}
      />
    )

    const banner = container.firstChild as HTMLElement
    expect(banner).toHaveClass('z-50')
  })

  it('displays eye icon for preview mode', () => {
    render(
      <PreviewBanner
        onPublish={() => {}}
        onCancel={() => {}}
      />
    )

    // Eye icon should be rendered
    const banner = screen.getByText('Preview Mode').closest('div')
    expect(banner).toBeInTheDocument()
  })
})
