/**
 * WeekViewCalendar Component - Shows 7-day availability calendar for a space
 * Story 2.6: Space Details Modal
 */

import { useState, useEffect } from 'react';
import type { AvailabilityStatus } from '@/types/availability';
import type { ApiResponse } from '@/types/api';
import { apiClient } from '@/lib/api/client';

interface TimeSlot {
  time: string;
  status: AvailabilityStatus;
}

interface DayAvailability {
  date: Date;
  slots: TimeSlot[];
}

interface WeekViewCalendarProps {
  spaceId: string;
  onTimeSlotClick?: (date: Date, time: string) => void;
  selectedDate?: Date | null;
  selectedTime?: string | null;
}

const TIME_SLOTS = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
];

export function WeekViewCalendar({
  spaceId,
  onTimeSlotClick,
  selectedDate,
  selectedTime,
}: WeekViewCalendarProps) {
  const [availability, setAvailability] = useState<DayAvailability[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeekAvailability();
  }, [spaceId]);

  const loadWeekAvailability = async () => {
    try {
      setLoading(true);
      const days = getNext7Days();
      const availabilityData: DayAvailability[] = [];

      for (const date of days) {
        const dateString = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
        const response = await apiClient.get(`/api/spaces/${spaceId}/availability?date=${dateString}`);
        const data: ApiResponse<{ slots: { time: string; status: AvailabilityStatus }[] }> = response.data;

        // Map backend slots to frontend format, marking past slots as unavailable
        const slots = (data.data?.slots || []).map((slot) => ({
          time: slot.time,
          status: isPastTimeSlot(date, slot.time) ? ('UNAVAILABLE' as const) : slot.status,
        }));

        availabilityData.push({ date, slots });
      }

      setAvailability(availabilityData);
    } catch (error) {
      console.error('Error loading week availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNext7Days = (): Date[] => {
    const days: Date[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }

    return days;
  };

  const isPastTimeSlot = (date: Date, time: string): boolean => {
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const slotDate = new Date(date);
    slotDate.setHours(hours, minutes, 0, 0);
    return slotDate < now;
  };

  const formatDate = (date: Date): string => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getDay()]} ${months[date.getMonth()]} ${date.getDate()}`;
  };

  const getSlotClassName = (status: AvailabilityStatus, isPast: boolean): string => {
    if (isPast) {
      return 'bg-gray-100 cursor-not-allowed text-gray-400';
    }

    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 hover:bg-green-200 text-green-700 cursor-pointer';
      case 'OCCUPIED':
        return 'bg-red-100 text-red-700 cursor-not-allowed';
      case 'UNAVAILABLE':
        return 'bg-gray-100 text-gray-500 cursor-not-allowed';
      default:
        return 'bg-gray-50';
    }
  };

  const handleSlotClick = (date: Date, time: string, status: AvailabilityStatus) => {
    if (status === 'AVAILABLE' && !isPastTimeSlot(date, time)) {
      onTimeSlotClick?.(date, time);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-64 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse min-w-[600px]">
        <thead>
          <tr>
            <th className="p-2 text-left text-sm font-medium text-gray-600 border-b border-gray-200">
              Time
            </th>
            {availability.map(({ date }) => (
              <th
                key={date.toISOString()}
                className="p-2 text-center text-sm font-medium text-gray-600 border-b border-gray-200"
              >
                {formatDate(date)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TIME_SLOTS.map((time) => (
            <tr key={time}>
              <td className="p-2 text-sm font-medium text-gray-700">{time}</td>
              {availability.map(({ date, slots }) => {
                const slot = slots.find((s) => s.time === time);
                if (!slot) return <td key={date.toISOString()}></td>;

                const isPast = isPastTimeSlot(date, time);
                const isSelected =
                  selectedDate &&
                  selectedTime &&
                  date.toDateString() === selectedDate.toDateString() &&
                  time === selectedTime;
                const slotClassName = getSlotClassName(slot.status, isPast);

                return (
                  <td key={date.toISOString()} className="p-1">
                    <button
                      className={`w-full h-12 rounded text-sm font-medium transition-colors ${slotClassName} ${
                        isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                      }`}
                      onClick={() => handleSlotClick(date, time, slot.status)}
                      disabled={isPast || slot.status !== 'AVAILABLE'}
                      title={`${time} - ${slot.status}`}
                    >
                      {slot.status === 'AVAILABLE' ? '✓' : '✗'}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Legend */}
      <div className="mt-4 flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-100"></div>
          <span className="text-gray-600">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-100"></div>
          <span className="text-gray-600">Occupied</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-100"></div>
          <span className="text-gray-600">Past/Unavailable</span>
        </div>
      </div>
    </div>
  );
}
