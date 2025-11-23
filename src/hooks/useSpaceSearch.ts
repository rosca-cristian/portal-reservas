/**
 * useSpaceSearch Hook - Filter spaces by search query and filters
 * Story 2.4: Search Bar with Quick Filters
 * Story 2.5: Advanced Filter Panel
 */

import { useMemo } from 'react';
import type { Space } from '@/types/space';
import type { SpaceAvailability } from '@/types/availability';

interface UseSpaceSearchOptions {
  spaces: Space[];
  availability?: Map<string, SpaceAvailability>;
  searchQuery: string;
  selectedTypes: string[];
  selectedEquipment: string[];
  availableNow: boolean;
  minCapacity: number;
  requiredEquipment: string[];
}

export function useSpaceSearch({
  spaces,
  availability,
  searchQuery,
  selectedTypes,
  selectedEquipment,
  availableNow,
  minCapacity,
  requiredEquipment,
}: UseSpaceSearchOptions) {
  const filteredSpaces = useMemo(() => {
    let filtered = [...spaces];

    // Filter by search query (name or description)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((space) => {
        const nameMatch = space.name.toLowerCase().includes(query);
        const descriptionMatch = space.description?.toLowerCase().includes(query) || false;
        return nameMatch || descriptionMatch;
      });
    }

    // Filter by type (quick filters)
    if (selectedTypes.length > 0) {
      filtered = filtered.filter((space) => selectedTypes.includes(space.type));
    }

    // Filter by equipment (quick filters - AND logic)
    if (selectedEquipment.length > 0) {
      filtered = filtered.filter((space) => {
        return selectedEquipment.every((equipment) =>
          space.equipment?.includes(equipment)
        );
      });
    }

    // Advanced Filters

    // Filter by availability
    if (availableNow && availability) {
      filtered = filtered.filter((space) => {
        const spaceAvailability = availability.get(space.id);
        return spaceAvailability?.status === 'AVAILABLE';
      });
    }

    // Filter by minimum capacity
    if (minCapacity > 1) {
      filtered = filtered.filter((space) => space.capacity >= minCapacity);
    }

    // Filter by required equipment (advanced - AND logic)
    if (requiredEquipment.length > 0) {
      filtered = filtered.filter((space) => {
        return requiredEquipment.every((equipment) =>
          space.equipment?.includes(equipment)
        );
      });
    }

    return filtered;
  }, [
    spaces,
    availability,
    searchQuery,
    selectedTypes,
    selectedEquipment,
    availableNow,
    minCapacity,
    requiredEquipment,
  ]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedTypes.length > 0 ||
    selectedEquipment.length > 0 ||
    availableNow ||
    minCapacity > 1 ||
    requiredEquipment.length > 0;

  return {
    filteredSpaces,
    resultCount: filteredSpaces.length,
    hasActiveFilters,
  };
}
