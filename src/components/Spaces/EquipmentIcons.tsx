/**
 * EquipmentIcons Component - Display equipment with icons
 * Story 2.3: Space Card Component and Grid View
 */

import {
  Monitor,
  Projector,
  Tv,
  Wifi,
  Zap,
  Cable,
  Users,
  BookOpen,
  Lightbulb,
  type LucideIcon,
} from 'lucide-react';

interface EquipmentIconsProps {
  equipment: string[];
  maxDisplay?: number;
  showLabels?: boolean;
}

// Map equipment names to icons
const EQUIPMENT_ICON_MAP: Record<string, LucideIcon> = {
  Computer: Monitor,
  Monitor: Monitor,
  Projector: Projector,
  TV: Tv,
  'HDMI Cable': Cable,
  Whiteboard: BookOpen,
  'Power Outlet': Zap,
  'USB Hub': Cable,
  'Desk Lamp': Lightbulb,
  WiFi: Wifi,
  Chairs: Users,
  Table: Users,
};

export function EquipmentIcons({ equipment, maxDisplay = 5, showLabels = false }: EquipmentIconsProps) {
  if (!equipment || equipment.length === 0) {
    return null;
  }

  const displayEquipment = showLabels ? equipment : equipment.slice(0, maxDisplay);
  const hasMore = !showLabels && equipment.length > maxDisplay;

  // With labels - grid layout with labels below icons
  if (showLabels) {
    return (
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
        {displayEquipment.map((item) => {
          const Icon = EQUIPMENT_ICON_MAP[item] || Monitor;
          return (
            <div key={item} className="flex flex-col items-center gap-2">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg glassmorphism">
                <Icon className="h-6 w-6 text-gray-700" />
              </div>
              <span className="text-xs text-center text-gray-700">{item}</span>
            </div>
          );
        })}
      </div>
    );
  }

  // Without labels - compact horizontal layout with tooltips
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {displayEquipment.map((item) => {
        const Icon = EQUIPMENT_ICON_MAP[item] || Monitor;
        return (
          <div
            key={item}
            className="group relative inline-flex items-center justify-center w-8 h-8 rounded-md glassmorphism hover:bg-white/40 transition-all"
            title={item}
          >
            <Icon className="h-4 w-4 text-gray-700" />
            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
              <div className="glassmorphism px-2 py-1 rounded text-xs whitespace-nowrap text-gray-900 shadow-lg">
                {item}
              </div>
            </div>
          </div>
        );
      })}
      {hasMore && (
        <span className="text-xs text-gray-600 ml-1">
          +{equipment.length - maxDisplay} more
        </span>
      )}
    </div>
  );
}
