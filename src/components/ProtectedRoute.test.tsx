import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { useAuthStore } from '@/stores/authStore'
import type { User } from '@/types/api'

const TestComponent = ({ text }: { text: string }) => <div>{text}</div>

const renderWithRouter = (element: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={element} />
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/unauthorized" element={<div>Unauthorized Page</div>} />
      </Routes>
    </BrowserRouter>
  )
}

describe('ProtectedRoute Component - Story 1.6 RBAC', () => {
  beforeEach(() => {
    useAuthStore.getState().logout()
  })

  describe('Authentication Check', () => {
    it('should redirect unauthenticated users to login', () => {
      renderWithRouter(
        <ProtectedRoute>
          <TestComponent text="Protected Content" />
        </ProtectedRoute>
      )

      expect(screen.getByText('Login Page')).toBeInTheDocument()
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    })

    it('should render content for authenticated users', () => {
      const mockUser: User = {
        id: '1',
        name: 'Test User',
        email: 'test@test.com',
        role: 'student',
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

      useAuthStore.getState().setAuth(mockUser, mockToken)

      renderWithRouter(
        <ProtectedRoute>
          <TestComponent text="Protected Content" />
        </ProtectedRoute>
      )

      expect(screen.getByText('Protected Content')).toBeInTheDocument()
      expect(screen.queryByText('Login Page')).not.toBeInTheDocument()
    })
  })

  describe('Role-Based Access Control', () => {
    it('should allow student to access route without role restriction', () => {
      const studentUser: User = {
        id: '1',
        name: 'Student User',
        email: 'student@test.com',
        role: 'student',
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

      useAuthStore.getState().setAuth(studentUser, mockToken)

      renderWithRouter(
        <ProtectedRoute>
          <TestComponent text="Student Content" />
        </ProtectedRoute>
      )

      expect(screen.getByText('Student Content')).toBeInTheDocument()
    })

    it('should allow admin to access admin-only routes', () => {
      const adminUser: User = {
        id: '2',
        name: 'Admin User',
        email: 'admin@test.com',
        role: 'admin',
        createdAt: new Date().toISOString(),
      }

      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
      const payload = btoa(
        JSON.stringify({
          sub: adminUser.id,
          email: adminUser.email,
          name: adminUser.name,
          role: adminUser.role,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 3600,
        })
      )
      const mockToken = `${header}.${payload}.mock-signature`

      useAuthStore.getState().setAuth(adminUser, mockToken)

      renderWithRouter(
        <ProtectedRoute roles={['admin']}>
          <TestComponent text="Admin Content" />
        </ProtectedRoute>
      )

      expect(screen.getByText('Admin Content')).toBeInTheDocument()
    })

    it('should block student from admin-only routes', () => {
      const studentUser: User = {
        id: '1',
        name: 'Student User',
        email: 'student@test.com',
        role: 'student',
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

      useAuthStore.getState().setAuth(studentUser, mockToken)

      renderWithRouter(
        <ProtectedRoute roles={['admin']}>
          <TestComponent text="Admin Content" />
        </ProtectedRoute>
      )

      expect(screen.getByText('Unauthorized Page')).toBeInTheDocument()
      expect(screen.queryByText('Admin Content')).not.toBeInTheDocument()
    })

    it('should allow multiple roles to access route', () => {
      const facultyUser: User = {
        id: '3',
        name: 'Faculty User',
        email: 'faculty@test.com',
        role: 'faculty',
        createdAt: new Date().toISOString(),
      }

      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
      const payload = btoa(
        JSON.stringify({
          sub: facultyUser.id,
          email: facultyUser.email,
          name: facultyUser.name,
          role: facultyUser.role,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 3600,
        })
      )
      const mockToken = `${header}.${payload}.mock-signature`

      useAuthStore.getState().setAuth(facultyUser, mockToken)

      renderWithRouter(
        <ProtectedRoute roles={['faculty', 'admin']}>
          <TestComponent text="Faculty/Admin Content" />
        </ProtectedRoute>
      )

      expect(screen.getByText('Faculty/Admin Content')).toBeInTheDocument()
    })

    it('should block faculty from student-only routes', () => {
      const facultyUser: User = {
        id: '3',
        name: 'Faculty User',
        email: 'faculty@test.com',
        role: 'faculty',
        createdAt: new Date().toISOString(),
      }

      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
      const payload = btoa(
        JSON.stringify({
          sub: facultyUser.id,
          email: facultyUser.email,
          name: facultyUser.name,
          role: facultyUser.role,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 3600,
        })
      )
      const mockToken = `${header}.${payload}.mock-signature`

      useAuthStore.getState().setAuth(facultyUser, mockToken)

      renderWithRouter(
        <ProtectedRoute roles={['student']}>
          <TestComponent text="Student Only Content" />
        </ProtectedRoute>
      )

      expect(screen.getByText('Unauthorized Page')).toBeInTheDocument()
      expect(screen.queryByText('Student Only Content')).not.toBeInTheDocument()
    })
  })

  describe('Admin Access', () => {
    it('should allow admin to access all routes including student routes', () => {
      const adminUser: User = {
        id: '2',
        name: 'Admin User',
        email: 'admin@test.com',
        role: 'admin',
        createdAt: new Date().toISOString(),
      }

      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
      const payload = btoa(
        JSON.stringify({
          sub: adminUser.id,
          email: adminUser.email,
          name: adminUser.name,
          role: adminUser.role,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 3600,
        })
      )
      const mockToken = `${header}.${payload}.mock-signature`

      useAuthStore.getState().setAuth(adminUser, mockToken)

      renderWithRouter(
        <ProtectedRoute roles={['student', 'admin']}>
          <TestComponent text="Student or Admin Content" />
        </ProtectedRoute>
      )

      expect(screen.getByText('Student or Admin Content')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle missing user gracefully', () => {
      // Set authenticated but with no user (edge case)
      useAuthStore.setState({ isAuthenticated: true, user: null, token: null })

      renderWithRouter(
        <ProtectedRoute>
          <TestComponent text="Protected Content" />
        </ProtectedRoute>
      )

      // Should redirect to login since user is null
      expect(screen.getByText('Login Page')).toBeInTheDocument()
    })

    it('should allow access when no roles are specified', () => {
      const studentUser: User = {
        id: '1',
        name: 'Student User',
        email: 'student@test.com',
        role: 'student',
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

      useAuthStore.getState().setAuth(studentUser, mockToken)

      renderWithRouter(
        <ProtectedRoute>
          <TestComponent text="Any Authenticated User" />
        </ProtectedRoute>
      )

      expect(screen.getByText('Any Authenticated User')).toBeInTheDocument()
    })
  })
})
