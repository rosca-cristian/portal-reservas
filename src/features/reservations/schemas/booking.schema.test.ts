/**
 * Booking Schema Validation Tests
 * Story 3.1 & 3.2: Booking Wizard Validation
 */

import { describe, it, expect } from 'vitest';
import { addDays } from 'date-fns';
import { bookingStepOneSchema, bookingStepTwoSchema } from './booking.schema';

describe('booking.schema', () => {
  describe('bookingStepOneSchema', () => {
    it('validates correct step one data', () => {
      const tomorrow = addDays(new Date(), 1);
      const validData = {
        spaceId: '123e4567-e89b-12d3-a456-426614174000',
        date: tomorrow,
        startTime: '10:00',
        duration: 2,
      };

      const result = bookingStepOneSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('rejects invalid UUID for spaceId', () => {
      const tomorrow = addDays(new Date(), 1);
      const invalidData = {
        spaceId: 'not-a-uuid',
        date: tomorrow,
        startTime: '10:00',
        duration: 1,
      };

      const result = bookingStepOneSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('Invalid space ID');
      }
    });

    it('rejects past dates', () => {
      const pastDate = new Date('2020-01-01');
      const invalidData = {
        spaceId: '123e4567-e89b-12d3-a456-426614174000',
        date: pastDate,
        startTime: '10:00',
        duration: 1,
      };

      const result = bookingStepOneSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('Cannot book past dates');
      }
    });

    it('rejects dates more than 7 days in advance', () => {
      const farFutureDate = addDays(new Date(), 8);
      const invalidData = {
        spaceId: '123e4567-e89b-12d3-a456-426614174000',
        date: farFutureDate,
        startTime: '10:00',
        duration: 1,
      };

      const result = bookingStepOneSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('Can only book up to 7 days in advance');
      }
    });

    it('rejects invalid time format', () => {
      const tomorrow = addDays(new Date(), 1);
      const invalidData = {
        spaceId: '123e4567-e89b-12d3-a456-426614174000',
        date: tomorrow,
        startTime: '10:0', // Invalid format (missing second digit)
        duration: 1,
      };

      const result = bookingStepOneSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('Invalid time format');
      }
    });

    it('accepts valid time formats', () => {
      const tomorrow = addDays(new Date(), 1);
      const validTimes = ['00:00', '09:30', '12:00', '23:59'];

      validTimes.forEach(time => {
        const validData = {
          spaceId: '123e4567-e89b-12d3-a456-426614174000',
          date: tomorrow,
          startTime: time,
          duration: 1,
        };

        const result = bookingStepOneSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    it('rejects negative duration', () => {
      const tomorrow = addDays(new Date(), 1);
      const invalidData = {
        spaceId: '123e4567-e89b-12d3-a456-426614174000',
        date: tomorrow,
        startTime: '10:00',
        duration: -1,
      };

      const result = bookingStepOneSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });

    it('rejects zero duration', () => {
      const tomorrow = addDays(new Date(), 1);
      const invalidData = {
        spaceId: '123e4567-e89b-12d3-a456-426614174000',
        date: tomorrow,
        startTime: '10:00',
        duration: 0,
      };

      const result = bookingStepOneSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });

    it('defaults duration to 1 if not provided', () => {
      const tomorrow = addDays(new Date(), 1);
      const dataWithoutDuration = {
        spaceId: '123e4567-e89b-12d3-a456-426614174000',
        date: tomorrow,
        startTime: '10:00',
      };

      const result = bookingStepOneSchema.safeParse(dataWithoutDuration);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.duration).toBe(1);
      }
    });

    it('rejects missing required fields', () => {
      const incompleteData = {
        spaceId: '123e4567-e89b-12d3-a456-426614174000',
        // Missing date and startTime
      };

      const result = bookingStepOneSchema.safeParse(incompleteData);

      expect(result.success).toBe(false);
    });
  });

  describe('bookingStepTwoSchema', () => {
    it('validates correct step two data without notes', () => {
      const validData = {
        notes: '',
      };

      const result = bookingStepTwoSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('validates correct step two data with notes', () => {
      const validData = {
        notes: 'Need extra monitors for presentation',
      };

      const result = bookingStepTwoSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('rejects notes longer than 500 characters', () => {
      const longNotes = 'a'.repeat(501);
      const invalidData = {
        notes: longNotes,
      };

      const result = bookingStepTwoSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('Notes cannot exceed 500 characters');
      }
    });

    it('accepts notes with exactly 500 characters', () => {
      const maxNotes = 'a'.repeat(500);
      const validData = {
        notes: maxNotes,
      };

      const result = bookingStepTwoSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('accepts empty notes', () => {
      const validData = {
        notes: '',
      };

      const result = bookingStepTwoSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('accepts undefined notes', () => {
      const validData = {};

      const result = bookingStepTwoSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('accepts notes with special characters', () => {
      const validData = {
        notes: 'Need: computer, monitor, keyboard & mouse!',
      };

      const result = bookingStepTwoSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });
  });
});
