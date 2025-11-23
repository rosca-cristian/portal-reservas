import { useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { CheckCircle, Calendar, Download, Home } from 'lucide-react';
import { generateICS } from '../lib/utils/icsGenerator';
import InvitationDisplay from '../features/reservations/components/Invitation/InvitationDisplay';
import ParticipantList from '../features/reservations/components/Participants/ParticipantList';
import { useReservation } from '../features/reservations/hooks/useReservation';
import { useAuth } from '../hooks/useAuth';

interface ReservationData {
  id: string;
  spaceName: string;
  startTime: string;
  endTime: string;
  notes?: string;
  createdAt: string;
  type?: 'individual' | 'group';
  invitationToken?: string;
  groupSize?: number;
  privacyOption?: 'public' | 'private';
}

export default function BookingConfirmation() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const reservationFromState = location.state?.reservation as ReservationData | undefined;

  // Fetch reservation from API for real-time updates (especially for group reservations)
  const { data: reservationFromAPI, isLoading } = useReservation(
    id,
    reservationFromState?.type === 'group' // Enable polling for group reservations
  );

  // Use API data if available, otherwise use state data
  const reservation = reservationFromAPI || reservationFromState;

  useEffect(() => {
    if (!reservation && id) {
      console.warn('No reservation data found, redirecting...');
    }
  }, [reservation, id]);

  if (isLoading && !reservationFromState) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          background: 'linear-gradient(145deg, #f9f9f9, #efefef)'
        }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 mx-auto mb-4"
            style={{
              border: '3px solid transparent',
              borderTop: '3px solid #8BDBDB',
              borderRight: '3px solid #8BDBDB'
            }}
          />
          <p
            className="font-semibold"
            style={{
              color: '#6B7280',
              textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
            }}
          >
            Loading reservation...
          </p>
        </div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          background: 'linear-gradient(145deg, #f9f9f9, #efefef)'
        }}
      >
        <div className="text-center">
          <p
            className="mb-4 font-semibold"
            style={{
              color: '#6B7280',
              textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
            }}
          >
            No reservation data found
          </p>
          <button
            onClick={() => navigate('/my-reservations')}
            className="px-4 py-2 rounded-2xl font-bold text-sm transition-all duration-200"
            style={{
              background: 'linear-gradient(145deg, #8BDBDB, #6FB8B8)',
              color: 'white',
              textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
              boxShadow: `
                8px 8px 16px rgba(139, 219, 219, 0.4),
                -8px -8px 16px rgba(255, 255, 255, 0.9)
              `,
              cursor: 'pointer'
            }}
          >
            View My Reservations
          </button>
        </div>
      </div>
    );
  }

  const startDate = new Date(reservation.startTime);
  const endDate = new Date(reservation.endTime);

  const handleDownloadICS = () => {
    const icsContent = generateICS({
      title: `${reservation.spaceName} Reservation`,
      location: reservation.spaceName,
      description: reservation.notes || 'Space reservation',
      startTime: reservation.startTime,
      endTime: reservation.endTime,
    });

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `reservation-${reservation.id}.ics`;
    link.click();
  };

  return (
    <div
      className="min-h-screen py-8 px-4"
      style={{
        background: 'linear-gradient(145deg, #f9f9f9, #efefef)'
      }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div
            className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(145deg, #8BDBDB, #6FB8B8)',
              boxShadow: `
                10px 10px 20px rgba(139, 219, 219, 0.4),
                -10px -10px 20px rgba(255, 255, 255, 0.9),
                inset 2px 2px 4px rgba(255,255,255,0.3)
              `,
              animation: 'bounce 1s infinite'
            }}
          >
            <CheckCircle className="w-12 h-12 text-white" style={{ filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.2))' }} />
          </div>
          <h1
            className="text-3xl font-extrabold mb-2"
            style={{
              color: '#1a1a2e',
              textShadow: '2px 2px 4px rgba(255,255,255,0.8)'
            }}
          >
            ✅ Booking Confirmed!
          </h1>
          <p
            className="font-semibold"
            style={{
              color: '#6B7280',
              textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
            }}
          >
            Your space has been successfully reserved
          </p>
        </div>

        {/* Confirmation Details Card */}
        <div
          className="p-6 mb-6 rounded-3xl"
          style={{
            background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
            boxShadow: `
              12px 12px 24px rgba(133, 196, 219, 0.4),
              -12px -12px 24px rgba(255, 255, 255, 0.9),
              inset 2px 2px 4px rgba(255,255,255,0.5)
            `
          }}
        >
          <div
            className="pb-4 mb-4"
            style={{
              borderBottom: '1px solid rgba(133, 196, 219, 0.2)'
            }}
          >
            <div
              className="text-sm mb-1 font-semibold"
              style={{
                color: '#6B7280',
                textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
              }}
            >
              Confirmation Number
            </div>
            <div
              className="text-2xl font-extrabold px-4 py-2 inline-block rounded-2xl"
              style={{
                background: 'linear-gradient(145deg, #8BDBDB, #6FB8B8)',
                color: 'white',
                textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                boxShadow: `
                  6px 6px 12px rgba(139, 219, 219, 0.4),
                  -6px -6px 12px rgba(255, 255, 255, 0.8)
                `
              }}
            >
              {reservation.id.substring(0, 8).toUpperCase()}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <div
                  className="text-sm font-semibold"
                  style={{
                    color: '#6B7280',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                  }}
                >
                  Space
                </div>
                <div
                  className="font-extrabold text-lg"
                  style={{
                    color: '#1a1a2e',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                  }}
                >
                  {reservation.spaceName}
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <div>
                <div
                  className="text-sm font-semibold"
                  style={{
                    color: '#6B7280',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                  }}
                >
                  Date
                </div>
                <div
                  className="font-bold"
                  style={{
                    color: '#1a1a2e',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                  }}
                >
                  {format(startDate, 'EEEE, MMMM d, yyyy')}
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <div>
                <div
                  className="text-sm font-semibold"
                  style={{
                    color: '#6B7280',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                  }}
                >
                  Time
                </div>
                <div
                  className="font-bold"
                  style={{
                    color: '#1a1a2e',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                  }}
                >
                  {format(startDate, 'HH:mm')} - {format(endDate, 'HH:mm')}
                </div>
              </div>
            </div>

            {reservation.notes && (
              <div>
                <div
                  className="text-sm mb-1 font-semibold"
                  style={{
                    color: '#6B7280',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                  }}
                >
                  Notes
                </div>
                <div
                  className="p-3 rounded-2xl font-semibold"
                  style={{
                    background: 'linear-gradient(145deg, #f5f5f5, #e8e8e8)',
                    color: '#4A5568',
                    boxShadow: `
                      inset 4px 4px 8px rgba(133, 196, 219, 0.2),
                      inset -4px -4px 8px rgba(255, 255, 255, 0.9)
                    `
                  }}
                >
                  {reservation.notes}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Invitation Link & QR Code for Group Rooms */}
        {reservation.type === 'group' && reservation.invitationToken && (
          <div className="mb-6">
            <InvitationDisplay
              invitationToken={reservation.invitationToken}
              reservationId={reservation.id}
              spaceName={reservation.spaceName}
              date={format(startDate, 'EEEE, MMMM d, yyyy')}
              time={`${format(startDate, 'HH:mm')} - ${format(endDate, 'HH:mm')}`}
            />
          </div>
        )}

        {/* Participant List for Group Rooms */}
        {reservation.type === 'group' && reservation.participants && (
          <div className="mb-6">
            <ParticipantList
              participants={reservation.participants}
              reservationId={reservation.id}
              isOrganizer={reservation.organizerId === user?.id}
              currentUserId={user?.id}
            />
          </div>
        )}

        {/* QR Code Placeholder for Individual Reservations */}
        {reservation.type === 'individual' && (
          <div
            className="p-6 mb-6 text-center rounded-3xl"
            style={{
              background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
              boxShadow: `
                12px 12px 24px rgba(133, 196, 219, 0.4),
                -12px -12px 24px rgba(255, 255, 255, 0.9),
                inset 2px 2px 4px rgba(255,255,255,0.5)
              `
            }}
          >
            <div
              className="text-sm mb-3 font-semibold"
              style={{
                color: '#6B7280',
                textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
              }}
            >
              QR Code for Check-in
            </div>
            <div
              className="w-48 h-48 mx-auto rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(145deg, #f5f5f5, #e8e8e8)',
                boxShadow: `
                  inset 6px 6px 12px rgba(133, 196, 219, 0.2),
                  inset -6px -6px 12px rgba(255, 255, 255, 0.9)
                `
              }}
            >
              <span
                className="text-sm font-semibold text-center"
                style={{
                  color: '#9CA3AF',
                  textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                }}
              >
                QR Code<br />(Story 3.3 enhancement)
              </span>
            </div>
            <p
              className="text-xs mt-3 font-semibold"
              style={{
                color: '#6B7280',
                textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
              }}
            >
              Use this QR code for quick check-in (future feature)
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleDownloadICS}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold transition-all duration-200"
            style={{
              background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
              color: '#4A5568',
              border: '2px solid rgba(133, 196, 219, 0.3)',
              boxShadow: `
                6px 6px 12px rgba(133, 196, 219, 0.3),
                -6px -6px 12px rgba(255, 255, 255, 0.8)
              `,
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(139, 219, 219, 0.6)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(133, 196, 219, 0.3)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Download className="w-5 h-5" />
            <span>Add to Calendar</span>
          </button>

          <button
            onClick={() => navigate('/my-reservations')}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold transition-all duration-200"
            style={{
              background: 'linear-gradient(145deg, #8BDBDB, #6FB8B8)',
              color: 'white',
              textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
              boxShadow: `
                8px 8px 16px rgba(139, 219, 219, 0.4),
                -8px -8px 16px rgba(255, 255, 255, 0.9)
              `,
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `
                10px 10px 20px rgba(139, 219, 219, 0.5),
                -10px -10px 20px rgba(255, 255, 255, 0.95)
              `;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `
                8px 8px 16px rgba(139, 219, 219, 0.4),
                -8px -8px 16px rgba(255, 255, 255, 0.9)
              `;
            }}
          >
            <Calendar className="w-5 h-5" />
            <span>My Reservations</span>
          </button>

          <button
            onClick={() => navigate('/spaces')}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold transition-all duration-200"
            style={{
              background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
              color: '#4A5568',
              border: '2px solid rgba(133, 196, 219, 0.3)',
              boxShadow: `
                6px 6px 12px rgba(133, 196, 219, 0.3),
                -6px -6px 12px rgba(255, 255, 255, 0.8)
              `,
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(139, 219, 219, 0.6)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(133, 196, 219, 0.3)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Home className="w-5 h-5" />
            <span>Browse Spaces</span>
          </button>
        </div>

        {/* Email Confirmation Note */}
        <div className="mt-6 text-center text-sm">
          <p
            className="font-semibold"
            style={{
              color: '#6B7280',
              textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
            }}
          >
            📧 A confirmation email has been sent to your registered email address
          </p>
        </div>
      </div>
    </div>
  );
}
