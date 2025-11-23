/**
 * useAvailability Hook - Fetch and poll for space availability
 * Story 2.2: Real-Time Availability Overlay
 */

import { useState, useEffect, useCallback } from 'react';
import type { AvailabilityResponse, SpaceAvailability } from '@/types/availability';
import type { ApiResponse } from '@/types/api';
import { apiClient } from '@/lib/api/client';

interface UseAvailabilityResult {
  availability: Map<string, SpaceAvailability>;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const POLL_INTERVAL = 10000; // 10 seconds

export function useAvailability(datetime: Date): UseAvailabilityResult {
  const [availability, setAvailability] = useState<Map<string, SpaceAvailability>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailability = useCallback(async () => {
    try {
      const url = `/api/availability?datetime=${datetime.toISOString()}`;
      const response = await apiClient.get(url);
      const data: ApiResponse<AvailabilityResponse> = response.data;

      if (data.data) {
        const availabilityMap = new Map<string, SpaceAvailability>();
        data.data.spaces.forEach((spaceAvail) => {
          availabilityMap.set(spaceAvail.spaceId, spaceAvail);
        });
        setAvailability(availabilityMap);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching availability:', err);
      setError('Failed to load availability data');
    } finally {
      setLoading(false);
    }
  }, [datetime]);

  // Initial fetch
  useEffect(() => {
    setLoading(true);
    fetchAvailability();
  }, [fetchAvailability]);

  // Set up polling interval
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAvailability();
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchAvailability]);

  // Pause polling when tab is inactive (optimization)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchAvailability();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [fetchAvailability]);

  return {
    availability,
    loading,
    error,
    refetch: fetchAvailability,
  };
}
