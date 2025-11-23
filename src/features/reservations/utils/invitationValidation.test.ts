import { describe, it, expect } from 'vitest';
import { addDays, subDays } from 'date-fns';
import { validateInvitation } from './invitationValidation';
import type { Reservation } from '@/types/reservation';

describe('validateInvitation', () => {
  const mockReservation: Reservation = {
    id: '1',
    spaceId: 'space-1',
    spaceName: 'Study Room A',
    spaceType: 'group_study_room',
    startTime: addDays(new Date(), 1).toISOString(),
    endTime: addDays(new Date(), 1).toISOString(),
    status: 'confirmed',
    type: 'group',
    groupSize: 5,
    privacyOption: 'public',
    invitationToken: 'token-123',
    minCapacity: 4,
    maxCapacity: 10,
    participants: [
      { userId: 'user-1', name: 'Alice', email: 'alice@example.com', joinedAt: new Date().toISOString() },
      { userId: 'user-2', name: 'Bob', email: 'bob@example.com', joinedAt: new Date().toISOString() },
    ],
  };

  it('returns valid for a valid invitation', () => {
    const result = validateInvitation(
      mockReservation,
      'user-3',
      subDays(new Date(), 5)
    );

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('detects expired invitation (> 30 days)', () => {
    const result = validateInvitation(
      mockReservation,
      'user-3',
      subDays(new Date(), 31)
    );

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('This invitation link has expired');
  });

  it('detects reservation at capacity', () => {
    const fullReservation = {
      ...mockReservation,
      maxCapacity: 2,
    };

    const result = validateInvitation(
      fullReservation,
      'user-3',
      subDays(new Date(), 5)
    );

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('This reservation is at full capacity');
  });

  it('detects reservation that already started', () => {
    const startedReservation = {
      ...mockReservation,
      startTime: subDays(new Date(), 1).toISOString(),
    };

    const result = validateInvitation(
      startedReservation,
      'user-3',
      subDays(new Date(), 5)
    );

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('This reservation has already started');
  });

  it('detects user already joined', () => {
    const result = validateInvitation(
      mockReservation,
      'user-1',
      subDays(new Date(), 5)
    );

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('You have already joined this reservation');
  });

  it('detects cancelled reservation', () => {
    const cancelledReservation = {
      ...mockReservation,
      status: 'cancelled' as const,
    };

    const result = validateInvitation(
      cancelledReservation,
      'user-3',
      subDays(new Date(), 5)
    );

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('This reservation has been cancelled');
  });

  it('handles reservation without participants', () => {
    const noParticipantsReservation = {
      ...mockReservation,
      participants: undefined,
    };

    const result = validateInvitation(
      noParticipantsReservation,
      'user-3',
      subDays(new Date(), 5)
    );

    expect(result.isValid).toBe(true);
  });

  it('returns all validation errors when multiple issues exist', () => {
    const problematicReservation = {
      ...mockReservation,
      startTime: subDays(new Date(), 1).toISOString(),
      maxCapacity: 2,
      status: 'cancelled' as const,
    };

    const result = validateInvitation(
      problematicReservation,
      'user-1',
      subDays(new Date(), 31)
    );

    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(1);
  });

  it('validates on the 30th day (edge case)', () => {
    const result = validateInvitation(
      mockReservation,
      'user-3',
      subDays(new Date(), 30)
    );

    // Should still be valid on day 30
    expect(result.isValid).toBe(true);
  });
});
