// Base API response wrapper
export interface ApiResponse<T> {
  data: T
  meta?: {
    page?: number
    limit?: number
    total?: number
  }
}

// Error response
export interface ApiError {
  error: {
    code: string
    message: string
    details?: unknown
  }
}

// User types
export interface User {
  id: string
  name: string
  email: string
  role: 'student' | 'faculty' | 'admin'
  major?: string // For students
  department?: string // For faculty/admin
  photoUrl?: string
  createdAt: string
}

// Space types
export type SpaceType = 'desk' | 'group-room'

export interface FloorPlanCoordinates {
  x: number
  y: number
  width: number
  height: number
}

export interface Space {
  id: string
  name: string
  type: SpaceType
  capacity: number
  equipment: string[]
  floorPlanCoordinates: FloorPlanCoordinates
  photos: string[]
  description: string
  floor: number
  building: string
  isAvailable: boolean
}

// Reservation types
export type ReservationStatus = 'confirmed' | 'cancelled' | 'completed'

export interface Reservation {
  id: string
  spaceId: string
  userId: string
  startTime: string // ISO 8601
  endTime: string // ISO 8601
  status: ReservationStatus
  participants?: string[] // For group rooms (user IDs)
  invitationLink?: string // For group rooms
  createdAt: string
  updatedAt: string
}

// Request types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  role: 'student' | 'faculty'
  major?: string
  department?: string
}

export interface CreateReservationRequest {
  spaceId: string
  startTime: string // ISO 8601
  endTime: string // ISO 8601
  participants?: string[] // For group rooms
}

// Response types
export interface LoginResponse {
  token: string
  user: User
}

export interface AuthMeResponse {
  user: User
}

// Availability types
export interface TimeSlot {
  startTime: string
  endTime: string
  isAvailable: boolean
  reservationId?: string
}

export interface AvailabilityResponse {
  spaceId: string
  date: string
  timeSlots: TimeSlot[]
}

// Query parameters
export interface SpacesQueryParams {
  page?: number
  limit?: number
  type?: SpaceType
  search?: string
  floor?: number
  building?: string
  minCapacity?: number
  equipment?: string[]
}

export interface ReservationsQueryParams {
  page?: number
  limit?: number
  status?: ReservationStatus
  startDate?: string
  endDate?: string
}
