import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useAvailability } from '@hooks/useAvailability';

interface TimeSlotSelectorProps {
  spaceId: string;
  date: Date;
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
}

// Generate time slots from 7 AM to 10 PM (1-hour increments)
const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  for (let hour = 7; hour <= 21; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
  }
  return slots;
};

export default function TimeSlotSelector({
  spaceId,
  date,
  selectedTime,
  onTimeSelect,
}: TimeSlotSelectorProps) {
  const { availability, loading } = useAvailability(date);
  const timeSlots = generateTimeSlots();

  const isSlotOccupied = (time: string): boolean => {
    const spaceAvail = availability.get(spaceId);
    if (!spaceAvail) return false;
    return spaceAvail.status === 'OCCUPIED';
  };

  if (loading) {
    return <div className="text-center py-4 text-gray-600">Loading availability...</div>;
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
      {timeSlots.map((time) => {
        const occupied = isSlotOccupied(time);
        const selected = time === selectedTime;

        return (
          <button
            key={time}
            onClick={() => !occupied && onTimeSelect(time)}
            disabled={occupied}
            className={`p-3 rounded-lg border-2 text-center transition-colors ${
              selected
                ? 'border-blue-600 bg-blue-600 text-white'
                : occupied
                ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            <div className="font-semibold">{time}</div>
            {occupied && <div className="text-xs mt-1">Occupied</div>}
          </button>
        );
      })}
    </div>
  );
}
