/**
 * useSpaceSearch Hook Tests
 * Story 2.4: Search Bar with Quick Filters
 */

import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSpaceSearch } from './useSpaceSearch';
import type { Space } from '@/types/space';

const mockSpaces: Space[] = [
  {
    id: 'space-1',
    name: 'Library Study Room 101',
    type: 'Study Room',
    capacity: 4,
    equipment: ['Computer', 'Whiteboard'],
    floorId: 'floor-1',
    description: 'Quiet study space with computer access',
  },
  {
    id: 'space-2',
    name: 'Group Room 102',
    type: 'Group Room',
    capacity: 8,
    equipment: ['Projector', 'Whiteboard'],
    floorId: 'floor-1',
    description: 'Collaborative workspace with presentation equipment',
  },
  {
    id: 'space-3',
    name: 'Individual Desk A1',
    type: 'Individual Desk',
    capacity: 1,
    equipment: ['Computer', 'Monitor'],
    floorId: 'floor-1',
  },
];

describe('useSpaceSearch', () => {
  it('returns all spaces when no filters applied', () => {
    const { result } = renderHook(() =>
      useSpaceSearch({
        spaces: mockSpaces,
        searchQuery: '',
        selectedTypes: [],
        selectedEquipment: [],
        availableNow: false,
        minCapacity: 1,
        requiredEquipment: [],
      })
    );

    expect(result.current.filteredSpaces).toHaveLength(3);
    expect(result.current.resultCount).toBe(3);
    expect(result.current.hasActiveFilters).toBe(false);
  });

  it('filters spaces by name (case-insensitive)', () => {
    const { result } = renderHook(() =>
      useSpaceSearch({
        spaces: mockSpaces,
        searchQuery: 'library',
        selectedTypes: [],
        selectedEquipment: [],
        availableNow: false,
        minCapacity: 1,
        requiredEquipment: [],
      })
    );

    expect(result.current.filteredSpaces).toHaveLength(1);
    expect(result.current.filteredSpaces[0].name).toBe('Library Study Room 101');
    expect(result.current.hasActiveFilters).toBe(true);
  });

  it('filters spaces by description', () => {
    const { result } = renderHook(() =>
      useSpaceSearch({
        spaces: mockSpaces,
        searchQuery: 'collaborative',
        selectedTypes: [],
        selectedEquipment: [],
        availableNow: false,
        minCapacity: 1,
        requiredEquipment: [],
      })
    );

    expect(result.current.filteredSpaces).toHaveLength(1);
    expect(result.current.filteredSpaces[0].id).toBe('space-2');
  });

  it('filters spaces by type', () => {
    const { result } = renderHook(() =>
      useSpaceSearch({
        spaces: mockSpaces,
        searchQuery: '',
        selectedTypes: ['Group Room'],
        selectedEquipment: [],
        availableNow: false,
        minCapacity: 1,
        requiredEquipment: [],
      })
    );

    expect(result.current.filteredSpaces).toHaveLength(1);
    expect(result.current.filteredSpaces[0].type).toBe('Group Room');
  });

  it('filters spaces by multiple types', () => {
    const { result } = renderHook(() =>
      useSpaceSearch({
        spaces: mockSpaces,
        searchQuery: '',
        selectedTypes: ['Study Room', 'Group Room'],
        selectedEquipment: [],
        availableNow: false,
        minCapacity: 1,
        requiredEquipment: [],
      })
    );

    expect(result.current.filteredSpaces).toHaveLength(2);
  });

  it('filters spaces by equipment (AND logic)', () => {
    const { result } = renderHook(() =>
      useSpaceSearch({
        spaces: mockSpaces,
        searchQuery: '',
        selectedTypes: [],
        selectedEquipment: ['Computer', 'Whiteboard'],
        availableNow: false,
        minCapacity: 1,
        requiredEquipment: [],
      })
    );

    // Only space-1 has both Computer AND Whiteboard
    expect(result.current.filteredSpaces).toHaveLength(1);
    expect(result.current.filteredSpaces[0].id).toBe('space-1');
  });

  it('combines search query and type filter', () => {
    const { result } = renderHook(() =>
      useSpaceSearch({
        spaces: mockSpaces,
        searchQuery: 'room',
        selectedTypes: ['Group Room'],
        selectedEquipment: [],
        availableNow: false,
        minCapacity: 1,
        requiredEquipment: [],
      })
    );

    expect(result.current.filteredSpaces).toHaveLength(1);
    expect(result.current.filteredSpaces[0].id).toBe('space-2');
  });

  it('combines all filters (search + type + equipment)', () => {
    const { result } = renderHook(() =>
      useSpaceSearch({
        spaces: mockSpaces,
        searchQuery: 'study',
        selectedTypes: ['Study Room'],
        selectedEquipment: ['Computer'],
        availableNow: false,
        minCapacity: 1,
        requiredEquipment: [],
      })
    );

    expect(result.current.filteredSpaces).toHaveLength(1);
    expect(result.current.filteredSpaces[0].id).toBe('space-1');
  });

  it('returns empty array when no matches found', () => {
    const { result } = renderHook(() =>
      useSpaceSearch({
        spaces: mockSpaces,
        searchQuery: 'nonexistent',
        selectedTypes: [],
        selectedEquipment: [],
        availableNow: false,
        minCapacity: 1,
        requiredEquipment: [],
      })
    );

    expect(result.current.filteredSpaces).toHaveLength(0);
    expect(result.current.resultCount).toBe(0);
  });

  // Advanced Filters Tests (Story 2.5)

  it('filters spaces by minimum capacity', () => {
    const { result } = renderHook(() =>
      useSpaceSearch({
        spaces: mockSpaces,
        searchQuery: '',
        selectedTypes: [],
        selectedEquipment: [],
        availableNow: false,
        minCapacity: 5,
        requiredEquipment: [],
      })
    );

    // Only space-2 has capacity >= 5 (capacity: 8)
    expect(result.current.filteredSpaces).toHaveLength(1);
    expect(result.current.filteredSpaces[0].id).toBe('space-2');
    expect(result.current.hasActiveFilters).toBe(true);
  });

  it('filters spaces by required equipment (AND logic)', () => {
    const { result } = renderHook(() =>
      useSpaceSearch({
        spaces: mockSpaces,
        searchQuery: '',
        selectedTypes: [],
        selectedEquipment: [],
        availableNow: false,
        minCapacity: 1,
        requiredEquipment: ['Computer', 'Whiteboard'],
      })
    );

    // Only space-1 has both Computer AND Whiteboard
    expect(result.current.filteredSpaces).toHaveLength(1);
    expect(result.current.filteredSpaces[0].id).toBe('space-1');
    expect(result.current.hasActiveFilters).toBe(true);
  });

  it('filters by availableNow when availability data is provided', () => {
    const mockAvailability = new Map([
      ['space-1', { spaceId: 'space-1', status: 'AVAILABLE' as const }],
      ['space-2', { spaceId: 'space-2', status: 'OCCUPIED' as const }],
      ['space-3', { spaceId: 'space-3', status: 'AVAILABLE' as const }],
    ]);

    const { result } = renderHook(() =>
      useSpaceSearch({
        spaces: mockSpaces,
        availability: mockAvailability,
        searchQuery: '',
        selectedTypes: [],
        selectedEquipment: [],
        availableNow: true,
        minCapacity: 1,
        requiredEquipment: [],
      })
    );

    // Only space-1 and space-3 are available
    expect(result.current.filteredSpaces).toHaveLength(2);
    expect(result.current.filteredSpaces.map((s) => s.id).sort()).toEqual(['space-1', 'space-3']);
    expect(result.current.hasActiveFilters).toBe(true);
  });

  it('ignores availableNow filter when no availability data provided', () => {
    const { result } = renderHook(() =>
      useSpaceSearch({
        spaces: mockSpaces,
        searchQuery: '',
        selectedTypes: [],
        selectedEquipment: [],
        availableNow: true,
        minCapacity: 1,
        requiredEquipment: [],
      })
    );

    // Should return all spaces when no availability data
    expect(result.current.filteredSpaces).toHaveLength(3);
  });

  it('combines advanced filters with basic filters', () => {
    const { result } = renderHook(() =>
      useSpaceSearch({
        spaces: mockSpaces,
        searchQuery: 'room',
        selectedTypes: ['Study Room', 'Group Room'],
        selectedEquipment: [],
        availableNow: false,
        minCapacity: 4,
        requiredEquipment: ['Whiteboard'],
      })
    );

    // space-1: matches search ('Study Room'), type (Study Room), capacity (4), equipment (Whiteboard)
    // space-2: matches search ('Group Room'), type (Group Room), capacity (8), equipment (Whiteboard)
    expect(result.current.filteredSpaces).toHaveLength(2);
  });

  it('returns empty array when advanced filters exclude all spaces', () => {
    const { result } = renderHook(() =>
      useSpaceSearch({
        spaces: mockSpaces,
        searchQuery: '',
        selectedTypes: [],
        selectedEquipment: [],
        availableNow: false,
        minCapacity: 50,
        requiredEquipment: [],
      })
    );

    // No space has capacity >= 50
    expect(result.current.filteredSpaces).toHaveLength(0);
    expect(result.current.resultCount).toBe(0);
  });
});
