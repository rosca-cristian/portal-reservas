import { useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Monitor } from 'lucide-react';
import type { Space, Floor } from '@/types/space';
import type { SpaceAvailability } from '@/types/availability';
import { AVAILABILITY_COLORS } from '@/types/availability';
import { SpaceTooltip } from './SpaceTooltip';
import { ZoomControls } from './ZoomControls';

interface FloorPlanProps {
  floor: Floor;
  spaces: Space[];
  availability?: Map<string, SpaceAvailability>;
  onSpaceClick?: (space: Space) => void;
  selectedSpace?: Space | null;
}

export function FloorPlan({
  floor,
  spaces,
  availability,
  onSpaceClick,
  selectedSpace,
}: FloorPlanProps) {
  const [hoveredSpace, setHoveredSpace] = useState<Space | null>(null);
  const [hoveredAvailability, setHoveredAvailability] = useState<SpaceAvailability | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleSpaceHover = (
    space: Space,
    event: React.MouseEvent<SVGElement>
  ) => {
    setHoveredSpace(space);
    setHoveredAvailability(availability?.get(space.id) || null);
    setTooltipPosition({
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleSpaceLeave = () => {
    setHoveredSpace(null);
    setHoveredAvailability(null);
  };

  const getSpaceColor = (spaceId: string): string => {
    const spaceAvailability = availability?.get(spaceId);
    if (!spaceAvailability) {
      return AVAILABILITY_COLORS.DEFAULT;
    }

    switch (spaceAvailability.status) {
      case 'AVAILABLE':
        return AVAILABILITY_COLORS.AVAILABLE;
      case 'OCCUPIED':
        return AVAILABILITY_COLORS.OCCUPIED;
      case 'UNAVAILABLE':
        return AVAILABILITY_COLORS.UNAVAILABLE;
      default:
        return AVAILABILITY_COLORS.DEFAULT;
    }
  };

  const renderChairs = (space: Space) => {
    if (!space.coordinates?.config?.chairs || space.coordinates.config.chairs <= 0) return null

    const { width, height } = space.coordinates.boundingBox!
    const count = space.coordinates.config.chairs
    const isVertical = space.coordinates.config.chairsPosition === 'vertical'

    const chairs = []
    const chairSize = 12

    if (isVertical) {
      const sideCount = Math.ceil(count / 2)
      const spacing = height / (sideCount + 1)

      for (let i = 0; i < count; i++) {
        const isRight = i >= sideCount
        const index = isRight ? i - sideCount : i
        const cx = isRight ? width + 5 : -5 - chairSize
        const cy = (index + 1) * spacing - chairSize / 2

        chairs.push(
          <rect
            key={`chair-${i}`}
            x={cx}
            y={cy}
            width={chairSize}
            height={chairSize}
            rx={4}
            fill="#94a3b8"
          />
        )
      }
    } else {
      const sideCount = Math.ceil(count / 2)
      const spacing = width / (sideCount + 1)

      for (let i = 0; i < count; i++) {
        const isBottom = i >= sideCount
        const index = isBottom ? i - sideCount : i
        const cx = (index + 1) * spacing - chairSize / 2
        const cy = isBottom ? height + 5 : -5 - chairSize

        chairs.push(
          <rect
            key={`chair-${i}`}
            x={cx}
            y={cy}
            width={chairSize}
            height={chairSize}
            rx={4}
            fill="#94a3b8"
          />
        )
      }
    }

    return <g>{chairs}</g>
  }

  return (
    <div className="floor-plan-container relative w-full h-full glassmorphism rounded-lg overflow-hidden">
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={3}
        wheel={{ step: 0.1 }}
        pinch={{ step: 5 }}
        doubleClick={{ disabled: false }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <ZoomControls
              onZoomIn={zoomIn}
              onZoomOut={zoomOut}
              onReset={resetTransform}
            />

            <TransformComponent
              wrapperClass="w-full h-full"
              contentClass="flex items-center justify-center"
            >
              <svg
                viewBox={`0 0 ${floor.dimensions?.width || 1000} ${floor.dimensions?.height || 1000}`}
                className="floor-plan-svg max-w-full max-h-full"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background */}
                {floor.imageUrl ? (
                  <image
                    href={floor.imageUrl}
                    width={floor.dimensions?.width || 1000}
                    height={floor.dimensions?.height || 1000}
                    preserveAspectRatio="xMidYMid slice"
                  />
                ) : (
                  <>
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </>
                )}

                {/* Render spaces */}
                {spaces.map((space) => {
                  // Fallback for spaces without new coordinates structure
                  const { x, y, width, height } = space.coordinates?.boundingBox || { x: 0, y: 0, width: 60, height: 60 }

                  const isSelected = selectedSpace?.id === space.id;
                  const isHovered = hoveredSpace?.id === space.id;
                  const hasComputer = space.coordinates?.config?.hasComputer || space.equipment.includes('Computer')

                  // Determine fill color based on state
                  let fillColor = '#fff';
                  let strokeColor = '#94a3b8';

                  if (isSelected) {
                    fillColor = '#eff6ff';
                    strokeColor = '#3b82f6';
                  } else if (isHovered) {
                    fillColor = '#f8fafc';
                    strokeColor = '#64748b';
                  } else {
                    // Use availability color if not selected/hovered
                    fillColor = getSpaceColor(space.id);
                  }

                  return (
                    <g
                      key={space.id}
                      transform={`translate(${x}, ${y})`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSpaceClick?.(space);
                      }}
                      onMouseEnter={(e) => handleSpaceHover(space, e)}
                      onMouseLeave={handleSpaceLeave}
                      className="cursor-pointer transition-all duration-200"
                      style={{ opacity: isHovered ? 0.9 : 1 }}
                    >
                      {/* Selection Halo */}
                      {isSelected && (
                        <rect
                          x={-4} y={-4}
                          width={width + 8}
                          height={height + 8}
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="2"
                          rx="6"
                          strokeDasharray="4 4"
                          className="animate-pulse"
                        />
                      )}

                      {/* Main Shape */}
                      <rect
                        width={width}
                        height={height}
                        fill={fillColor}
                        stroke={strokeColor}
                        strokeWidth={isSelected ? 2 : 1.5}
                        rx="4"
                        className="transition-colors duration-200"
                        style={{ filter: 'drop-shadow(0 2px 4px rgb(0 0 0 / 0.05))' }}
                      />

                      {/* Chairs */}
                      {renderChairs(space)}

                      {/* Computer Icon */}
                      {hasComputer && (
                        <g transform={`translate(${width / 2 - 8}, ${height / 2 - 8})`}>
                          <Monitor className="w-4 h-4 text-gray-500" />
                        </g>
                      )}

                      {/* Label */}
                      {!hasComputer && (
                        <text
                          x={width / 2}
                          y={height / 2}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize="11"
                          fill={isSelected ? '#1e40af' : '#64748b'}
                          className="pointer-events-none select-none font-medium"
                        >
                          {space.name.replace('Table ', 'T').replace('Seat ', 'S')}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </TransformComponent>

            {/* Tooltip */}
            {hoveredSpace && (
              <SpaceTooltip
                space={hoveredSpace}
                availability={hoveredAvailability}
                position={tooltipPosition}
                visible={!!hoveredSpace}
              />
            )}
          </>
        )}
      </TransformWrapper>
    </div>
  );
}
