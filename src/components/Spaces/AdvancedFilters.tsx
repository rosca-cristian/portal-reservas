/**
 * AdvancedFilters Component - Collapsible advanced filtering panel
 * Story 2.5: Advanced Filter Panel
 */

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AdvancedFiltersProps {
  availableNow: boolean;
  minCapacity: number;
  maxCapacity: number | null;
  requiredEquipment: string[];
  onAvailableNowChange: (value: boolean) => void;
  onMinCapacityChange: (value: number) => void;
  onMaxCapacityChange: (value: number | null) => void;
  onRequiredEquipmentToggle: (equipment: string) => void;
}

// Note: maxCapacity and onMaxCapacityChange are defined for future use but not currently implemented in the UI

const EQUIPMENT_OPTIONS = [
  'Computer',
  'Whiteboard',
  'Projector',
  'Monitor',
  'TV',
  'HDMI Cable',
  'Desk Lamp',
  'USB Hub',
];

export function AdvancedFilters({
  availableNow,
  minCapacity,
  maxCapacity: _maxCapacity,
  requiredEquipment,
  onAvailableNowChange,
  onMinCapacityChange,
  onMaxCapacityChange: _onMaxCapacityChange,
  onRequiredEquipmentToggle,
}: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="advanced-filters overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, #F0F9FF, #F0FFF9)',
        borderRadius: '28px',
        boxShadow: `
          12px 12px 24px rgba(133, 196, 219, 0.3),
          -12px -12px 24px rgba(255, 255, 255, 0.9)
        `
      }}
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between transition-all duration-300"
        style={{
          background: isExpanded
            ? 'linear-gradient(145deg, #8BDBDB, #6FB8B8)'
            : 'transparent',
          color: isExpanded ? 'white' : '#1a1a2e'
        }}
        onMouseEnter={(e) => {
          if (!isExpanded) {
            e.currentTarget.style.background = 'linear-gradient(145deg, rgba(139, 219, 219, 0.2), rgba(111, 184, 184, 0.2))';
          }
        }}
        onMouseLeave={(e) => {
          if (!isExpanded) {
            e.currentTarget.style.background = 'transparent';
          }
        }}
      >
        <span
          className="font-extrabold text-base"
          style={{
            textShadow: isExpanded
              ? '1px 1px 2px rgba(0,0,0,0.2)'
              : '1px 1px 2px rgba(255,255,255,0.8)'
          }}
        >
          ⚙️ Advanced Filters
        </span>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5" />
        ) : (
          <ChevronDown className="h-5 w-5" />
        )}
      </button>

      {/* Collapsible Content */}
      {isExpanded && (
        <div
          className="px-6 pb-6 space-y-5"
          style={{
            borderTop: '2px solid rgba(139, 219, 219, 0.3)'
          }}
        >
          {/* Available Now Toggle */}
          <div className="pt-5">
            <label
              className="flex items-center gap-3 cursor-pointer"
              style={{
                background: 'linear-gradient(145deg, #ffffff, #ececec)',
                borderRadius: '20px',
                padding: '14px 20px',
                boxShadow: `
                  6px 6px 12px rgba(133, 196, 219, 0.3),
                  -6px -6px 12px rgba(255, 255, 255, 0.9)
                `
              }}
            >
              <input
                type="checkbox"
                checked={availableNow}
                onChange={(e) => onAvailableNowChange(e.target.checked)}
                className="w-5 h-5 rounded accent-teal-500"
                style={{
                  cursor: 'pointer'
                }}
              />
              <span
                className="text-sm font-bold"
                style={{ color: '#1a1a2e' }}
              >
                ✅ Show only available now
              </span>
            </label>
          </div>

          {/* Capacity Range */}
          <div
            style={{
              background: 'linear-gradient(145deg, #ffffff, #ececec)',
              borderRadius: '20px',
              padding: '20px',
              boxShadow: `
                6px 6px 12px rgba(133, 196, 219, 0.3),
                -6px -6px 12px rgba(255, 255, 255, 0.9)
              `
            }}
          >
            <label
              className="block text-sm font-bold mb-3"
              style={{ color: '#16213e' }}
            >
              👥 Minimum Capacity
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="20"
                value={minCapacity}
                onChange={(e) => onMinCapacityChange(parseInt(e.target.value))}
                className="flex-1"
                aria-label="Minimum capacity"
                style={{
                  accentColor: '#8BDBDB'
                }}
              />
              <span
                className="text-sm font-extrabold min-w-[4rem] text-center"
                style={{
                  color: '#0d3d56',
                  background: 'linear-gradient(145deg, #A8E6FF, #85C4DB)',
                  padding: '8px 16px',
                  borderRadius: '16px',
                  boxShadow: `
                    4px 4px 8px rgba(133, 196, 219, 0.4),
                    -4px -4px 8px rgba(255, 255, 255, 0.9)
                  `
                }}
              >
                {minCapacity} {minCapacity === 1 ? 'person' : 'people'}
              </span>
            </div>
          </div>

          {/* Required Equipment */}
          <div
            style={{
              background: 'linear-gradient(145deg, #ffffff, #ececec)',
              borderRadius: '20px',
              padding: '20px',
              boxShadow: `
                6px 6px 12px rgba(133, 196, 219, 0.3),
                -6px -6px 12px rgba(255, 255, 255, 0.9)
              `
            }}
          >
            <label
              className="block text-sm font-bold mb-3"
              style={{ color: '#16213e' }}
            >
              🔧 Required Equipment
            </label>
            <div className="grid grid-cols-2 gap-3">
              {EQUIPMENT_OPTIONS.map((equipment) => {
                const isSelected = requiredEquipment.includes(equipment);
                return (
                  <label
                    key={equipment}
                    className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-xl transition-all duration-200"
                    style={
                      isSelected
                        ? {
                          background: 'linear-gradient(145deg, #A8E6D4, #6FB8B8)',
                          boxShadow: `
                              inset 2px 2px 4px rgba(0,0,0,0.15),
                              inset -2px -2px 4px rgba(168,230,212,0.3)
                            `
                        }
                        : {
                          background: 'transparent'
                        }
                    }
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onRequiredEquipmentToggle(equipment)}
                      className="w-4 h-4 rounded accent-teal-500"
                    />
                    <span
                      className="text-sm font-semibold"
                      style={{
                        color: isSelected ? '#0d4d3d' : '#1a1a2e'
                      }}
                    >
                      {equipment}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
