import { apiClient } from '../api/client'
import type { LoginRequest, LoginResponse, User } from '@/types/api'
import { parseJWT } from './jwt'

/**
 * Login with email and password
 */
export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await apiClient.post<{ data: LoginResponse }>('/api/auth/login', {
    email,
    password,
  } as LoginRequest)

  return response.data.data
}

/**
 * Logout and clear session
 */
export async function logout(): Promise<void> {
  try {
    await apiClient.post('/api/auth/logout')
  } catch (error) {
    // Logout locally even if server request fails
    console.error('Logout request failed:', error)
  }
}

/**
 * Get current user from token
 */
export async function getCurrentUser(): Promise<User> {
  const response = await apiClient.get<{ data: { user: User } }>('/api/auth/me')
  return response.data.data.user
}

/**
 * Refresh authentication token
 * TODO: Implement token refresh when backend supports it
 */
export async function refreshToken(): Promise<LoginResponse> {
  const response = await apiClient.post<{ data: LoginResponse }>('/api/auth/refresh')
  return response.data.data
}

/**
 * Extract user data from JWT token
 */
export function getUserFromToken(token: string): Partial<User> | null {
  const payload = parseJWT(token)
  if (!payload) return null

  return {
    id: payload.userId || payload.sub,
    email: payload.email,
    name: payload.name,
    role: payload.role?.toLowerCase(), // Convert STUDENT -> student
    major: payload.major,
    department: payload.department,
    createdAt: new Date(payload.iat * 1000).toISOString(),
  }
}
