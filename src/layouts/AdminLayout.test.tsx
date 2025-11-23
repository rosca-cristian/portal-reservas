import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AdminLayout from './AdminLayout'
import { useAuthStore } from '@/stores/authStore'

vi.mock('@/stores/authStore')

const mockUser = {
  id: '1',
  name: 'Admin User',
  email: 'admin@test.com',
  role: 'admin' as const
}

describe('AdminLayout', () => {
  beforeEach(() => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      logout: vi.fn(),
      login: vi.fn(),
      register: vi.fn()
    })
  })

  it('renders admin panel title', () => {
    render(
      <BrowserRouter>
        <AdminLayout />
      </BrowserRouter>
    )

    expect(screen.getByText('Admin Panel')).toBeInTheDocument()
  })

  it('renders all navigation links - Dashboard, Spaces, Reservations, Reports, Settings (AC#3)', () => {
    render(
      <BrowserRouter>
        <AdminLayout />
      </BrowserRouter>
    )

    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /spaces/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /reservations/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /reports/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /settings/i })).toBeInTheDocument()
  })

  it('renders user info with admin role indicator', () => {
    render(
      <BrowserRouter>
        <AdminLayout />
      </BrowserRouter>
    )

    expect(screen.getByText(mockUser.name)).toBeInTheDocument()
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })

  it('renders logout button', () => {
    render(
      <BrowserRouter>
        <AdminLayout />
      </BrowserRouter>
    )

    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()
  })

  it('renders back to user view link', () => {
    render(
      <BrowserRouter>
        <AdminLayout />
      </BrowserRouter>
    )

    expect(screen.getByText(/back to user view/i)).toBeInTheDocument()
  })
})
