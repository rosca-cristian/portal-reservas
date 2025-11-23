import { useState } from 'react'
import { Eye, RefreshCw } from 'lucide-react'
import ReservationDetailsPanel from './ReservationDetailsPanel'

interface Reservation {
  id: string
  spaceId: string
  userId: string
  startTime: string
  endTime: string
  status: string
  invitationToken: string | null
  notes: string | null
  user: {
    id: string
    name: string
    email: string
    role: string
  }
  space: {
    id: string
    name: string
    type: string
    capacity: number
    floor: {
      name: string
    }
  }
  participants: any[]
}

interface ReservationsTableProps {
  reservations: Reservation[]
  loading: boolean
  onRefresh: () => void
}

const statusStyles: Record<string, { background: string; color: string }> = {
  confirmed: {
    background: 'linear-gradient(145deg, #D4E6FF, #B3D4FF)',
    color: '#1a5490'
  },
  completed: {
    background: 'linear-gradient(145deg, #8BDBDB, #6FB8B8)',
    color: 'white'
  },
  cancelled: {
    background: 'linear-gradient(145deg, #FFB6B6, #FF9999)',
    color: '#8B0000'
  },
  in_progress: {
    background: 'linear-gradient(145deg, #FFE5B4, #FFD700)',
    color: '#8B4513'
  }
}

