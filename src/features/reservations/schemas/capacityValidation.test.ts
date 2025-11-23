import { describe, it, expect } from 'vitest';
import { groupRoomBookingSchema } from './booking.schema';

describe('Group Room Capacity Validation', () => {
  describe('Minimum Capacity Validation', () => {
    it('validates group size meets minimum capacity', () => {
      const validData = {
        spaceId: 'space-1',
        date: new Date(),
        startTime: '10:00',
        endTime: '12:00',
        groupSize: 5,
        privacyOption: 'public' as const,
      };

      const result = groupRoomBookingSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects group size of 0', () => {
      const invalidData = {
        spaceId: 'space-1',
        date: new Date(),
        startTime: '10:00',
        endTime: '12:00',
        groupSize: 0,
        privacyOption: 'public' as const,
      };

      const result = groupRoomBookingSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 1');
      }
    });

    it('rejects negative group size', () => {
      const invalidData = {
        spaceId: 'space-1',
        date: new Date(),
        startTime: '10:00',
        endTime: '12:00',
        groupSize: -5,
        privacyOption: 'public' as const,
      };

      const result = groupRoomBookingSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects non-integer group size', () => {
      const invalidData = {
        spaceId: 'space-1',
        date: new Date(),
        startTime: '10:00',
        endTime: '12:00',
        groupSize: 5.5,
        privacyOption: 'public' as const,
      };

      const result = groupRoomBookingSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('whole number');
      }
    });
  });

  describe('Maximum Capacity Validation', () => {
    it('accepts group size at maximum capacity', () => {
      const validData = {
        spaceId: 'space-1',
        date: new Date(),
        startTime: '10:00',
        endTime: '12:00',
        groupSize: 10,
        privacyOption: 'public' as const,
      };

      const result = groupRoomBookingSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    // Note: Maximum capacity validation is handled server-side
    // based on the specific room's maxCapacity
    it('validates group size is a positive integer', () => {
      const validData = {
        spaceId: 'space-1',
        date: new Date(),
        startTime: '10:00',
        endTime: '12:00',
        groupSize: 100,
        privacyOption: 'public' as const,
      };

      // Schema validation passes, but server will reject if > maxCapacity
      const result = groupRoomBookingSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('Privacy Option Validation', () => {
    it('accepts public privacy option', () => {
      const validData = {
        spaceId: 'space-1',
        date: new Date(),
        startTime: '10:00',
        endTime: '12:00',
        groupSize: 5,
        privacyOption: 'public' as const,
      };

      const result = groupRoomBookingSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('accepts private privacy option', () => {
      const validData = {
        spaceId: 'space-1',
        date: new Date(),
        startTime: '10:00',
        endTime: '12:00',
        groupSize: 5,
        privacyOption: 'private' as const,
      };

      const result = groupRoomBookingSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('defaults to public when privacy option is not provided', () => {
      const dataWithoutPrivacy = {
        spaceId: 'space-1',
        date: new Date(),
        startTime: '10:00',
        endTime: '12:00',
        groupSize: 5,
      };

      const result = groupRoomBookingSchema.safeParse(dataWithoutPrivacy);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.privacyOption).toBe('public');
      }
    });
  });
});
