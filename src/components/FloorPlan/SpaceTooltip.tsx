/**
 * SpaceTooltip Component - Displays space information and availability on hover
 * Story 2.1: Interactive SVG Floor Plan Component
 * Story 2.2: Real-Time Availability Overlay
 */

import type { Space } from '@/types/space';
import type { SpaceAvailability } from '@/types/availability';
import { AVAILABILITY_BADGE_CLASSES } from '@/types/availability';

interface SpaceTooltipProps {
  space: Space | null;
  availability?: SpaceAvailability | null;
  position: { x: number; y: number };
  visible: boolean;
}

export function SpaceTooltip({ space, availability, position, visible }: SpaceTooltipProps) {
  if (!space || !visible) return null;

  // Adjust position to prevent tooltip from going off-screen
  const tooltipStyle = {
    left: `${position.x + 10}px`,
    top: `${position.y + 10}px`,
  };

  return (
    <div
      className="space-tooltip fixed z-50 pointer-events-none"
      style={tooltipStyle}
    >
      <div className="glassmorphism px-4 py-3 rounded-lg shadow-lg border border-white/20 backdrop-blur-md bg-white/80 min-w-[200px]">
        <h4 className="font-semibold text-gray-900 mb-1">{space.name}</h4>
        <p className="text-sm text-gray-600">{space.type}</p>

        {/* Availability Status */}
        {availability && (
          <div className="mt-2">
            <AvailabilityBadge availability={availability} />
          </div>
        )}

        <div className="mt-2 text-sm">
          <p className="text-gray-700">
            <span className="font-medium">Capacity:</span> {space.capacity}{' '}
            people
          </p>
          {availability?.availableSeats !== undefined && (
            <p className="text-gray-700">
              <span className="font-medium">Available Seats:</span> {availability.availableSeats}/{availability.totalSeats}
            </p>
          )}
          {space.equipment && space.equipment.length > 0 && (
            <p className="text-gray-700">
              <span className="font-medium">Equipment:</span>{' '}
              {space.equipment.slice(0, 3).join(', ')}
              {space.equipment.length > 3 && '...'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function AvailabilityBadge({ availability }: { availability: SpaceAvailability }) {
  const badgeClass = AVAILABILITY_BADGE_CLASSES[availability.status];

  const formatNextAvailable = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className={`px-3 py-1.5 rounded-md border ${badgeClass}`}>
      {availability.status === 'AVAILABLE' && (
        <div className="text-sm">
          <span className="font-medium block">Available Now</span>
          {availability.availableSeats !== undefined && (
            <span className="text-xs">{availability.availableSeats} seats left</span>
          )}
        </div>
      )}
      {availability.status === 'OCCUPIED' && (
        <div className="text-sm">
          <span className="font-medium block">Occupied</span>
          {availability.nextAvailable && (
            <span className="text-xs">
              Next Available: {formatNextAvailable(availability.nextAvailable)}
            </span>
          )}
        </div>
      )}
      {availability.status === 'UNAVAILABLE' && (
        <div className="text-sm">
          <span className="font-medium block">Unavailable</span>
          {availability.reason && (
            <span className="text-xs">{availability.reason}</span>
          )}
        </div>
      )}
    </div>
  );
}
