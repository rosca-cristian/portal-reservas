import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { router } from './index'
import { useAuthStore } from '@/stores/authStore'

// Mock the auth store
vi.mock('@/stores/authStore', () => ({
  useAuthStore: vi.fn(),
}))

describe('Router Configuration', () => {
  beforeEach(() => {
    // Reset mock before each test
    vi.clearAllMocks()
  })

  it('should redirect root path to /spaces', () => {
    // Mock authenticated user
    vi.mocked(useAuthStore).mockReturnValue({
      user: { id: '1', name: 'Test User', email: 'test@example.com', role: 'user' },
      token: 'test-token',
      isAuthenticated: true,
      setAuth: vi.fn(),
      logout: vi.fn(),
    })

    const testRouter = createMemoryRouter(router.routes, {
      initialEntries: ['/'],
    })

    render(<RouterProvider router={testRouter} />)

    // Should redirect to /spaces and show spaces page
    expect(testRouter.state.location.pathname).toBe('/spaces')
  })

  it('should render login page for unauthenticated users at /login', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: vi.fn(),
      logout: vi.fn(),
    })

    const testRouter = createMemoryRouter(router.routes, {
      initialEntries: ['/login'],
    })

    render(<RouterProvider router={testRouter} />)

    expect(screen.getByText(/Login page placeholder/i)).toBeTruthy()
  })

  it('should render register page at /register', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: vi.fn(),
      logout: vi.fn(),
    })

    const testRouter = createMemoryRouter(router.routes, {
      initialEntries: ['/register'],
    })

    render(<RouterProvider router={testRouter} />)

    expect(screen.getByText(/Registration page placeholder/i)).toBeTruthy()
  })

  it('should protect /spaces route and redirect unauthenticated users to login', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: vi.fn(),
      logout: vi.fn(),
    })

    const testRouter = createMemoryRouter(router.routes, {
      initialEntries: ['/spaces'],
    })

    render(<RouterProvider router={testRouter} />)

    // Should redirect to login
    expect(testRouter.state.location.pathname).toBe('/login')
  })

  it('should allow authenticated users to access /spaces', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { id: '1', name: 'Test User', email: 'test@example.com', role: 'user' },
      token: 'test-token',
      isAuthenticated: true,
      setAuth: vi.fn(),
      logout: vi.fn(),
    })

    const testRouter = createMemoryRouter(router.routes, {
      initialEntries: ['/spaces'],
    })

    render(<RouterProvider router={testRouter} />)

    expect(screen.getByText(/Available Spaces/i)).toBeTruthy()
  })

  it('should protect /my-reservations route', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { id: '1', name: 'Test User', email: 'test@example.com', role: 'user' },
      token: 'test-token',
      isAuthenticated: true,
      setAuth: vi.fn(),
      logout: vi.fn(),
    })

    const testRouter = createMemoryRouter(router.routes, {
      initialEntries: ['/my-reservations'],
    })

    render(<RouterProvider router={testRouter} />)

    expect(screen.getByText(/View your reservations/i)).toBeTruthy()
  })

  it('should protect /profile route', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { id: '1', name: 'Test User', email: 'test@example.com', role: 'user' },
      token: 'test-token',
      isAuthenticated: true,
      setAuth: vi.fn(),
      logout: vi.fn(),
    })

    const testRouter = createMemoryRouter(router.routes, {
      initialEntries: ['/profile'],
    })

    render(<RouterProvider router={testRouter} />)

    expect(screen.getByText(/Manage your profile/i)).toBeTruthy()
  })

  it('should protect admin routes and require admin role', () => {
    // Non-admin user should be redirected to unauthorized
    vi.mocked(useAuthStore).mockReturnValue({
      user: { id: '1', name: 'Test User', email: 'test@example.com', role: 'user' },
      token: 'test-token',
      isAuthenticated: true,
      setAuth: vi.fn(),
      logout: vi.fn(),
    })

    const testRouter = createMemoryRouter(router.routes, {
      initialEntries: ['/admin'],
    })

    render(<RouterProvider router={testRouter} />)

    expect(testRouter.state.location.pathname).toBe('/unauthorized')
  })

  it('should allow admin users to access admin routes', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
      token: 'admin-token',
      isAuthenticated: true,
      setAuth: vi.fn(),
      logout: vi.fn(),
    })

    const testRouter = createMemoryRouter(router.routes, {
      initialEntries: ['/admin'],
    })

    render(<RouterProvider router={testRouter} />)

    expect(screen.getByText(/Admin Dashboard/i)).toBeTruthy()
  })

  it('should render admin spaces page for admin users', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
      token: 'admin-token',
      isAuthenticated: true,
      setAuth: vi.fn(),
      logout: vi.fn(),
    })

    const testRouter = createMemoryRouter(router.routes, {
      initialEntries: ['/admin/spaces'],
    })

    render(<RouterProvider router={testRouter} />)

    expect(screen.getByText(/Create, edit, and manage spaces/i)).toBeTruthy()
  })

  it('should render admin reservations page for admin users', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
      token: 'admin-token',
      isAuthenticated: true,
      setAuth: vi.fn(),
      logout: vi.fn(),
    })

    const testRouter = createMemoryRouter(router.routes, {
      initialEntries: ['/admin/reservations'],
    })

    render(<RouterProvider router={testRouter} />)

    expect(screen.getByText(/View and manage all reservations/i)).toBeTruthy()
  })

  it('should render unauthorized page at /unauthorized', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: vi.fn(),
      logout: vi.fn(),
    })

    const testRouter = createMemoryRouter(router.routes, {
      initialEntries: ['/unauthorized'],
    })

    render(<RouterProvider router={testRouter} />)

    expect(screen.getByText(/403/)).toBeTruthy()
    expect(screen.getByText(/Access Denied/i)).toBeTruthy()
  })

  it('should render 404 page for unknown routes', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: vi.fn(),
      logout: vi.fn(),
    })

    const testRouter = createMemoryRouter(router.routes, {
      initialEntries: ['/non-existent-route'],
    })

    render(<RouterProvider router={testRouter} />)

    expect(screen.getByText(/404/)).toBeTruthy()
    expect(screen.getByText(/Page not found/i)).toBeTruthy()
  })

  it('should have MainLayout for public and user routes', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { id: '1', name: 'Test User', email: 'test@example.com', role: 'user' },
      token: 'test-token',
      isAuthenticated: true,
      setAuth: vi.fn(),
      logout: vi.fn(),
    })

    const testRouter = createMemoryRouter(router.routes, {
      initialEntries: ['/spaces'],
    })

    render(<RouterProvider router={testRouter} />)

    // MainLayout should have the main navigation
    expect(screen.getByText(/Space Reservations/i)).toBeTruthy()
  })

  it('should have AdminLayout for admin routes', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
      token: 'admin-token',
      isAuthenticated: true,
      setAuth: vi.fn(),
      logout: vi.fn(),
    })

    const testRouter = createMemoryRouter(router.routes, {
      initialEntries: ['/admin'],
    })

    render(<RouterProvider router={testRouter} />)

    // AdminLayout should have admin panel title
    expect(screen.getByText(/Admin Panel/i)).toBeTruthy()
  })
})
