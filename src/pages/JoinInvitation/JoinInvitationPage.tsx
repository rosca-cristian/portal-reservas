import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Users, Calendar, Clock, MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useInvitation, useJoinInvitation } from '@/features/reservations/hooks/useInvitation';
import { toast } from 'sonner';

export default function JoinInvitationPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { data: invitation, isLoading, error } = useInvitation(token!);
  const joinMutation = useJoinInvitation();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      const returnUrl = `/join/${token}`;
      navigate(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
    }
  }, [isAuthenticated, token, navigate]);

  const handleJoin = async () => {
    try {
      await joinMutation.mutateAsync(token!);
      toast.success('Successfully joined the reservation!');
      navigate('/my-reservations');
    } catch (err) {
      toast.error('Failed to join reservation');
    }
  };

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p>Redirecting to login...</p>
    </div>;
  }

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p>Loading invitation...</p>
    </div>;
  }

  if (error || !invitation) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Invalid Invitation</h1>
        <p className="text-gray-600 mb-6">{(error as any)?.message || 'This invitation link is invalid or has expired.'}</p>
        <button onClick={() => navigate('/spaces')} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Browse Spaces
        </button>
      </div>
    </div>;
  }

  const { reservation } = invitation;
  const canJoin = invitation.canJoin && !invitation.error;
  const alreadyJoined = invitation.error?.code === 'ALREADY_JOINED';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6">Join Group Reservation</h1>

          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-500 mt-1" />
              <div>
                <div className="text-sm text-gray-500">Space</div>
                <div className="font-semibold">{reservation.spaceName}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-500 mt-1" />
              <div>
                <div className="text-sm text-gray-500">Date</div>
                <div className="font-semibold">{format(new Date(reservation.startTime), 'EEEE, MMMM d, yyyy')}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gray-500 mt-1" />
              <div>
                <div className="text-sm text-gray-500">Time</div>
                <div className="font-semibold">
                  {format(new Date(reservation.startTime), 'HH:mm')} - {format(new Date(reservation.endTime), 'HH:mm')}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-gray-500 mt-1" />
              <div>
                <div className="text-sm text-gray-500">Participants</div>
                <div className="font-semibold">{reservation.currentCapacity}/{reservation.maxCapacity}</div>
              </div>
            </div>
          </div>

          {/* Participants List */}
          <div className="border-t pt-4 mb-6">
            <h3 className="font-semibold mb-3">Current Participants</h3>
            <div className="space-y-2">
              {reservation.participants.map(p => (
                <div key={p.id} className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-600">
                    {p.name.charAt(0)}
                  </div>
                  <span>{p.name}</span>
                  {p.role === 'organizer' && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Organizer</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          {alreadyJoined ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-semibold text-green-900">You're already in this reservation</p>
                <button onClick={() => navigate('/my-reservations')} className="text-sm text-green-600 hover:underline">
                  View My Reservations
                </button>
              </div>
            </div>
          ) : invitation.error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-900 font-semibold">{invitation.error.message}</p>
            </div>
          ) : (
            <button
              onClick={handleJoin}
              disabled={!canJoin || joinMutation.isPending}
              className={`w-full py-3 rounded-lg font-semibold ${
                canJoin
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {joinMutation.isPending ? 'Joining...' : 'Join Reservation'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
