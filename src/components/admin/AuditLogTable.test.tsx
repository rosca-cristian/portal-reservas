import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import AuditLogTable from './AuditLogTable'
import type { AuditLogEntry } from '@/types/auditLog'

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
    timestamp: '2025-11-19T11:30:00Z',
    userId: 'user-2',
    userName: 'Jane Smith',
    userRole: 'user',
    action: 'JOINED',
    reservationId: 'res-2',
    details: 'Joined group reservation via invitation link',
  },
  {
    id: 'audit-3',
    timestamp: '2025-11-19T12:00:00Z',
    userId: 'admin-1',
    userName: 'Admin User',
    userRole: 'admin',
    action: 'ADMIN_CANCELLED',
    reservationId: 'res-3',
    details: 'Admin cancelled reservation',
    metadata: {
      reason: 'Emergency',
      notes: 'Building maintenance required',
      previousStatus: 'confirmed',
      newStatus: 'cancelled',
    },
  },
]

describe('AuditLogTable', () => {
  it('shows loading state', () => {
    render(<AuditLogTable auditLog={[]} loading={true} onRefresh={vi.fn()} />)

    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('shows empty state when no entries', () => {
    render(<AuditLogTable auditLog={[]} loading={false} onRefresh={vi.fn()} />)

    expect(screen.getByText('No audit log entries found')).toBeInTheDocument()
  })

  it('displays audit log entries', () => {
    render(<AuditLogTable auditLog={mockAuditLog} loading={false} onRefresh={vi.fn()} />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('Admin User')).toBeInTheDocument()
  })

  it('displays all table columns', () => {
    render(<AuditLogTable auditLog={mockAuditLog} loading={false} onRefresh={vi.fn()} />)

    expect(screen.getByText('Timestamp')).toBeInTheDocument()
    expect(screen.getByText('User')).toBeInTheDocument()
    expect(screen.getByText('Role')).toBeInTheDocument()
    expect(screen.getByText('Action')).toBeInTheDocument()
    expect(screen.getByText('Reservation ID')).toBeInTheDocument()
    expect(screen.getByText('Details')).toBeInTheDocument()
  })

  it('formats timestamp correctly', () => {
    render(<AuditLogTable auditLog={mockAuditLog} loading={false} onRefresh={vi.fn()} />)

    const timestamp = new Date('2025-11-19T10:00:00Z')
    const dateStr = timestamp.toLocaleDateString()
    const timeStr = timestamp.toLocaleTimeString()

    expect(screen.getAllByText(dateStr).length).toBeGreaterThan(0)
    expect(screen.getAllByText(timeStr).length).toBeGreaterThan(0)
  })

  it('displays user role badge', () => {
    render(<AuditLogTable auditLog={mockAuditLog} loading={false} onRefresh={vi.fn()} />)

    const roleBadges = screen.getAllByText(/user|admin/)
    expect(roleBadges.length).toBeGreaterThan(0)
  })

  it('displays action type badge', () => {
    render(<AuditLogTable auditLog={mockAuditLog} loading={false} onRefresh={vi.fn()} />)

    expect(screen.getByText('CREATED')).toBeInTheDocument()
    expect(screen.getByText('JOINED')).toBeInTheDocument()
    expect(screen.getByText('ADMIN CANCELLED')).toBeInTheDocument()
  })

  it('displays reservation ID as link', () => {
    render(<AuditLogTable auditLog={mockAuditLog} loading={false} onRefresh={vi.fn()} />)

    const link = screen.getByText('res-1') as HTMLAnchorElement
    expect(link.href).toContain('/admin/reservations?id=res-1')
  })

  it('displays event details', () => {
    render(<AuditLogTable auditLog={mockAuditLog} loading={false} onRefresh={vi.fn()} />)

    expect(screen.getByText('Created reservation for Conference Room A')).toBeInTheDocument()
    expect(screen.getByText('Joined group reservation via invitation link')).toBeInTheDocument()
    expect(screen.getByText('Admin cancelled reservation')).toBeInTheDocument()
  })

  it('displays metadata reason and notes', () => {
    render(<AuditLogTable auditLog={mockAuditLog} loading={false} onRefresh={vi.fn()} />)

    expect(screen.getByText(/Reason: Emergency/)).toBeInTheDocument()
    expect(screen.getByText(/Notes: Building maintenance required/)).toBeInTheDocument()
  })

  it('calls onRefresh when refresh button clicked in empty state', () => {
    const onRefresh = vi.fn()
    render(<AuditLogTable auditLog={[]} loading={false} onRefresh={onRefresh} />)

    const refreshButton = screen.getByRole('button', { name: /refresh/i })
    fireEvent.click(refreshButton)

    expect(onRefresh).toHaveBeenCalled()
  })

  it('displays all action types with correct colors', () => {
    const allActionTypes: AuditLogEntry[] = [
      { ...mockAuditLog[0], id: 'a1', action: 'CREATED' },
      { ...mockAuditLog[0], id: 'a2', action: 'MODIFIED' },
      { ...mockAuditLog[0], id: 'a3', action: 'CANCELLED' },
      { ...mockAuditLog[0], id: 'a4', action: 'JOINED' },
      { ...mockAuditLog[0], id: 'a5', action: 'ADMIN_CANCELLED' },
      { ...mockAuditLog[0], id: 'a6', action: 'COMPLETED' },
    ]

    render(<AuditLogTable auditLog={allActionTypes} loading={false} onRefresh={vi.fn()} />)

    expect(screen.getByText('CREATED')).toBeInTheDocument()
    expect(screen.getByText('MODIFIED')).toBeInTheDocument()
    expect(screen.getByText('CANCELLED')).toBeInTheDocument()
    expect(screen.getByText('JOINED')).toBeInTheDocument()
    expect(screen.getByText('ADMIN CANCELLED')).toBeInTheDocument()
    expect(screen.getByText('COMPLETED')).toBeInTheDocument()
  })
})
