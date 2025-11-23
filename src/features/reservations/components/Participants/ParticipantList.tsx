import { format } from 'date-fns';
import { Crown, User, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Participant } from '@/types/reservation';
import { useRemoveParticipant } from '../../hooks/useParticipant';

interface ParticipantListProps {
  participants: Participant[];
  reservationId: string;
  isOrganizer: boolean;
  currentUserId?: string;
}

export default function ParticipantList({
  participants,
  reservationId,
  isOrganizer,
  currentUserId,
}: ParticipantListProps) {
  const removeParticipantMutation = useRemoveParticipant();

  const handleRemoveParticipant = async (participantId: string) => {
    if (!confirm('Are you sure you want to remove this participant?')) {
      return;
    }

    try {
      await removeParticipantMutation.mutateAsync({
        reservationId,
        participantId,
      });
      toast.success('Participant removed successfully');
    } catch (error) {
      toast.error('Failed to remove participant');
    }
  };

  // Sort participants: organizer first, then by join time
  const sortedParticipants = [...participants].sort((a, b) => {
    // Organizer always first
    const aIsOrganizer = a.role === 'organizer';
    const bIsOrganizer = b.role === 'organizer';

    if (aIsOrganizer && !bIsOrganizer) return -1;
    if (!aIsOrganizer && bIsOrganizer) return 1;

    // Then sort by join time
    const aTime = typeof a.joinedAt === 'string' ? new Date(a.joinedAt).getTime() : a.joinedAt.getTime();
    const bTime = typeof b.joinedAt === 'string' ? new Date(b.joinedAt).getTime() : b.joinedAt.getTime();
    return aTime - bTime;
  });

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Participants ({participants.length})
        </h3>
      </div>

      <ul className="space-y-3">
        {sortedParticipants.map((participant) => {
          const participantIsOrganizer = participant.role === 'organizer';
          const canRemove = isOrganizer &&
                           !participantIsOrganizer &&
                           participant.userId !== currentUserId;

          const joinedAtDate = typeof participant.joinedAt === 'string'
            ? new Date(participant.joinedAt)
            : participant.joinedAt;

          return (
            <li
              key={participant.userId}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {participantIsOrganizer ? (
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Crown className="w-5 h-5 text-blue-600" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {participant.name}
                      {participant.userId === currentUserId && (
                        <span className="ml-2 text-xs text-gray-500">(You)</span>
                      )}
                    </p>
                    {participantIsOrganizer && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        Organizer
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    {participant.email}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Joined {format(joinedAtDate, 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              </div>

              {canRemove && (
                <button
                  onClick={() => handleRemoveParticipant(participant.userId)}
                  disabled={removeParticipantMutation.isPending}
                  className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={`Remove ${participant.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {participants.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>No participants yet</p>
        </div>
      )}
    </div>
  );
}
