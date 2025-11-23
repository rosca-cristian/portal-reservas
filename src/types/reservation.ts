export interface Reservation {
  id: string;
  spaceId: string;
  spaceName: string;
  spaceType?: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  type: 'individual' | 'group';

  // Group room specific fields
  groupSize?: number;
  privacyOption?: 'public' | 'private';
  invitationToken?: string;
  isOrganizer?: boolean;
  organizerId?: string;
  participants?: Participant[];
  minCapacity?: number;
  maxCapacity?: number;
  currentCapacity?: number;
}

export interface Participant {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  joinedAt: Date;
  joinedVia: 'direct' | 'invitation';
  role: 'organizer' | 'member';
}

export type PrivacyOption = 'public' | 'private';

export type ReservationStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface AdminReservation extends Reservation {
  userId: string;
  userName: string;
  userEmail: string;
}
