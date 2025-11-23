/**
 * Generate ICS (iCalendar) file content for calendar applications
 */

interface ICSEvent {
  title: string;
  location: string;
  description: string;
  startTime: string; // ISO 8601 format
  endTime: string; // ISO 8601 format
}

function formatDateForICS(isoString: string): string {
  const date = new Date(isoString);

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

export function generateICS(event: ICSEvent): string {
  const now = new Date();
  const dtstamp = formatDateForICS(now.toISOString());
  const dtstart = formatDateForICS(event.startTime);
  const dtend = formatDateForICS(event.endTime);

  // Generate a unique UID
  const uid = `${Date.now()}@sistema-reserva-espacios.com`;

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Sistema Reserva Espacios//ES
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${dtstamp}
DTSTART:${dtstart}
DTEND:${dtend}
SUMMARY:${event.title}
LOCATION:${event.location}
DESCRIPTION:${event.description}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;

  return icsContent;
}
