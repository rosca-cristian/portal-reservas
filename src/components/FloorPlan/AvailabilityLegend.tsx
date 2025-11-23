/**
 * AvailabilityLegend Component - Color key for space availability
 * Story 2.2: Real-Time Availability Overlay
 */

import { AVAILABILITY_COLORS } from '@/types/availability';

export function AvailabilityLegend() {
  return (
    <div
      className="availability-legend"
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
      <h3
        className="font-extrabold mb-4 text-sm"
        style={{
          color: '#1a1a2e',
          textShadow: '1px 1px 2px rgba(255,255,255,0.8), -1px -1px 1px rgba(0,0,0,0.1)'
        }}
      >
        🎨 Availability Legend
      </h3>
      <div className="flex flex-col gap-3">
        <LegendItem
          color={AVAILABILITY_COLORS.AVAILABLE}
          label="Available"
          description="Space is free to book"
        />
        <LegendItem
          color={AVAILABILITY_COLORS.OCCUPIED}
          label="Occupied"
          description="Currently in use"
        />
        <LegendItem
          color={AVAILABILITY_COLORS.UNAVAILABLE}
          label="Unavailable"
          description="Closed or under maintenance"
        />
      </div>
    </div>
  );
}

interface LegendItemProps {
  color: string;
  label: string;
  description: string;
}

function LegendItem({ color, label, description }: LegendItemProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-5 h-5 rounded-lg flex-shrink-0"
        style={{
          backgroundColor: color,
          boxShadow: `
            4px 4px 8px rgba(0, 0, 0, 0.2),
            -2px -2px 6px rgba(255, 255, 255, 0.8),
            inset 2px 2px 4px rgba(255, 255, 255, 0.4)
          `
        }}
      />
      <div className="flex flex-col">
        <span
          className="text-sm font-bold"
          style={{ color: '#1a1a2e' }}
        >
          {label}
        </span>
        <span
          className="text-xs font-semibold"
          style={{ color: '#16213e' }}
        >
          {description}
        </span>
      </div>
    </div>
  );
}
