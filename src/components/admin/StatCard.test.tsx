import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Building2 } from 'lucide-react'
import { StatCard } from './StatCard'

describe('StatCard', () => {
  it('renders title and value', () => {
    render(<StatCard title="Total Spaces" value={25} icon={Building2} />)

    expect(screen.getByText('Total Spaces')).toBeInTheDocument()
    expect(screen.getByText('25')).toBeInTheDocument()
  })

  it('renders optional description', () => {
    render(
      <StatCard
        title="Total Spaces"
        value={25}
        icon={Building2}
        description="All registered spaces"
      />
    )

    expect(screen.getByText('All registered spaces')).toBeInTheDocument()
  })

  it('renders with string value', () => {
    render(<StatCard title="Status" value="Active" icon={Building2} />)

    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
  })
})
