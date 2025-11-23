import { parseISO } from 'date-fns';

interface TimeSlot {
  startTime: string;
  endTime: string;
}

/**
 * Check if two time slots overlap
 */
export function hasTimeOverlap(slot1: TimeSlot, slot2: TimeSlot): boolean {
  const start1 = parseISO(slot1.startTime);
  const end1 = parseISO(slot1.endTime);
  const start2 = parseISO(slot2.startTime);
  const end2 = parseISO(slot2.endTime);

  // Check for any overlap: start1 < end2 && end1 > start2
  return start1 < end2 && end1 > start2;
}

/**
 * Check if two time slots have exact time match
 */
export function hasExactTimeMatch(slot1: TimeSlot, slot2: TimeSlot): boolean {
  return slot1.startTime === slot2.startTime && slot1.endTime === slot2.endTime;
}

/**
 * Find conflicting reservations for a given time slot
 */
export function findConflicts<T extends TimeSlot>(
  proposedSlot: TimeSlot,
  existingReservations: T[]
): T[] {
  return existingReservations.filter((reservation) =>
    hasTimeOverlap(proposedSlot, reservation)
  );
}

/**
 * Check if user has a reservation conflict
 */
export function checkUserReservationConflict(
  userReservations: TimeSlot[],
  newReservation: TimeSlot
): { hasConflict: boolean; conflictingReservation?: TimeSlot } {
  const conflicts = findConflicts(newReservation, userReservations);

  if (conflicts.length > 0) {
    return {
      hasConflict: true,
      conflictingReservation: conflicts[0],
    };
  }

  return { hasConflict: false };
}
