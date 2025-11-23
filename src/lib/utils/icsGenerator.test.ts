/**
 * ICS Generator Utility Tests
 * Story 3.3: Booking Confirmation Screen
 */

import { describe, it, expect } from 'vitest';
import { generateICS } from './icsGenerator';

describe('icsGenerator', () => {
  describe('generateICS', () => {
    it('generates valid ICS content with required fields', () => {
      const event = {
        title: 'Desk A1 Reservation',
        location: 'Desk A1',
        description: 'Space reservation',
        startTime: '2025-01-15T10:00:00.000Z',
        endTime: '2025-01-15T12:00:00.000Z',
      };

      const ics = generateICS(event);

      expect(ics).toContain('BEGIN:VCALENDAR');
      expect(ics).toContain('VERSION:2.0');
      expect(ics).toContain('PRODID:-//Sistema Reserva Espacios//ES');
      expect(ics).toContain('BEGIN:VEVENT');
      expect(ics).toContain('SUMMARY:Desk A1 Reservation');
      expect(ics).toContain('LOCATION:Desk A1');
      expect(ics).toContain('DESCRIPTION:Space reservation');
      expect(ics).toContain('DTSTART:20250115T100000Z');
      expect(ics).toContain('DTEND:20250115T120000Z');
      expect(ics).toContain('END:VEVENT');
      expect(ics).toContain('END:VCALENDAR');
    });

    it('formats dates correctly in ICS format', () => {
      const event = {
        title: 'Conference Room B',
        location: 'Conference Room B',
        description: 'Meeting',
        startTime: '2025-12-31T23:30:00.000Z',
        endTime: '2026-01-01T01:30:00.000Z',
      };

      const ics = generateICS(event);

      expect(ics).toContain('DTSTART:20251231T233000Z');
      expect(ics).toContain('DTEND:20260101T013000Z');
    });

    it('includes description field', () => {
      const event = {
        title: 'Meeting Room 1',
        location: 'Meeting Room 1',
        description: 'Reservation ID: ABC-DEF-123',
        startTime: '2025-01-15T10:00:00.000Z',
        endTime: '2025-01-15T12:00:00.000Z',
      };

      const ics = generateICS(event);

      expect(ics).toContain('DESCRIPTION:Reservation ID: ABC-DEF-123');
    });

    it('includes STATUS field', () => {
      const event = {
        title: 'Desk C3',
        location: 'Desk C3',
        description: 'Booking',
        startTime: '2025-01-15T10:00:00.000Z',
        endTime: '2025-01-15T12:00:00.000Z',
      };

      const ics = generateICS(event);

      expect(ics).toContain('STATUS:CONFIRMED');
    });

    it('includes DTSTAMP with current timestamp', () => {
      const event = {
        title: 'Room A',
        location: 'Room A',
        description: 'Booking',
        startTime: '2025-01-15T10:00:00.000Z',
        endTime: '2025-01-15T12:00:00.000Z',
      };

      const ics = generateICS(event);

      expect(ics).toMatch(/DTSTAMP:\d{8}T\d{6}Z/);
    });

    it('handles special characters in fields', () => {
      const event = {
        title: 'Meeting Room #1 (2nd Floor)',
        location: 'Building A',
        description: 'Important meeting!',
        startTime: '2025-01-15T10:00:00.000Z',
        endTime: '2025-01-15T12:00:00.000Z',
      };

      const ics = generateICS(event);

      expect(ics).toContain('SUMMARY:Meeting Room #1 (2nd Floor)');
    });

    it('includes UID field', () => {
      const event = {
        title: 'Test Event',
        location: 'Test Location',
        description: 'Test',
        startTime: '2025-01-15T10:00:00.000Z',
        endTime: '2025-01-15T12:00:00.000Z',
      };

      const ics = generateICS(event);

      expect(ics).toMatch(/UID:\d+@sistema-reserva-espacios\.com/);
    });

    it('includes METHOD and CALSCALE fields', () => {
      const event = {
        title: 'Test',
        location: 'Test',
        description: 'Test',
        startTime: '2025-01-15T10:00:00.000Z',
        endTime: '2025-01-15T12:00:00.000Z',
      };

      const ics = generateICS(event);

      expect(ics).toContain('METHOD:PUBLISH');
      expect(ics).toContain('CALSCALE:GREGORIAN');
    });
  });
});
