/**
 * SpaceCard Component - Card display for individual spaces
 * Story 2.3: Space Card Component and Grid View
 */

import { useState, memo, useRef } from 'react';
import { Users, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Space } from '@/types/space';
import type { SpaceAvailability } from '@/types/availability';
import { EquipmentIcons } from './EquipmentIcons';
import { AvailabilityBadge } from './AvailabilityBadge';
import ComputerBadge from './ComputerBadge';

interface SpaceCardProps {
  space: Space;
  availability?: SpaceAvailability;
  onClick?: (space: Space) => void;
}

export const SpaceCard = memo(function SpaceCard({ space, availability, onClick }: SpaceCardProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const imageErrorRef = useRef(false);

  const photos = space.photos && space.photos.length > 0
    ? space.photos
    : ['/placeholder-space.jpg']; // Fallback placeholder

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const handleCardClick = () => {
    onClick?.(space);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Prevent infinite loop by only setting placeholder once
    if (!imageErrorRef.current) {
      imageErrorRef.current = true;
      const target = e.target as HTMLImageElement;
      if (target.src !== '/placeholder-space.jpg') {
        target.src = '/placeholder-space.jpg';
      }
    }
  };

  return (
    <div
      className="space-card rounded-3xl overflow-hidden cursor-pointer transition-all duration-300"
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
        boxShadow: isHovered
          ? `
            20px 20px 40px rgba(133, 196, 219, 0.4),
            -20px -20px 40px rgba(255, 255, 255, 1),
            inset 0 0 0 1px rgba(255, 255, 255, 0.8)
          `
          : `
            12px 12px 24px rgba(133, 196, 219, 0.35),
            -12px -12px 24px rgba(255, 255, 255, 0.95)
          `,
        transform: isHovered ? 'translateY(-8px) scale(1.03)' : 'translateY(0) scale(1)'
      }}
    >
      {/* Photo Carousel */}
      <div
        className="relative h-48 overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #A8E6FF, #8BDBDB)',
        }}
      >
        <img
          src={photos[currentPhotoIndex]}
          alt={`${space.name} - Photo ${currentPhotoIndex + 1}`}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={handleImageError}
          style={{
            mixBlendMode: 'normal'
          }}
        />

        {/* Navigation arrows (show on hover if multiple photos) */}
        {photos.length > 1 && isHovered && (
          <>
            <button
              onClick={handlePrevPhoto}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full transition-all duration-200"
              aria-label="Previous photo"
              style={{
                background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
                boxShadow: `
                  6px 6px 12px rgba(0, 0, 0, 0.25),
                  -4px -4px 8px rgba(255, 255, 255, 0.9),
                  inset 2px 2px 4px rgba(255, 255, 255, 0.5)
                `
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.15)';
                e.currentTarget.style.boxShadow = `
                  8px 8px 16px rgba(0, 0, 0, 0.3),
                  -6px -6px 12px rgba(255, 255, 255, 1)
                `;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = `
                  6px 6px 12px rgba(0, 0, 0, 0.25),
                  -4px -4px 8px rgba(255, 255, 255, 0.9),
                  inset 2px 2px 4px rgba(255, 255, 255, 0.5)
                `;
              }}
            >
              <ChevronLeft className="h-5 w-5" style={{ color: '#1a1a2e' }} />
            </button>
            <button
              onClick={handleNextPhoto}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full transition-all duration-200"
              aria-label="Next photo"
              style={{
                background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
                boxShadow: `
                  6px 6px 12px rgba(0, 0, 0, 0.25),
                  -4px -4px 8px rgba(255, 255, 255, 0.9),
                  inset 2px 2px 4px rgba(255, 255, 255, 0.5)
                `
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.15)';
                e.currentTarget.style.boxShadow = `
                  8px 8px 16px rgba(0, 0, 0, 0.3),
                  -6px -6px 12px rgba(255, 255, 255, 1)
                `;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = `
                  6px 6px 12px rgba(0, 0, 0, 0.25),
                  -4px -4px 8px rgba(255, 255, 255, 0.9),
                  inset 2px 2px 4px rgba(255, 255, 255, 0.5)
                `;
              }}
            >
              <ChevronRight className="h-5 w-5" style={{ color: '#1a1a2e' }} />
            </button>
          </>
        )}

        {/* Navigation dots */}
        {photos.length > 1 && isHovered && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {photos.map((_, index) => (
              <div
                key={index}
                className="rounded-full transition-all duration-300"
                style={{
                  width: index === currentPhotoIndex ? '20px' : '8px',
                  height: '8px',
                  background: index === currentPhotoIndex
                    ? 'linear-gradient(145deg, #ffffff, #f0f0f0)'
                    : 'rgba(255, 255, 255, 0.5)',
                  boxShadow: index === currentPhotoIndex
                    ? `
                      4px 4px 8px rgba(0, 0, 0, 0.3),
                      -2px -2px 4px rgba(255, 255, 255, 0.8),
                      inset 1px 1px 2px rgba(255, 255, 255, 0.5)
                    `
                    : '2px 2px 4px rgba(0, 0, 0, 0.2)'
                }}
              />
            ))}
          </div>
        )}

        {/* Availability Badge (overlay) */}
        {availability && (
          <div className="absolute top-3 right-3">
            <AvailabilityBadge status={availability.status} compact />
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5">
        {/* Header */}
        <div className="mb-3">
          <h3
            className="text-lg font-extrabold mb-2"
            style={{
              color: '#1a1a2e',
              textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
            }}
          >
            {space.name}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="inline-block px-3 py-1 text-xs font-bold rounded-full"
              style={{
                background: 'linear-gradient(145deg, #C4B5FD, #A594D6)',
                color: 'white',
                boxShadow: `
                  4px 4px 8px rgba(165, 148, 214, 0.4),
                  -4px -4px 8px rgba(255, 255, 255, 0.9),
                  inset 1px 1px 2px rgba(255,255,255,0.3)
                `
              }}
            >
              {space.type}
            </span>
            <div
              className="flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-full"
              style={{
                background: 'linear-gradient(145deg, #F0F9FF, #D4E6FF)',
                color: '#0d3d56',
                boxShadow: `
                  3px 3px 6px rgba(133, 196, 219, 0.3),
                  -3px -3px 6px rgba(255, 255, 255, 0.9)
                `
              }}
            >
              <Users className="h-4 w-4" />
              <span>{space.capacity}</span>
            </div>
            {space.equipment?.includes('Computer') && (
              <ComputerBadge variant="full" />
            )}
          </div>
        </div>

        {/* Description (if available) */}
        {space.description && (
          <p
            className="text-sm font-semibold mb-3 line-clamp-2"
            style={{ color: '#4A5568' }}
          >
            {space.description}
          </p>
        )}

        {/* Equipment Icons */}
        {space.equipment && space.equipment.length > 0 && (
          <div className="mb-3">
            <EquipmentIcons equipment={space.equipment} maxDisplay={4} />
          </div>
        )}

        {/* Full Availability Info (if not shown in overlay) */}
        {availability && !availability.status && (
          <div className="mt-3">
            <AvailabilityBadge
              status={availability.status}
              nextAvailable={availability.nextAvailable}
              reason={availability.reason}
            />
          </div>
        )}
      </div>
    </div>
  );
});
