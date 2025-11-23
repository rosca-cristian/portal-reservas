/**
 * SpacesGrid Component - Grid layout for space cards
 * Story 2.3: Space Card Component and Grid View
 */

import { useMemo } from 'react';
import type { Space } from '@/types/space';
import type { SpaceAvailability } from '@/types/availability';
import { SpaceCard } from './SpaceCard';

interface SpacesGridProps {
  spaces: Space[];
  availability?: Map<string, SpaceAvailability>;
  onSpaceClick?: (space: Space) => void;
  loading?: boolean;
}

export function SpacesGrid({ spaces, availability, onSpaceClick, loading }: SpacesGridProps) {
  const skeletonCards = useMemo(() => [...Array(8)], []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {skeletonCards.map((_, index) => (
          <SpaceCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (spaces.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] glassmorphism rounded-lg">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No spaces found</h3>
          <p className="text-gray-600">Try adjusting your filters or check back later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {spaces.map((space) => (
        <SpaceCard
          key={space.id}
          space={space}
          availability={availability?.get(space.id)}
          onClick={onSpaceClick}
        />
      ))}
    </div>
  );
}

function SpaceCardSkeleton() {
  return (
    <div className="glassmorphism rounded-lg overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-300" />
      <div className="p-4">
        <div className="h-6 bg-gray-300 rounded mb-2 w-3/4" />
        <div className="h-4 bg-gray-300 rounded mb-3 w-1/2" />
        <div className="h-4 bg-gray-300 rounded mb-2 w-full" />
        <div className="h-4 bg-gray-300 rounded w-2/3" />
        <div className="flex gap-2 mt-3">
          <div className="h-8 w-8 bg-gray-300 rounded" />
          <div className="h-8 w-8 bg-gray-300 rounded" />
          <div className="h-8 w-8 bg-gray-300 rounded" />
        </div>
      </div>
    </div>
  );
}

