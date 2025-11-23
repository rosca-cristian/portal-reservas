/**
 * Space types for floor plan and space management
 * Story 2.1: Interactive SVG Floor Plan Component
 */

export interface Space {
  id: string;
  name: string;
  type: SpaceType;
  capacity: number;
  equipment: string[];
  description?: string;
  floorId: string;
  floor?: { id: string; name: string; building: string }; // Populated when included
  coordinates?: SpaceCoordinates;
  photos?: string[];
  minCapacity?: number; // For group rooms
  availabilityStatus?: 'AVAILABLE' | 'OCCUPIED' | 'UNAVAILABLE';
  currentReservation?: CurrentReservation; // For occupied group rooms
}

export interface CurrentReservation {
  id: string;
  privacyOption: 'public' | 'private';
  currentCapacity: number;
  maxCapacity: number;
  invitationToken?: string; // Only for public rooms
  endTime: string;
}

export type SpaceType = 'Individual Desk' | 'Group Room' | 'Conference Room' | 'desk' | 'group-room';

export interface SpaceCoordinates {
  svgPathId: string;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  rotation?: number;
  shape?: 'rect' | 'circle';
  config?: {
    chairs?: number;
    chairsPosition?: 'horizontal' | 'vertical';
    hasComputer?: boolean;
  };
}

export interface Floor {
  id: string;
  name: string;
  svgPath: string;
  imageUrl?: string;
  dimensions?: {
    width: number;
    height: number;
  };
  building?: string;
}
