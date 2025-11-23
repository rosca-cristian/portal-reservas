/**
 * Spaces Page - Browse and view available spaces with real-time availability
 * Story 2.1: Interactive SVG Floor Plan Component
 * Story 2.2: Real-Time Availability Overlay
 * Story 2.3: Space Card Component and Grid View
 * Story 2.4: Search Bar with Quick Filters
 */

import { useState, useEffect } from 'react';
import { FloorPlan } from '@/components/FloorPlan/FloorPlan';
import { FloorSelector } from '@/components/FloorPlan/FloorSelector';
import { DateTimePicker } from '@/components/FloorPlan/DateTimePicker';
import { AvailabilityLegend } from '@/components/FloorPlan/AvailabilityLegend';
import { SpacesGrid } from '@/components/Spaces/SpacesGrid';
import { ViewToggle, type ViewMode } from '@/components/Spaces/ViewToggle';
import { SearchBar } from '@/components/Spaces/SearchBar';
import { QuickFilters } from '@/components/Spaces/QuickFilters';
import { FilterSummary } from '@/components/Spaces/FilterSummary';
import { AdvancedFilters } from '@/components/Spaces/AdvancedFilters';
import { SpaceDetailsModal } from '@/components/Spaces/SpaceDetailsModal';
import { SkipLinks } from '@/components/SkipLinks';
import { useAvailability } from '@/hooks/useAvailability';
import { useSpaceSearch } from '@/hooks/useSpaceSearch';
import type { Space, Floor } from '@/types/space';
import type { ApiResponse } from '@/types/api';
import { apiClient } from '@/lib/api/client';

