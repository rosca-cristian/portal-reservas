import { z } from 'zod';
import { addDays } from 'date-fns';

// Booking Step One Schema - Date and Time Selection
export const bookingStepOneSchema = z.object({
  spaceId: z.string().uuid('Invalid space ID'),
  date: z.date()
    .min(new Date(), 'Cannot book past dates')
    .max(addDays(new Date(), 7), 'Can only book up to 7 days in advance'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
  duration: z.number().int().positive().default(1), // hours
});

// Booking Step Two Schema - Review and Confirmation
export const bookingStepTwoSchema = z.object({
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
});

// Complete Booking Schema
export const createReservationSchema = z.object({
  spaceId: z.string().uuid(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  notes: z.string().max(500).optional(),
  type: z.enum(['individual', 'group']),
});

// Group Room Booking Schema
export const groupRoomBookingSchema = bookingStepOneSchema.extend({
  groupSize: z.number()
    .int('Group size must be a whole number')
    .min(1, 'Group size must be at least 1'),
  privacyOption: z.enum(['public', 'private']).default('public'),
});

// Create Group Reservation Schema
export const createGroupReservationSchema = createReservationSchema.extend({
  type: z.literal('group'),
  groupSize: z.number().int().min(1),
  privacyOption: z.enum(['public', 'private']),
});

// Infer TypeScript types
export type BookingStepOne = z.infer<typeof bookingStepOneSchema>;
export type BookingStepTwo = z.infer<typeof bookingStepTwoSchema>;
export type CreateReservation = z.infer<typeof createReservationSchema>;
export type GroupRoomBooking = z.infer<typeof groupRoomBookingSchema>;
export type CreateGroupReservation = z.infer<typeof createGroupReservationSchema>;
