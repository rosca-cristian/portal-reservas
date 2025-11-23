// JWT Token utilities
// Note: This is a simple implementation for parsing JWTs
// For production, consider using a library like jose or jwt-decode

export interface JWTPayload {
  userId: string // User ID (backend uses userId instead of sub)
  sub?: string // Optional sub for compatibility
  email: string
  name?: string
  role: string // Role from backend (STUDENT, FACULTY, ADMIN)
  iat: number // Issued at
  exp: number // Expiration
  major?: string
  department?: string
}

/**
 * Parse a JWT token and extract the payload
 * WARNING: This does NOT verify the signature - only use for reading claims
 * from tokens that have already been validated by the backend
 */
export function parseJWT(token: string): JWTPayload | null {
  try {
    // JWT format: header.payload.signature
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }

    // Decode the payload (middle part)
    const payload = parts[1]
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decoded) as JWTPayload
  } catch (error) {
    console.error('Failed to parse JWT:', error)
    return null
  }
}

/**
 * Check if a JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
  const payload = parseJWT(token)
  if (!payload || !payload.exp) {
    return true
  }

  // exp is in seconds, Date.now() is in milliseconds
  const expirationTime = payload.exp * 1000
  const currentTime = Date.now()

  // Add 60 second buffer to refresh before actual expiration
  return currentTime >= expirationTime - 60000
}

/**
 * Get the time remaining until token expires (in milliseconds)
 */
export function getTokenTimeRemaining(token: string): number {
  const payload = parseJWT(token)
  if (!payload || !payload.exp) {
    return 0
  }

  const expirationTime = payload.exp * 1000
  const currentTime = Date.now()
  return Math.max(0, expirationTime - currentTime)
}

/**
 * Check if token is valid (not expired and has required fields)
 */
export function isTokenValid(token: string): boolean {
  if (!token) return false

  const payload = parseJWT(token)
  if (!payload) return false

  // Check required fields (userId or sub for compatibility)
  if ((!payload.userId && !payload.sub) || !payload.email || !payload.role) {
    return false
  }

  // Check if expired
  if (isTokenExpired(token)) {
    return false
  }

  return true
}