export default function Spaces() {
  const [floors, setFloors] = useState<Floor[]>([]);
  const [selectedFloorId, setSelectedFloorId] = useState<string>('');
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [selectedDatetime, setSelectedDatetime] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('floor-plan');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);

  // Advanced filter state
  const [availableNow, setAvailableNow] = useState(false);
  const [minCapacity, setMinCapacity] = useState(1);
  const [maxCapacity, setMaxCapacity] = useState<number | null>(null);
  const [requiredEquipment, setRequiredEquipment] = useState<string[]>([]);

  // Fetch availability with polling
  const { availability, loading: availabilityLoading, error: availabilityError } =
    useAvailability(selectedDatetime);

  // Apply search and filters
  const { filteredSpaces, resultCount, hasActiveFilters } = useSpaceSearch({
    spaces,
    availability,
    searchQuery,
    selectedTypes,
    selectedEquipment,
    availableNow,
    minCapacity,
    requiredEquipment,
  });

  // Load floors on mount
  useEffect(() => {
    loadFloors();
  }, []);

  // Load spaces when floor changes
  useEffect(() => {
    if (selectedFloorId) {
      loadSpaces(selectedFloorId);
    }
  }, [selectedFloorId]);

  const loadFloors = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/floors');
      const data: ApiResponse<Floor[]> = response.data;

      if (data.data && data.data.length > 0) {
        setFloors(data.data);
        // Select first floor by default
        setSelectedFloorId(data.data[0].id);
      }
      setError(null);
    } catch (err) {
      setError('Failed to load floors');
      console.error('Error loading floors:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSpaces = async (floorId: string) => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/api/spaces?floor=${floorId}`);
      const data: ApiResponse<Space[]> = response.data;

      if (data.data) {
        // Add floor association to spaces
        const spacesWithFloor = data.data.map((space) => ({
          ...space,
          floorId: floorId,
        }));
        setSpaces(spacesWithFloor);
      }
      setError(null);
    } catch (err) {
      setError('Failed to load spaces');
      console.error('Error loading spaces:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFloorChange = (floorId: string) => {
    setSelectedFloorId(floorId);
    setSelectedSpace(null); // Clear selection when changing floors
  };

  const handleSpaceClick = (space: Space) => {
    setSelectedSpace(space);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    // Keep selectedSpace for visual feedback (highlighting)
  };

  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleEquipmentToggle = (equipment: string) => {
    setSelectedEquipment((prev) =>
      prev.includes(equipment) ? prev.filter((e) => e !== equipment) : [...prev, equipment]
    );
  };

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setSelectedTypes([]);
    setSelectedEquipment([]);
    setAvailableNow(false);
    setMinCapacity(1);
    setMaxCapacity(null);
    setRequiredEquipment([]);
  };

  const handleRequiredEquipmentToggle = (equipment: string) => {
    setRequiredEquipment((prev) =>
      prev.includes(equipment) ? prev.filter((e) => e !== equipment) : [...prev, equipment]
    );
  };

  const selectedFloor = floors.find((f) => f.id === selectedFloorId);

  if (loading && floors.length === 0) {
    return (
      <div
        className="p-6 flex items-center justify-center min-h-[600px]"
        style={{
          background: 'linear-gradient(135deg, #D4E6FF 0%, #C4B5FD 50%, #8BDBDB 100%)',
          fontFamily: "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
            style={{ borderColor: '#8BDBDB' }}
          ></div>
          <p
            className="mt-4 font-semibold"
            style={{ color: '#16213e' }}
          >
            Loading spaces...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="p-6"
        style={{
          background: 'linear-gradient(135deg, #D4E6FF 0%, #C4B5FD 50%, #8BDBDB 100%)',
          minHeight: '100vh',
          fontFamily: "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        }}
      >
        <div
          className="p-6 rounded-3xl max-w-md mx-auto mt-20"
          style={{
            background: 'linear-gradient(145deg, #FFB6B6, #FF9999)',
            boxShadow: `
              10px 10px 20px rgba(255, 150, 150, 0.4),
              -10px -10px 20px rgba(255, 255, 255, 0.9)
            `
          }}
        >
          <h2
            className="font-extrabold mb-3 text-xl"
            style={{ color: '#8B0000' }}
          >
            ⚠️ Error
          </h2>
          <p
            className="mb-4 font-semibold"
            style={{ color: '#8B0000' }}
          >
            {error}
          </p>
          <button
            onClick={loadFloors}
            className="px-6 py-3 rounded-2xl font-bold transition-all duration-300"
            style={{
              background: 'linear-gradient(145deg, #8BDBDB, #6FB8B8)',
              color: 'white',
              textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
              boxShadow: `
                8px 8px 16px rgba(133, 196, 219, 0.4),
                -8px -8px 16px rgba(255, 255, 255, 0.9)
              `
            }}
          >
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SkipLinks />
      <div
        className="p-6 h-full min-h-screen"
        style={{
          background: 'linear-gradient(135deg, #D4E6FF 0%, #C4B5FD 50%, #8BDBDB 100%)',
          fontFamily: "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        }}
      >
        {/* Header with View Toggle */}
        <header className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <h1
                className="text-2xl sm:text-4xl font-extrabold mb-1 sm:mb-2"
                style={{
                  color: '#0d3d56',
                  textShadow: `
                    2px 2px 4px rgba(255,255,255,0.8),
                    -1px -1px 2px rgba(13, 61, 86, 0.2)
                  `
                }}
              >
                🏢 Spaces
              </h1>
              <p
                className="font-semibold text-sm sm:text-base hidden sm:block"
                style={{ color: '#16213e' }}
              >
                Browse available spaces {viewMode === 'floor-plan' ? 'on the interactive floor plan' : 'in grid view'}
              </p>
            </div>
            <div className="flex justify-end sm:justify-start">
              <ViewToggle view={viewMode} onViewChange={setViewMode} />
            </div>
          </div>
        </header>

        {/* Search and Filters */}
        <nav aria-label="Space search and filters" className="mb-6 space-y-4">
          {/* Search Bar */}
          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          {/* Quick Filters */}
          <QuickFilters
            selectedTypes={selectedTypes}
            selectedEquipment={selectedEquipment}
            onTypeToggle={handleTypeToggle}
            onEquipmentToggle={handleEquipmentToggle}
          />

          {/* Advanced Filters */}
          <AdvancedFilters
            availableNow={availableNow}
            minCapacity={minCapacity}
            maxCapacity={maxCapacity}
            requiredEquipment={requiredEquipment}
            onAvailableNowChange={setAvailableNow}
            onMinCapacityChange={setMinCapacity}
            onMaxCapacityChange={setMaxCapacity}
            onRequiredEquipmentToggle={handleRequiredEquipmentToggle}
          />

          {/* Filter Summary */}
          <FilterSummary
            resultCount={resultCount}
            totalCount={spaces.length}
            hasActiveFilters={hasActiveFilters}
            onClearAll={handleClearAllFilters}
          />
        </nav>

        <main id="main-content">
          {/* Controls Row */}
          <div className="mb-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Floor Selector */}
            <div>
              <FloorSelector
                floors={floors}
                selectedFloorId={selectedFloorId}
                onFloorChange={handleFloorChange}
              />
            </div>

            {/* Date/Time Picker */}
            <div>
              <DateTimePicker
                value={selectedDatetime}
                onChange={setSelectedDatetime}
              />
            </div>

            {/* Availability Legend */}
            <div>
              <AvailabilityLegend />
            </div>
          </div>

          {/* Availability Loading/Error */}
          {availabilityError && (
            <div className="mb-4 p-3 glassmorphism rounded-lg border border-yellow-500/30 bg-yellow-50/50">
              <p className="text-sm text-yellow-700">
                Unable to load availability data. Showing spaces without availability information.
              </p>
            </div>
          )}

          {/* Content Area - Floor Plan or Grid */}
          <section id="search-results" aria-labelledby="results-heading">
            <h2 id="results-heading" className="sr-only">Search Results</h2>
            {viewMode === 'floor-plan' ? (
              <div className="h-[700px] w-full relative">
                {selectedFloor && (
                  <FloorPlan
                    floor={selectedFloor}
                    spaces={filteredSpaces}
                    availability={availability}
                    onSpaceClick={handleSpaceClick}
                    selectedSpace={selectedSpace}
                  />
                )}
                {availabilityLoading && filteredSpaces.length > 0 && (
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 glassmorphism px-4 py-2 rounded-lg z-50">
                    <p className="text-sm text-gray-600">Updating availability...</p>
                  </div>
                )}
              </div>
            ) : (
              <SpacesGrid
                spaces={filteredSpaces}
                availability={availability}
                onSpaceClick={handleSpaceClick}
                loading={loading && spaces.length === 0}
              />
            )}
          </section>
        </main>

        {/* Space Details Modal */}
        <SpaceDetailsModal
          space={selectedSpace}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      </div>
    </>
  );
}