export default function ReservationsTable({ reservations, loading, onRefresh }: ReservationsTableProps) {
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const handleViewDetails = (reservation: Reservation) => {
    setSelectedReservation(reservation)
    setDetailsOpen(true)
  }

  if (loading) {
    return (
      <div
        className="flex justify-center items-center h-64 rounded-3xl"
        style={{
          background: 'linear-gradient(145deg, #f9f9f9, #efefef)',
          boxShadow: `
            12px 12px 24px rgba(133, 196, 219, 0.4),
            -12px -12px 24px rgba(255, 255, 255, 0.9)
          `
        }}
      >
        <div
          className="animate-spin rounded-full h-12 w-12"
          style={{
            border: '3px solid transparent',
            borderTop: '3px solid #8BDBDB',
            borderRight: '3px solid #8BDBDB'
          }}
        />
      </div>
    )
  }

  if (reservations.length === 0) {
    return (
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
        <p
          className="font-semibold mb-4"
          style={{
            color: '#6B7280',
            textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
          }}
        >
          📭 No reservations found
        </p>
        <button
          onClick={onRefresh}
          className="px-5 py-2.5 rounded-2xl font-bold text-sm transition-all duration-300"
          style={{
            background: 'linear-gradient(145deg, #F0F9FF, #D4E6FF)',
            color: '#1a1a2e',
            textShadow: '1px 1px 2px rgba(255,255,255,0.6)',
            boxShadow: `
              8px 8px 16px rgba(133, 196, 219, 0.4),
              -8px -8px 16px rgba(255, 255, 255, 0.9)
            `,
            cursor: 'pointer'
          }}
        >
          <RefreshCw className="mr-2 h-4 w-4 inline" />
          Refresh
        </button>
      </div>
    )
  }

  return (
    <div>
      <div
        className="rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #f9f9f9, #efefef)',
          boxShadow: `
            12px 12px 24px rgba(133, 196, 219, 0.4),
            -12px -12px 24px rgba(255, 255, 255, 0.9),
            inset 2px 2px 4px rgba(255,255,255,0.5)
          `
        }}
      >
        <table className="w-full">
          <thead
            style={{
              background: 'linear-gradient(145deg, #e8e8e8, #d8d8d8)',
              borderBottom: '1px solid rgba(133, 196, 219, 0.2)'
            }}
          >
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-extrabold uppercase tracking-wider"
                style={{
                  color: '#1a1a2e',
                  textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                }}
              >
                User
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-extrabold uppercase tracking-wider"
                style={{
                  color: '#1a1a2e',
                  textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                }}
              >
                Space
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-extrabold uppercase tracking-wider"
                style={{
                  color: '#1a1a2e',
                  textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                }}
              >
                Date
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-extrabold uppercase tracking-wider"
                style={{
                  color: '#1a1a2e',
                  textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                }}
              >
                Time
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-extrabold uppercase tracking-wider"
                style={{
                  color: '#1a1a2e',
                  textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                }}
              >
                Status
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-extrabold uppercase tracking-wider"
                style={{
                  color: '#1a1a2e',
                  textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                }}
              >
                Type
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-extrabold uppercase tracking-wider"
                style={{
                  color: '#1a1a2e',
                  textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation, index) => (
              <tr
                key={reservation.id}
                className="transition-all duration-200"
                style={{
                  borderBottom: index < reservations.length - 1 ? '1px solid rgba(133, 196, 219, 0.1)' : 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(139, 219, 219, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <td className="px-6 py-4">
                  <div>
                    <div
                      className="font-bold"
                      style={{
                        color: '#1a1a2e',
                        textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                      }}
                    >
                      {reservation.user.name}
                    </div>
                    <div
                      className="text-sm font-semibold"
                      style={{
                        color: '#6B7280',
                        textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                      }}
                    >
                      {reservation.user.email}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div
                      className="font-bold"
                      style={{
                        color: '#1a1a2e',
                        textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                      }}
                    >
                      {reservation.space.name}
                    </div>
                    <div
                      className="text-sm font-semibold"
                      style={{
                        color: '#6B7280',
                        textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                      }}
                    >
                      {reservation.space.type}
                    </div>
                  </div>
                </td>
                <td
                  className="px-6 py-4 font-semibold"
                  style={{
                    color: '#4A5568',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                  }}
                >
                  {new Date(reservation.startTime).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div
                    className="text-sm font-semibold"
                    style={{
                      color: '#4A5568',
                      textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                    }}
                  >
                    {new Date(reservation.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {' - '}
                    {new Date(reservation.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{
                      ...(statusStyles[reservation.status] || statusStyles.confirmed),
                      textShadow: reservation.status === 'completed'
                        ? '1px 1px 2px rgba(0,0,0,0.2)'
                        : '1px 1px 2px rgba(255,255,255,0.6)',
                      boxShadow: `
                        4px 4px 8px rgba(133, 196, 219, 0.3),
                        -4px -4px 8px rgba(255, 255, 255, 0.8)
                      `
                    }}
                  >
                    {reservation.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{
                      background: reservation.participants.length > 0
                        ? 'linear-gradient(145deg, #FFE5B4, #FFD700)'
                        : 'linear-gradient(145deg, #C4B5FD, #A594D6)',
                      color: reservation.participants.length > 0 ? '#8B4513' : '#4C1D95',
                      textShadow: '1px 1px 2px rgba(255,255,255,0.6)',
                      boxShadow: `
                        4px 4px 8px rgba(133, 196, 219, 0.3),
                        -4px -4px 8px rgba(255, 255, 255, 0.8)
                      `
                    }}
                  >
                    {reservation.participants.length > 0 ? 'group' : 'individual'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleViewDetails(reservation)}
                    className="p-2 rounded-xl transition-all duration-200"
                    style={{
                      background: 'linear-gradient(145deg, #F0F9FF, #D4E6FF)',
                      color: '#1a5490',
                      boxShadow: `
                        4px 4px 8px rgba(133, 196, 219, 0.3),
                        -4px -4px 8px rgba(255, 255, 255, 0.8)
                      `,
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = `
                        6px 6px 12px rgba(133, 196, 219, 0.4),
                        -6px -6px 12px rgba(255, 255, 255, 0.9)
                      `;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = `
                        4px 4px 8px rgba(133, 196, 219, 0.3),
                        -4px -4px 8px rgba(255, 255, 255, 0.8)
                      `;
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ReservationDetailsPanel
        reservation={selectedReservation}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onReservationCancelled={onRefresh}
      />
    </div>
  )
}
