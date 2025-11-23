/**
 * QuickFilters Component - Quick filter chips for types and equipment
 * Story 2.4: Search Bar with Quick Filters
 */

interface QuickFiltersProps {
  selectedTypes: string[];
  selectedEquipment: string[];
  onTypeToggle: (type: string) => void;
  onEquipmentToggle: (equipment: string) => void;
}

const SPACE_TYPES = ['Individual Desk', 'Group Room', 'Meeting Room', 'Study Room'];
const EQUIPMENT_OPTIONS = ['Computer', 'Whiteboard', 'Projector', 'Monitor'];

export function QuickFilters({
  selectedTypes,
  selectedEquipment,
  onTypeToggle,
  onEquipmentToggle,
}: QuickFiltersProps) {
  return (
    <div className="quick-filters space-y-4">
      {/* Type Filters */}
      <div>
        <h3
          className="text-sm font-bold mb-3"
          style={{
            color: '#16213e',
            textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
          }}
        >
          📂 Space Type
        </h3>
        <div className="flex flex-wrap gap-3">
          {SPACE_TYPES.map((type) => {
            const isSelected = selectedTypes.includes(type);
            return (
              <button
                key={type}
                onClick={() => onTypeToggle(type)}
                className="px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300"
                style={
                  isSelected
                    ? {
                      background: 'linear-gradient(145deg, #C4B5FD, #A594D6)',
                      color: 'white',
                      boxShadow: `
                          inset 3px 3px 6px rgba(0,0,0,0.15),
                          inset -3px -3px 6px rgba(196,181,253,0.3),
                          6px 6px 12px rgba(165, 148, 214, 0.5)
                        `,
                    }
                    : {
                      background: 'linear-gradient(145deg, #F0F9FF, #D4E6FF)',
                      color: '#1a1a2e',
                      boxShadow: `
                          6px 6px 12px rgba(133, 196, 219, 0.3),
                          -6px -6px 12px rgba(255, 255, 255, 0.9)
                        `,
                    }
                }
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `
                      8px 8px 16px rgba(133, 196, 219, 0.4),
                      -8px -8px 16px rgba(255, 255, 255, 0.95)
                    `;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = `
                      6px 6px 12px rgba(133, 196, 219, 0.3),
                      -6px -6px 12px rgba(255, 255, 255, 0.9)
                    `;
                  }
                }}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Equipment Filters */}
      <div>
        <h3
          className="text-sm font-bold mb-3"
          style={{
            color: '#16213e',
            textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
          }}
        >
          🛠️ Equipment
        </h3>
        <div className="flex flex-wrap gap-3">
          {EQUIPMENT_OPTIONS.map((equipment) => {
            const isSelected = selectedEquipment.includes(equipment);
            return (
              <button
                key={equipment}
                onClick={() => onEquipmentToggle(equipment)}
                className="px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300"
                style={
                  isSelected
                    ? {
                      background: 'linear-gradient(145deg, #A8E6D4, #6FB8B8)',
                      color: '#0d4d3d',
                      boxShadow: `
                          inset 3px 3px 6px rgba(0,0,0,0.15),
                          inset -3px -3px 6px rgba(168,230,212,0.3),
                          6px 6px 12px rgba(111, 184, 184, 0.5)
                        `,
                    }
                    : {
                      background: 'linear-gradient(145deg, #F0FFF9, #A8E6D4)',
                      color: '#1a1a2e',
                      boxShadow: `
                          6px 6px 12px rgba(111, 184, 184, 0.3),
                          -6px -6px 12px rgba(255, 255, 255, 0.9)
                        `,
                    }
                }
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `
                      8px 8px 16px rgba(111, 184, 184, 0.4),
                      -8px -8px 16px rgba(255, 255, 255, 0.95)
                    `;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = `
                      6px 6px 12px rgba(111, 184, 184, 0.3),
                      -6px -6px 12px rgba(255, 255, 255, 0.9)
                    `;
                  }
                }}
              >
                {equipment}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
