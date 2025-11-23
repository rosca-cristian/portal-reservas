import { isAfter, addDays } from 'date-fns';
import type { Reservation } from '@/types/reservation';

export type InvitationErrorCode =
  | 'EXPIRED'
  | 'FULL'
  | 'STARTED'
  | 'CANCELLED'
  | 'ALREADY_JOINED'
  | 'INVALID';

export interface InvitationValidation {
  isValid: boolean;
  canJoin: boolean;
  error?: {
    code: InvitationErrorCode;
    message: string;
  };
}

/**
 * Validate if an invitation can be used
 */
export function validateInvitation(
  reservation: Reservation,
  userId: string,
  invitationCreatedAt: Date
): InvitationValidation {
  // Check if invitation has expired (30 days)
  if (isAfter(new Date(), addDays(invitationCreatedAt, 30))) {
    return {
      isValid: false,
      canJoin: false,
      error: {
        code: 'EXPIRED',
        message: 'This invitation has expired (30 days old)',
      },
    };
  }

  // Check if reservation is cancelled
  if (reservation.status === 'cancelled') {
    return {
      isValid: false,
      canJoin: false,
      error: {
        code: 'CANCELLED',
        message: 'This reservation has been cancelled',
      },
    };
  }

  // Check if reservation has already started or completed
  const now = new Date();
  const startTime = new Date(reservation.startTime);

  if (now >= startTime || reservation.status === 'completed') {
    return {
      isValid: true,
      canJoin: false,
      error: {
        code: 'STARTED',
        message: 'This reservation is no longer accepting participants',
      },
    };
  }

  // Check if user has already joined
  if (reservation.participants?.some(p => p.userId === userId)) {
    return {
      isValid: true,
      canJoin: false,
      error: {
        code: 'ALREADY_JOINED',
        message: 'You are already in this reservation',
      },
    };
  }

  // Check capacity
  const currentCapacity = reservation.participants?.length || 1;
  const maxCapacity = reservation.maxCapacity || 10;

  if (currentCapacity >= maxCapacity) {
    return {
      isValid: true,
      canJoin: false,
      error: {
        code: 'FULL',
        message: 'This reservation has reached maximum capacity',
      },
    };
  }

  // All validations passed
  return {
    isValid: true,
    canJoin: true,
  };
}
