/**
 * AvailabilityBadge Component - Reusable availability status badge
 * Story 2.3: Space Card Component and Grid View
 */

import type { AvailabilityStatus } from '@/types/availability';
import { AVAILABILITY_BADGE_CLASSES } from '@/types/availability';

interface AvailabilityBadgeProps {
  status: AvailabilityStatus;
  nextAvailable?: string;
  reason?: string;
  compact?: boolean;
}

export function AvailabilityBadge({
  status,
  nextAvailable,
  reason,
  compact = false,
}: AvailabilityBadgeProps) {
  const badgeClass = AVAILABILITY_BADGE_CLASSES[status];

  if (compact) {
    return (
      <div className={`px-2 py-1 rounded-full border text-xs font-medium ${badgeClass}`}>
        {status === 'AVAILABLE' && 'Available'}
        {status === 'OCCUPIED' && 'Occupied'}
        {status === 'UNAVAILABLE' && 'Unavailable'}
      </div>
    );
  }

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
      {status === 'AVAILABLE' && (
        <span className="text-sm font-medium">Available Now</span>
      )}
      {status === 'OCCUPIED' && (
        <div className="text-sm">
          <span className="font-medium block">Occupied</span>
          {nextAvailable && (
            <span className="text-xs">
              Next Available: {formatNextAvailable(nextAvailable)}
            </span>
          )}
        </div>
      )}
      {status === 'UNAVAILABLE' && (
        <div className="text-sm">
          <span className="font-medium block">Unavailable</span>
          {reason && <span className="text-xs">{reason}</span>}
        </div>
      )}
    </div>
  );
}
