import { Users } from 'lucide-react';
import { useReservationsStore } from '../../stores/reservationsStore';

interface GroupSizeInputProps {
  minCapacity: number;
  maxCapacity: number;
}

export default function GroupSizeInput({ minCapacity, maxCapacity }: GroupSizeInputProps) {
  const { wizard, setGroupSize } = useReservationsStore();
  const groupSize = wizard.groupSize || minCapacity;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setGroupSize(value);
    }
  };

  const isValid = groupSize >= minCapacity && groupSize <= maxCapacity;
  const errorMessage = groupSize < minCapacity
    ? `This room requires at least ${minCapacity} participants`
    : groupSize > maxCapacity
    ? `This room can accommodate maximum ${maxCapacity} participants`
    : null;

  return (
    <div className="space-y-2">
      <label htmlFor="groupSize" className="block text-sm font-medium text-gray-700">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          Group Size
        </div>
      </label>

      <div className="space-y-1">
        <input
          type="number"
          id="groupSize"
          min={minCapacity}
          max={maxCapacity}
          value={groupSize}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            isValid
              ? 'border-gray-300 focus:ring-blue-500'
              : 'border-red-500 focus:ring-red-500'
          }`}
          aria-invalid={!isValid}
          aria-describedby={!isValid ? 'groupSize-error' : undefined}
        />

        <p className="text-sm text-gray-500">
          Capacity: {minCapacity}-{maxCapacity} participants
        </p>

        {!isValid && errorMessage && (
          <p id="groupSize-error" className="text-sm text-red-600" role="alert">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
}
