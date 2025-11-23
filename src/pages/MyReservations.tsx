import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, isPast, isFuture, parseISO } from 'date-fns';
import { Calendar, Clock, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import apiClient from '../lib/api/client';
import { useReservationsStore } from '../features/reservations/stores/reservationsStore';
import type { Reservation } from '@/types/reservation';

type TabType = 'upcoming' | 'past';

export default function MyReservations() {
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');

  // Fetch reservations
  const { data: response, isLoading } = useQuery({
    queryKey: ['reservations'],
    queryFn: async () => {
      const res = await apiClient.get('/api/reservations');
      return res.data;
    },
  });

  const reservations = response?.data || [];

  // Filter reservations by tab
  const upcomingReservations = reservations.filter((r: Reservation) => {
    const startTime = parseISO(r.startTime);
    return isFuture(startTime) && r.status !== 'cancelled';
  });

  const pastReservations = reservations.filter((r: Reservation) => {
    const startTime = parseISO(r.startTime);
    return isPast(startTime) || r.status === 'cancelled' || r.status === 'completed';
  });

  const displayedReservations = activeTab === 'upcoming' ? upcomingReservations : pastReservations;

  if (isLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <h1
          className="text-3xl font-extrabold mb-6"
          style={{
            color: '#1a1a2e',
            textShadow: '2px 2px 4px rgba(255,255,255,0.8)'
          }}
        >
          📅 My Reservations
        </h1>
        <div
          className="text-center py-12 rounded-3xl"
          style={{
            background: 'linear-gradient(145deg, #f9f9f9, #efefef)',
            boxShadow: `
              12px 12px 24px rgba(133, 196, 219, 0.4),
              -12px -12px 24px rgba(255, 255, 255, 0.9)
            `
          }}
        >
          <div
            className="animate-spin rounded-full h-12 w-12 mx-auto mb-4"
            style={{
              border: '3px solid transparent',
              borderTop: '3px solid #8BDBDB',
              borderRight: '3px solid #8BDBDB'
            }}
          ></div>
          <p
            className="font-semibold"
            style={{
              color: '#4A5568',
              textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
            }}
          >
            Loading reservations...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1
        className="text-3xl font-extrabold mb-6"
        style={{
          color: '#1a1a2e',
          textShadow: '2px 2px 4px rgba(255,255,255,0.8)'
        }}
      >
        📅 My Reservations
      </h1>

      {/* Clay Tabs */}
      <div className="flex gap-3 mb-6">
        <ClayTab
          active={activeTab === 'upcoming'}
          onClick={() => setActiveTab('upcoming')}
          label={`Upcoming (${upcomingReservations.length})`}
          icon="🔜"
        />
        <ClayTab
          active={activeTab === 'past'}
          onClick={() => setActiveTab('past')}
          label={`Past (${pastReservations.length})`}
          icon="📜"
        />
      </div>

      {/* Reservations List */}
      {displayedReservations.length === 0 ? (
        <div
          className="text-center py-12 rounded-3xl"
          style={{
            background: 'linear-gradient(145deg, #f9f9f9, #efefef)',
            boxShadow: `
              12px 12px 24px rgba(133, 196, 219, 0.4),
              -12px -12px 24px rgba(255, 255, 255, 0.9),
              inset 2px 2px 4px rgba(255,255,255,0.5)
            `
          }}
        >
          <div className="text-6xl mb-4">
            {activeTab === 'upcoming' ? '📭' : '📋'}
          </div>
          <h3
            className="text-lg font-bold mb-2"
            style={{
              color: '#1a1a2e',
              textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
            }}
          >
            No {activeTab} reservations
          </h3>
          <p
            className="font-semibold mb-6"
            style={{
              color: '#4A5568',
              textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
            }}
          >
            {activeTab === 'upcoming'
              ? "You don't have any upcoming reservations."
              : "You don't have any past reservations."}
          </p>
          {activeTab === 'upcoming' && (
            <Link to="/spaces">
              <ClayButton variant="primary">
                🏠 Browse Spaces
              </ClayButton>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {displayedReservations.map((reservation: Reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              showCancel={activeTab === 'upcoming'}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Clay Tab Component
function ClayTab({
  active,
  onClick,
  label,
  icon
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: string;
}) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300"
      style={{
        background: active
          ? 'linear-gradient(145deg, #8BDBDB, #6FB8B8)'
          : 'linear-gradient(145deg, #F0F9FF, #D4E6FF)',
        color: active ? 'white' : '#1a1a2e',
        textShadow: active
          ? '1px 1px 2px rgba(0,0,0,0.2)'
          : '1px 1px 2px rgba(255,255,255,0.6)',
        boxShadow: active
          ? `
              inset 4px 4px 8px rgba(0,0,0,0.15),
              inset -4px -4px 8px rgba(255,255,255,0.3)
            `
          : `
              6px 6px 12px rgba(133, 196, 219, 0.3),
              -6px -6px 12px rgba(255, 255, 255, 0.9)
            `,
        transform: active ? 'translateY(0)' : 'translateY(0)'
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = `
            8px 8px 16px rgba(133, 196, 219, 0.4),
            -8px -8px 16px rgba(255, 255, 255, 0.95)
          `;
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = `
            6px 6px 12px rgba(133, 196, 219, 0.3),
            -6px -6px 12px rgba(255, 255, 255, 0.9)
          `;
        }
      }}
    >
      {icon} {label}
    </button>
  );
}

// Clay Button Component
function ClayButton({
  onClick,
  children,
  variant = 'primary'
}: {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: 'linear-gradient(145deg, #8BDBDB, #6FB8B8)',
          color: 'white'
        };
      case 'danger':
        return {
          background: 'linear-gradient(145deg, #FFB6B6, #FF9999)',
          color: '#8B0000'
        };
      case 'secondary':
      default:
        return {
          background: 'linear-gradient(145deg, #F0F9FF, #D4E6FF)',
          color: '#1a1a2e'
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <button
      onClick={onClick}
      className="px-5 py-2.5 rounded-2xl font-bold text-sm transition-all duration-300"
      style={{
        ...variantStyles,
        textShadow: variant === 'primary' ? '1px 1px 2px rgba(0,0,0,0.2)' : '1px 1px 2px rgba(255,255,255,0.6)',
        boxShadow: `
          8px 8px 16px rgba(133, 196, 219, 0.4),
          -8px -8px 16px rgba(255, 255, 255, 0.9)
        `,
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = `
          12px 12px 24px rgba(133, 196, 219, 0.5),
          -12px -12px 24px rgba(255, 255, 255, 0.95),
          inset 2px 2px 4px rgba(255,255,255,0.4)
        `;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = `
          8px 8px 16px rgba(133, 196, 219, 0.4),
          -8px -8px 16px rgba(255, 255, 255, 0.9)
        `;
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = `
          inset 4px 4px 8px rgba(0,0,0,0.15),
          inset -4px -4px 8px rgba(255,255,255,0.3)
        `;
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = `
          12px 12px 24px rgba(133, 196, 219, 0.5),
          -12px -12px 24px rgba(255, 255, 255, 0.95),
          inset 2px 2px 4px rgba(255,255,255,0.4)
        `;
      }}
    >
      {children}
    </button>
  );
}

interface ReservationCardProps {
  reservation: Reservation;
  showCancel: boolean;
}

function ReservationCard({ reservation, showCancel }: ReservationCardProps) {
  const { removeReservation } = useReservationsStore();
  const startTime = parseISO(reservation.startTime);
  const endTime = parseISO(reservation.endTime);

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }

    try {
      await apiClient.delete(`/api/reservations/${reservation.id}`);
      removeReservation(reservation.id);
    } catch (error) {
      console.error('Failed to cancel reservation:', error);
    }
  };

  const getStatusBadge = () => {
    const statusStyles = {
      confirmed: {
        background: 'linear-gradient(145deg, #D4E6FF, #B3D4FF)',
        color: '#1a5490'
      },
      in_progress: {
        background: 'linear-gradient(145deg, #8BDBDB, #6FB8B8)',
        color: 'white'
      },
      completed: {
        background: 'linear-gradient(145deg, #E5E5E5, #CCCCCC)',
        color: '#4A5568'
      },
      cancelled: {
        background: 'linear-gradient(145deg, #FFB6B6, #FF9999)',
        color: '#8B0000'
      },
    };

    const style = statusStyles[reservation.status];

    return (
      <span
        className="px-3 py-1 rounded-full text-xs font-bold"
        style={{
          ...style,
          textShadow: reservation.status === 'in_progress'
            ? '1px 1px 2px rgba(0,0,0,0.2)'
            : '1px 1px 2px rgba(255,255,255,0.6)',
          boxShadow: `
            4px 4px 8px rgba(133, 196, 219, 0.3),
            -4px -4px 8px rgba(255, 255, 255, 0.8)
          `
        }}
      >
        {reservation.status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  return (
    <div
      className="rounded-3xl p-6 transition-all duration-300"
      style={{
        background: 'linear-gradient(145deg, #f9f9f9, #efefef)',
        boxShadow: `
          12px 12px 24px rgba(133, 196, 219, 0.4),
          -12px -12px 24px rgba(255, 255, 255, 0.9),
          inset 2px 2px 4px rgba(255,255,255,0.5)
        `
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `
          16px 16px 32px rgba(133, 196, 219, 0.5),
          -16px -16px 32px rgba(255, 255, 255, 0.95),
          inset 2px 2px 4px rgba(255,255,255,0.5)
        `;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = `
          12px 12px 24px rgba(133, 196, 219, 0.4),
          -12px -12px 24px rgba(255, 255, 255, 0.9),
          inset 2px 2px 4px rgba(255,255,255,0.5)
        `;
      }}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <h3
              className="text-xl font-extrabold"
              style={{
                color: '#1a1a2e',
                textShadow: '2px 2px 4px rgba(255,255,255,0.8)'
              }}
            >
              {reservation.spaceName || `Space #${reservation.spaceId.substring(0, 8)}`}
            </h3>
            {getStatusBadge()}
          </div>

          {reservation.spaceType && (
            <div className="mb-3">
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  background: 'linear-gradient(145deg, #C4B5FD, #A594D6)',
                  color: 'white',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                  boxShadow: `
                    4px 4px 8px rgba(165, 148, 214, 0.3),
                    -4px -4px 8px rgba(255, 255, 255, 0.8)
                  `
                }}
              >
                {reservation.spaceType}
              </span>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" style={{ color: '#8BDBDB' }} />
              <span
                className="font-semibold text-sm"
                style={{
                  color: '#4A5568',
                  textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                }}
              >
                {format(startTime, 'EEEE, MMMM d, yyyy')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" style={{ color: '#8BDBDB' }} />
              <span
                className="font-semibold text-sm"
                style={{
                  color: '#4A5568',
                  textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                }}
              >
                {format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')}
              </span>
            </div>

            {reservation.notes && (
              <div
                className="mt-3 p-3 rounded-2xl text-sm"
                style={{
                  background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
                  boxShadow: `
                    inset 3px 3px 6px rgba(133, 196, 219, 0.2),
                    inset -3px -3px 6px rgba(255, 255, 255, 0.8)
                  `
                }}
              >
                <strong
                  style={{
                    color: '#1a1a2e',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                  }}
                >
                  Notes:
                </strong>{' '}
                <span
                  style={{
                    color: '#4A5568',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                  }}
                >
                  {reservation.notes}
                </span>
              </div>
            )}
          </div>
        </div>

        {showCancel && reservation.status === 'confirmed' && (
          <ClayButton onClick={handleCancel} variant="danger">
            <X className="w-4 h-4 inline mr-1" />
            Cancel
          </ClayButton>
        )}
      </div>
    </div>
  );
}
