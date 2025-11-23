import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAuthStore } from './authStore'

describe('Auth Store', () => {
  beforeEach(() => {
    // Clear store before each test
    useAuthStore.getState().logout()
  })

  it('should initialize with empty state', () => {
    const { result } = renderHook(() => useAuthStore())

    expect(result.current.user).toBeNull()
    expect(result.current.token).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should set authentication with valid JWT token', () => {
    const { result } = renderHook(() => useAuthStore())

    const mockUser = {
      id: 'test-1',
      name: 'Test User',
      email: 'test@test.com',
      role: 'student' as const,
      createdAt: new Date().toISOString(),
    }

    // Create valid JWT token (1 hour expiration)
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const payload = btoa(
      JSON.stringify({
        sub: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      })
    )
    const mockToken = `${header}.${payload}.mock-signature`

    act(() => {
      result.current.setAuth(mockUser, mockToken)
    })

    expect(result.current.user).toEqual(mockUser)
    expect(result.current.token).toBe(mockToken)
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('should logout and clear state', () => {
    const { result } = renderHook(() => useAuthStore())

    const mockUser = {
      id: 'test-1',
      name: 'Test User',
      email: 'test@test.com',
      role: 'student' as const,
      createdAt: new Date().toISOString(),
    }

    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const payload = btoa(
      JSON.stringify({
        sub: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      })
    )
    const mockToken = `${header}.${payload}.mock-signature`

    act(() => {
      result.current.setAuth(mockUser, mockToken)
    })

    expect(result.current.isAuthenticated).toBe(true)

    act(() => {
      result.current.logout()
    })

    expect(result.current.user).toBeNull()
    expect(result.current.token).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('should check role helpers', () => {
    const { result } = renderHook(() => useAuthStore())

    const studentUser = {
      id: 'test-1',
      name: 'Student',
      email: 'student@test.com',
      role: 'student' as const,
      createdAt: new Date().toISOString(),
    }

    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const payload = btoa(
      JSON.stringify({
        sub: studentUser.id,
        email: studentUser.email,
        name: studentUser.name,
        role: studentUser.role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      })
    )
    const mockToken = `${header}.${payload}.mock-signature`

    act(() => {
      result.current.setAuth(studentUser, mockToken)
    })

    expect(result.current.isStudent()).toBe(true)
    expect(result.current.isFaculty()).toBe(false)
    expect(result.current.isAdmin()).toBe(false)
    expect(result.current.hasRole('student')).toBe(true)
    expect(result.current.hasRole(['student', 'faculty'])).toBe(true)
    expect(result.current.hasRole('admin')).toBe(false)
  })

  it('should set loading state', () => {
    const { result } = renderHook(() => useAuthStore())

    act(() => {
      result.current.setLoading(true)
    })

    expect(result.current.isLoading).toBe(true)

    act(() => {
      result.current.setLoading(false)
    })

    expect(result.current.isLoading).toBe(false)
  })

  it('should set error state', () => {
    const { result } = renderHook(() => useAuthStore())

    act(() => {
      result.current.setError('Test error')
    })

    expect(result.current.error).toBe('Test error')
    expect(result.current.isLoading).toBe(false)
  })

  it('should reject expired token', () => {
    const { result } = renderHook(() => useAuthStore())

    const mockUser = {
      id: 'test-1',
      name: 'Test User',
      email: 'test@test.com',
      role: 'student' as const,
      createdAt: new Date().toISOString(),
    }

    // Create expired JWT token
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const payload = btoa(
      JSON.stringify({
        sub: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        iat: Math.floor(Date.now() / 1000) - 7200, // 2 hours ago
        exp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago (expired)
      })
    )
    const expiredToken = `${header}.${payload}.mock-signature`

    act(() => {
      result.current.setAuth(mockUser, expiredToken)
    })

    // Should not set auth with expired token
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.error).toBeTruthy()
  })
})
