/**
 * DateTimePicker Component - Select date and time for availability
 * Story 2.2: Real-Time Availability Overlay
 */

import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

interface DateTimePickerProps {
  value: Date;
  onChange: (datetime: Date) => void;
  maxDaysAhead?: number;
}

export function DateTimePicker({
  value,
  onChange,
  maxDaysAhead = 7,
}: DateTimePickerProps) {
  const [date, setDate] = useState(formatDate(value));
  const [time, setTime] = useState(formatTime(value));

  useEffect(() => {
    setDate(formatDate(value));
    setTime(formatTime(value));
  }, [value]);

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    updateDateTime(newDate, time);
  };

  const handleTimeChange = (newTime: string) => {
    setTime(newTime);
    updateDateTime(date, newTime);
  };

  const updateDateTime = (dateStr: string, timeStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hours, minutes] = timeStr.split(':').map(Number);

    const newDateTime = new Date(year, month - 1, day, hours, minutes);
    onChange(newDateTime);
  };

  // Calculate min and max dates
  const today = new Date();
  const minDate = formatDate(today);

  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + maxDaysAhead);
  const maxDateStr = formatDate(maxDate);

  return (
    <div
      className="datetime-picker"
      style={{
        background: 'linear-gradient(145deg, #F0F9FF, #F0FFF9)',
        borderRadius: '28px',
        padding: '1.5rem',
        boxShadow: `
          12px 12px 24px rgba(133, 196, 219, 0.3),
          -12px -12px 24px rgba(255, 255, 255, 0.9)
        `
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Calendar
          className="h-5 w-5"
          style={{ color: '#0d3d56' }}
        />
        <h3
          className="font-extrabold"
          style={{
            color: '#1a1a2e',
            fontSize: '1.1rem',
            textShadow: '1px 1px 2px rgba(255,255,255,0.8), -1px -1px 1px rgba(0,0,0,0.1)'
          }}
        >
          Select Date & Time
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col">
          <label
            htmlFor="date-input"
            className="text-sm font-bold mb-2"
            style={{ color: '#16213e' }}
          >
            📅 Date
          </label>
          <input
            id="date-input"
            type="date"
            value={date}
            min={minDate}
            max={maxDateStr}
            onChange={(e) => handleDateChange(e.target.value)}
            className="clay-input"
            style={{
              padding: '12px 16px',
              fontSize: '0.95rem'
            }}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="time-input"
            className="text-sm font-bold mb-2"
            style={{ color: '#16213e' }}
          >
            ⏰ Time
          </label>
          <select
            id="time-input"
            value={time}
            onChange={(e) => handleTimeChange(e.target.value)}
            className="clay-select"
            style={{
              padding: '12px 16px',
              fontSize: '0.95rem'
            }}
          >
            {generateTimeOptions().map((timeOption) => (
              <option key={timeOption} value={timeOption}>
                {timeOption}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div
        className="mt-3 text-xs font-semibold"
        style={{ color: '#16213e' }}
      >
        📍 Showing availability for {formatDisplayDateTime(value)}
      </div>
    </div>
  );
}

// Helper functions
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function formatDisplayDateTime(date: Date): string {
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function generateTimeOptions(): string[] {
  const options: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute of [0, 30]) {
      const hourStr = String(hour).padStart(2, '0');
      const minuteStr = String(minute).padStart(2, '0');
      options.push(`${hourStr}:${minuteStr}`);
    }
  }
  return options;
}
