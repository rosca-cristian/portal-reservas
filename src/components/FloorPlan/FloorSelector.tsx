/**
 * FloorSelector Component - Dropdown to select different floors
 * Story 2.1: Interactive SVG Floor Plan Component
 */

import type { Floor } from '@/types/space';

// Simple select component with claymorphism styling
const Select = ({ value, onValueChange, children }: any) => (
  <select
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    className="clay-select w-full"
    style={{
      fontSize: '0.95rem'
    }}
  >
    {children}
  </select>
);
const SelectTrigger = ({ children }: any) => <>{children}</>;
const SelectValue = ({ placeholder: _placeholder }: any) => null;
const SelectContent = ({ children }: any) => <>{children}</>;
const SelectItem = ({ value, children }: any) => <option value={value}>{children}</option>;

interface FloorSelectorProps {
  floors: Floor[];
  selectedFloorId: string;
  onFloorChange: (floorId: string) => void;
}

export function FloorSelector({
  floors,
  selectedFloorId,
  onFloorChange,
}: FloorSelectorProps) {
  return (
    <div
      className="floor-selector"
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
      <label
        className="block text-sm font-bold mb-3"
        style={{ color: '#16213e' }}
      >
        🏢 Select Floor
      </label>
      <Select value={selectedFloorId} onValueChange={onFloorChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select floor" />
        </SelectTrigger>
        <SelectContent>
          {floors.map((floor) => (
            <SelectItem key={floor.id} value={floor.id}>
              {floor.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
