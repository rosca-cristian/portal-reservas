/**
 * Availability Types
 * Story 2.2: Real-Time Availability Overlay
 */

export type AvailabilityStatus = 'AVAILABLE' | 'OCCUPIED' | 'UNAVAILABLE';

export interface SpaceAvailability {
  spaceId: string;
  status: AvailabilityStatus;
  nextAvailable?: string; // ISO datetime string
  reason?: string; // Why unavailable (e.g., "Maintenance", "Closed")
  availableSeats?: number;
  totalSeats?: number;
}

export interface AvailabilityResponse {
  datetime: string; // ISO datetime for which availability is shown
  spaces: SpaceAvailability[];
}

// Color constants for each status
export const AVAILABILITY_COLORS = {
  AVAILABLE: '#10b981', // green-500
  OCCUPIED: '#ef4444', // red-500
  UNAVAILABLE: '#6b7280', // gray-500
  DEFAULT: '#d1d5db', // gray-300
} as const;

// Glassmorphism classes for status badges
export const AVAILABILITY_BADGE_CLASSES = {
  AVAILABLE: 'bg-green-500/20 text-green-700 border-green-500/30',
  OCCUPIED: 'bg-red-500/20 text-red-700 border-red-500/30',
  UNAVAILABLE: 'bg-gray-500/20 text-gray-700 border-gray-500/30',
} as const;
