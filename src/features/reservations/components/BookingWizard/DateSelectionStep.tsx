import { useState } from 'react';
import { addDays, format } from 'date-fns';
import { useReservationsStore } from '../../stores/reservationsStore';
import TimeSlotSelector from './TimeSlotSelector';
import GroupSizeInput from './GroupSizeInput';
import PrivacySelector from './PrivacySelector';

interface DateSelectionStepProps {
  spaceId: string;
  minCapacity?: number;
  maxCapacity?: number;
}

export default function DateSelectionStep({
  spaceId,
  minCapacity = 2,
  maxCapacity = 10
}: DateSelectionStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const { wizard, setStepOneData, setWizardStep } = useReservationsStore();
  const isGroupRoom = wizard.isGroupRoom;

  const today = new Date();
  const maxDate = addDays(today, 7);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset time when date changes
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleNext = () => {
    if (selectedDate && selectedTime) {
      // Validate group size for group rooms
      if (isGroupRoom) {
        const groupSize = wizard.groupSize || minCapacity;
        if (groupSize < minCapacity || groupSize > maxCapacity) {
          return; // Validation will show error message
        }
      }

      setStepOneData({
        spaceId,
        date: selectedDate,
        startTime: selectedTime,
        duration: 1,
      });
      setWizardStep(2);
    }
  };

  const canProceed = () => {
    if (!selectedDate || !selectedTime) return false;

    if (isGroupRoom) {
      const groupSize = wizard.groupSize || minCapacity;
      return groupSize >= minCapacity && groupSize <= maxCapacity;
    }

    return true;
  };

  // Generate date buttons for next 7 days
  const dateButtons = Array.from({ length: 7 }, (_, i) => addDays(today, i));

  return (
    <div className="space-y-6">
      {/* Date Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Select Date</h3>
        <div className="grid grid-cols-7 gap-2">
          {dateButtons.map((date) => (
            <button
              key={date.toISOString()}
              onClick={() => handleDateSelect(date)}
              className={`p-3 rounded-lg border-2 text-center transition-colors ${
                selectedDate?.toDateString() === date.toDateString()
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-xs text-gray-600">{format(date, 'EEE')}</div>
              <div className="text-lg font-bold">{format(date, 'd')}</div>
              <div className="text-xs text-gray-600">{format(date, 'MMM')}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Select Time Slot</h3>
          <TimeSlotSelector
            spaceId={spaceId}
            date={selectedDate}
            selectedTime={selectedTime}
            onTimeSelect={handleTimeSelect}
          />
        </div>
      )}

      {/* Group Room Fields */}
      {isGroupRoom && selectedDate && selectedTime && (
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-semibold mb-3">Group Room Settings</h3>

          <GroupSizeInput
            minCapacity={minCapacity}
            maxCapacity={maxCapacity}
          />

          <PrivacySelector />
        </div>
      )}

      {/* Next Button */}
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className={`px-6 py-2 rounded-lg font-semibold ${
            canProceed()
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
