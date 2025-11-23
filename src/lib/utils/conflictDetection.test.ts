/**
 * Conflict Detection Utilities Tests
 * Story 3.5: Reservation Conflict Prevention
 */

import { describe, it, expect } from 'vitest';
import {
  hasTimeOverlap,
  hasExactTimeMatch,
  findConflicts,
  checkUserReservationConflict,
} from './conflictDetection';

describe('conflictDetection', () => {
  describe('hasTimeOverlap', () => {
    it('detects overlapping time slots', () => {
      const slot1 = {
        startTime: '2025-01-15T10:00:00.000Z',
        endTime: '2025-01-15T12:00:00.000Z',
      };
      const slot2 = {
        startTime: '2025-01-15T11:00:00.000Z',
        endTime: '2025-01-15T13:00:00.000Z',
      };

      expect(hasTimeOverlap(slot1, slot2)).toBe(true);
    });

    it('detects when one slot contains another', () => {
      const outer = {
        startTime: '2025-01-15T09:00:00.000Z',
        endTime: '2025-01-15T15:00:00.000Z',
      };
      const inner = {
        startTime: '2025-01-15T11:00:00.000Z',
        endTime: '2025-01-15T13:00:00.000Z',
      };

      expect(hasTimeOverlap(outer, inner)).toBe(true);
      expect(hasTimeOverlap(inner, outer)).toBe(true);
    });

    it('returns false for non-overlapping slots', () => {
      const slot1 = {
        startTime: '2025-01-15T10:00:00.000Z',
        endTime: '2025-01-15T12:00:00.000Z',
      };
      const slot2 = {
        startTime: '2025-01-15T13:00:00.000Z',
        endTime: '2025-01-15T15:00:00.000Z',
      };

      expect(hasTimeOverlap(slot1, slot2)).toBe(false);
    });

    it('returns false for adjacent slots (no overlap)', () => {
      const slot1 = {
        startTime: '2025-01-15T10:00:00.000Z',
        endTime: '2025-01-15T12:00:00.000Z',
      };
      const slot2 = {
        startTime: '2025-01-15T12:00:00.000Z',
        endTime: '2025-01-15T14:00:00.000Z',
      };

      expect(hasTimeOverlap(slot1, slot2)).toBe(false);
    });

    it('detects exact same time slots as overlapping', () => {
      const slot = {
        startTime: '2025-01-15T10:00:00.000Z',
        endTime: '2025-01-15T12:00:00.000Z',
      };

      expect(hasTimeOverlap(slot, slot)).toBe(true);
    });
  });

  describe('hasExactTimeMatch', () => {
    it('returns true for identical time slots', () => {
      const slot1 = {
        startTime: '2025-01-15T10:00:00.000Z',
        endTime: '2025-01-15T12:00:00.000Z',
      };
      const slot2 = {
        startTime: '2025-01-15T10:00:00.000Z',
        endTime: '2025-01-15T12:00:00.000Z',
      };

      expect(hasExactTimeMatch(slot1, slot2)).toBe(true);
    });

    it('returns false for different start times', () => {
      const slot1 = {
        startTime: '2025-01-15T10:00:00.000Z',
        endTime: '2025-01-15T12:00:00.000Z',
      };
      const slot2 = {
        startTime: '2025-01-15T10:30:00.000Z',
        endTime: '2025-01-15T12:00:00.000Z',
      };

      expect(hasExactTimeMatch(slot1, slot2)).toBe(false);
    });

    it('returns false for different end times', () => {
      const slot1 = {
        startTime: '2025-01-15T10:00:00.000Z',
        endTime: '2025-01-15T12:00:00.000Z',
      };
      const slot2 = {
        startTime: '2025-01-15T10:00:00.000Z',
        endTime: '2025-01-15T12:30:00.000Z',
      };

      expect(hasExactTimeMatch(slot1, slot2)).toBe(false);
    });
  });

  describe('findConflicts', () => {
    it('finds all conflicting reservations', () => {
      const proposedSlot = {
        startTime: '2025-01-15T11:00:00.000Z',
        endTime: '2025-01-15T13:00:00.000Z',
      };

      const existingReservations = [
        {
          id: '1',
          startTime: '2025-01-15T10:00:00.000Z',
          endTime: '2025-01-15T12:00:00.000Z',
        },
        {
          id: '2',
          startTime: '2025-01-15T14:00:00.000Z',
          endTime: '2025-01-15T16:00:00.000Z',
        },
        {
          id: '3',
          startTime: '2025-01-15T12:30:00.000Z',
          endTime: '2025-01-15T14:30:00.000Z',
        },
      ];

      const conflicts = findConflicts(proposedSlot, existingReservations);

      expect(conflicts).toHaveLength(2);
      expect(conflicts.map(c => c.id)).toEqual(['1', '3']);
    });

    it('returns empty array when no conflicts exist', () => {
      const proposedSlot = {
        startTime: '2025-01-15T10:00:00.000Z',
        endTime: '2025-01-15T11:00:00.000Z',
      };

      const existingReservations = [
        {
          id: '1',
          startTime: '2025-01-15T12:00:00.000Z',
          endTime: '2025-01-15T13:00:00.000Z',
        },
        {
          id: '2',
          startTime: '2025-01-15T14:00:00.000Z',
          endTime: '2025-01-15T15:00:00.000Z',
        },
      ];

      const conflicts = findConflicts(proposedSlot, existingReservations);

      expect(conflicts).toHaveLength(0);
    });

    it('handles empty reservations list', () => {
      const proposedSlot = {
        startTime: '2025-01-15T10:00:00.000Z',
        endTime: '2025-01-15T11:00:00.000Z',
      };

      const conflicts = findConflicts(proposedSlot, []);

      expect(conflicts).toHaveLength(0);
    });
  });

  describe('checkUserReservationConflict', () => {
    it('identifies conflict when user has overlapping reservation', () => {
      const newReservation = {
        startTime: '2025-01-15T11:00:00.000Z',
        endTime: '2025-01-15T13:00:00.000Z',
      };

      const userReservations = [
        {
          startTime: '2025-01-15T10:00:00.000Z',
          endTime: '2025-01-15T12:00:00.000Z',
        },
      ];

      const result = checkUserReservationConflict(userReservations, newReservation);

      expect(result.hasConflict).toBe(true);
      expect(result.conflictingReservation).toBeDefined();
      expect(result.conflictingReservation?.startTime).toBe('2025-01-15T10:00:00.000Z');
    });

    it('returns no conflict when slots do not overlap', () => {
      const newReservation = {
        startTime: '2025-01-15T14:00:00.000Z',
        endTime: '2025-01-15T15:00:00.000Z',
      };

      const userReservations = [
        {
          startTime: '2025-01-15T10:00:00.000Z',
          endTime: '2025-01-15T12:00:00.000Z',
        },
      ];

      const result = checkUserReservationConflict(userReservations, newReservation);

      expect(result.hasConflict).toBe(false);
      expect(result.conflictingReservation).toBeUndefined();
    });

    it('returns first conflicting reservation when multiple conflicts exist', () => {
      const newReservation = {
        startTime: '2025-01-15T11:00:00.000Z',
        endTime: '2025-01-15T15:00:00.000Z',
      };

      const userReservations = [
        {
          startTime: '2025-01-15T10:00:00.000Z',
          endTime: '2025-01-15T12:00:00.000Z',
        },
        {
          startTime: '2025-01-15T14:00:00.000Z',
          endTime: '2025-01-15T16:00:00.000Z',
        },
      ];

      const result = checkUserReservationConflict(userReservations, newReservation);

      expect(result.hasConflict).toBe(true);
      expect(result.conflictingReservation?.startTime).toBe('2025-01-15T10:00:00.000Z');
    });
  });
});
