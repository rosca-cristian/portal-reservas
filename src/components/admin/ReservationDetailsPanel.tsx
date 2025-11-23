import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Mail, Calendar, Clock, Users, MapPin, Ban } from 'lucide-react'
import { apiClient } from '@/lib/api/client'
import CancelReservationDialog from './CancelReservationDialog'

interface Reservation {
  id: string
  spaceId: string
  userId: string
  startTime: string
  endTime: string
  status: string
  invitationToken: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
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
  participants: Array<{
    id: string
    role: string
    status: string
    user: {
      id: string
      name: string
      email: string
    }
  }>
}

interface ReservationDetailsPanelProps {
  reservation: Reservation | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onReservationCancelled?: () => void
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

export default function ReservationDetailsPanel({ reservation, open, onOpenChange, onReservationCancelled }: ReservationDetailsPanelProps) {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)

  if (!reservation) return null

  const handleSendEmail = () => {
    window.location.href = `mailto:${reservation.user.email}`
  }

  const handleCancelReservation = async (reason: string, notes: string) => {
    try {
      await apiClient.delete(`/api/admin/reservations/${reservation.id}`, {
        data: { reason, notes }
      })

      if (onReservationCancelled) {
        onReservationCancelled()
      }

      onOpenChange(false)
    } catch (error) {
      console.error('Error cancelling reservation:', error)
      throw error
    }
  }

  const canCancel = reservation.status === 'confirmed' || reservation.status === 'in_progress'

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="overflow-y-auto w-full sm:max-w-xl"
        style={{
          background: 'linear-gradient(145deg, #f9f9f9, #efefef)',
          border: 'none'
        }}
      >
        <SheetHeader className="mb-6">
          <SheetTitle
            className="text-2xl font-extrabold"
            style={{
              color: '#1a1a2e',
              textShadow: '2px 2px 4px rgba(255,255,255,0.8)'
            }}
          >
            📋 Reservation Details
          </SheetTitle>
          <SheetDescription
            className="font-semibold mt-1"
            style={{
              color: '#6B7280',
              textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
            }}
          >
            ID: {reservation.id.substring(0, 8)}...
          </SheetDescription>
        </SheetHeader>

        {/* Cancel Button */}
        {canCancel && (
          <div className="mb-6">
            <button
              onClick={() => setCancelDialogOpen(true)}
              className="w-full px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-300"
              style={{
                background: 'linear-gradient(145deg, #FFB6B6, #FF9999)',
                color: '#8B0000',
                textShadow: '1px 1px 2px rgba(255,255,255,0.6)',
                boxShadow: `
                  8px 8px 16px rgba(255, 150, 150, 0.4),
                  -8px -8px 16px rgba(255, 255, 255, 0.9)
                `,
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `
                  10px 10px 20px rgba(255, 150, 150, 0.5),
                  -10px -10px 20px rgba(255, 255, 255, 0.95)
                `;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `
                  8px 8px 16px rgba(255, 150, 150, 0.4),
                  -8px -8px 16px rgba(255, 255, 255, 0.9)
                `;
              }}
            >
              <Ban className="h-4 w-4 mr-2 inline" />
              Cancel Reservation
            </button>
          </div>
        )}

        <div className="space-y-6">
          {/* User Information */}
          <div
            className="p-5 rounded-3xl"
            style={{
              background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
              boxShadow: `
                8px 8px 16px rgba(133, 196, 219, 0.3),
                -8px -8px 16px rgba(255, 255, 255, 0.9),
                inset 2px 2px 4px rgba(255,255,255,0.5)
              `
            }}
          >
            <h3
              className="font-extrabold text-lg mb-4"
              style={{
                color: '#1a1a2e',
                textShadow: '2px 2px 4px rgba(255,255,255,0.8)'
              }}
            >
              👤 User Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className="font-bold"
                  style={{
                    color: '#4A5568',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                  }}
                >
                  Name:
                </span>
                <span
                  className="font-semibold"
                  style={{
                    color: '#1a1a2e',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                  }}
                >
                  {reservation.user.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" style={{ color: '#6B7280' }} />
                <span
                  className="font-semibold flex-1"
                  style={{
                    color: '#4A5568',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                  }}
                >
                  {reservation.user.email}
                </span>
                <button
                  onClick={handleSendEmail}
                  className="px-3 py-1 rounded-xl font-bold text-xs transition-all duration-200"
                  style={{
                    background: 'linear-gradient(145deg, #F0F9FF, #D4E6FF)',
                    color: '#1a5490',
                    boxShadow: `
                      4px 4px 8px rgba(133, 196, 219, 0.3),
                      -4px -4px 8px rgba(255, 255, 255, 0.8)
                    `,
                    cursor: 'pointer'
                  }}
                >
                  Send Email
                </button>
              </div>
            </div>
          </div>

          {/* Space Information */}
          <div
            className="p-5 rounded-3xl"
            style={{
              background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
              boxShadow: `
                8px 8px 16px rgba(133, 196, 219, 0.3),
                -8px -8px 16px rgba(255, 255, 255, 0.9),
                inset 2px 2px 4px rgba(255,255,255,0.5)
              `
            }}
          >
            <h3
              className="font-extrabold text-lg mb-4"
              style={{
                color: '#1a1a2e',
                textShadow: '2px 2px 4px rgba(255,255,255,0.8)'
              }}
            >
              📍 Space Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" style={{ color: '#6B7280' }} />
                <span
                  className="font-bold"
                  style={{
                    color: '#1a1a2e',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                  }}
                >
                  {reservation.space.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span
                  className="font-bold text-sm"
                  style={{
                    color: '#4A5568',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                  }}
                >
                  Type:
                </span>
                <span
                  className="font-semibold text-sm"
                  style={{
                    color: '#6B7280',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                  }}
                >
                  {reservation.space.type}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span
                  className="font-bold text-sm"
                  style={{
                    color: '#4A5568',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                  }}
                >
                  Floor:
                </span>
                <span
                  className="font-semibold text-sm"
                  style={{
                    color: '#6B7280',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                  }}
                >
                  {reservation.space.floor.name}
                </span>
              </div>
            </div>
          </div>

          {/* Reservation Details */}
          <div
            className="p-5 rounded-3xl"
            style={{
              background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
              boxShadow: `
                8px 8px 16px rgba(133, 196, 219, 0.3),
                -8px -8px 16px rgba(255, 255, 255, 0.9),
                inset 2px 2px 4px rgba(255,255,255,0.5)
              `
            }}
          >
            <h3
              className="font-extrabold text-lg mb-4"
              style={{
                color: '#1a1a2e',
                textShadow: '2px 2px 4px rgba(255,255,255,0.8)'
              }}
            >
              📅 Reservation Details
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" style={{ color: '#6B7280' }} />
                <span
                  className="font-bold"
                  style={{
                    color: '#4A5568',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                  }}
                >
                  Date:
                </span>
                <span
                  className="font-semibold"
                  style={{
                    color: '#1a1a2e',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                  }}
                >
                  {new Date(reservation.startTime).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" style={{ color: '#6B7280' }} />
                <span
                  className="font-bold"
                  style={{
                    color: '#4A5568',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                  }}
                >
                  Time:
                </span>
                <span
                  className="font-semibold"
                  style={{
                    color: '#1a1a2e',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                  }}
                >
                  {new Date(reservation.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {' - '}
                  {new Date(reservation.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span
                  className="font-bold"
                  style={{
                    color: '#4A5568',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                  }}
                >
                  Status:
                </span>
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
              </div>
              <div className="flex items-center justify-between">
                <span
                  className="font-bold"
                  style={{
                    color: '#4A5568',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                  }}
                >
                  Type:
                </span>
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
              </div>
              <div className="flex items-center justify-between">
                <span
                  className="font-bold text-sm"
                  style={{
                    color: '#4A5568',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                  }}
                >
                  Created:
                </span>
                <span
                  className="font-semibold text-sm"
                  style={{
                    color: '#6B7280',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                  }}
                >
                  {new Date(reservation.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Group Booking Details */}
          {reservation.participants.length > 0 && (
            <div
              className="p-5 rounded-3xl"
              style={{
                background: 'linear-gradient(145deg, #FFF5E6, #FFE5CC)',
                boxShadow: `
                  8px 8px 16px rgba(255, 200, 150, 0.3),
                  -8px -8px 16px rgba(255, 255, 255, 0.9),
                  inset 2px 2px 4px rgba(255,255,255,0.5)
                `
              }}
            >
              <h3
                className="font-extrabold text-lg mb-4 flex items-center gap-2"
                style={{
                  color: '#8B4513',
                  textShadow: '2px 2px 4px rgba(255,255,255,0.8)'
                }}
              >
                <Users className="h-5 w-5" />
                Group Booking Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className="font-bold"
                    style={{
                      color: '#8B4513',
                      textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                    }}
                  >
                    Participants:
                  </span>
                  <span
                    className="font-bold"
                    style={{
                      color: '#8B4513',
                      textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                    }}
                  >
                    {reservation.participants.length}
                  </span>
                </div>
                <div className="space-y-2 mt-3">
                  {reservation.participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center justify-between p-3 rounded-2xl"
                      style={{
                        background: 'linear-gradient(145deg, #FFEDD5, #FED7AA)',
                        boxShadow: `
                          4px 4px 8px rgba(255, 200, 150, 0.2),
                          -4px -4px 8px rgba(255, 255, 255, 0.8)
                        `
                      }}
                    >
                      <div>
                        <div
                          className="font-bold"
                          style={{
                            color: '#8B4513',
                            textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                          }}
                        >
                          {participant.user.name}
                        </div>
                        <div
                          className="text-sm font-semibold"
                          style={{
                            color: '#C2410C',
                            textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                          }}
                        >
                          {participant.user.email}
                        </div>
                      </div>
                      {participant.role === 'organizer' && (
                        <span
                          className="px-2 py-1 rounded-full text-xs font-bold"
                          style={{
                            background: 'linear-gradient(145deg, #D4E6FF, #B3D4FF)',
                            color: '#1a5490',
                            textShadow: '1px 1px 2px rgba(255,255,255,0.6)',
                            boxShadow: `
                              3px 3px 6px rgba(133, 196, 219, 0.3),
                              -3px -3px 6px rgba(255, 255, 255, 0.8)
                            `
                          }}
                        >
                          Organizer
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* History Timeline */}
          <div
            className="p-5 rounded-3xl"
            style={{
              background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
              boxShadow: `
                8px 8px 16px rgba(133, 196, 219, 0.3),
                -8px -8px 16px rgba(255, 255, 255, 0.9),
                inset 2px 2px 4px rgba(255,255,255,0.5)
              `
            }}
          >
            <h3
              className="font-extrabold text-lg mb-4"
              style={{
                color: '#1a1a2e',
                textShadow: '2px 2px 4px rgba(255,255,255,0.8)'
              }}
            >
              📜 History
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      background: 'linear-gradient(145deg, #8BDBDB, #6FB8B8)',
                      boxShadow: '0 0 8px rgba(139, 219, 219, 0.5)'
                    }}
                  />
                  {(reservation.status === 'cancelled' || reservation.status === 'completed') && (
                    <div
                      className="w-0.5 h-full mt-1"
                      style={{
                        background: 'linear-gradient(180deg, #8BDBDB, #e0e0e0)'
                      }}
                    />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div
                    className="font-bold"
                    style={{
                      color: '#1a1a2e',
                      textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                    }}
                  >
                    ✅ Reservation Created
                  </div>
                  <div
                    className="text-sm font-semibold mt-1"
                    style={{
                      color: '#6B7280',
                      textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                    }}
                  >
                    {new Date(reservation.createdAt).toLocaleString()}
                  </div>
                  <div
                    className="text-sm font-semibold mt-1"
                    style={{
                      color: '#4A5568',
                      textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                    }}
                  >
                    Created by {reservation.user.name}
                  </div>
                </div>
              </div>

              {reservation.status === 'cancelled' && (
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        background: 'linear-gradient(145deg, #FFB6B6, #FF9999)',
                        boxShadow: '0 0 8px rgba(255, 150, 150, 0.5)'
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div
                      className="font-bold"
                      style={{
                        color: '#8B0000',
                        textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                      }}
                    >
                      ❌ Reservation Cancelled
                    </div>
                    <div
                      className="text-sm font-semibold mt-1"
                      style={{
                        color: '#6B7280',
                        textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                      }}
                    >
                      {new Date(reservation.updatedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              )}

              {reservation.status === 'completed' && (
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        background: 'linear-gradient(145deg, #8BDBDB, #6FB8B8)',
                        boxShadow: '0 0 8px rgba(139, 219, 219, 0.5)'
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div
                      className="font-bold"
                      style={{
                        color: '#1a1a2e',
                        textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                      }}
                    >
                      ✅ Reservation Completed
                    </div>
                    <div
                      className="text-sm font-semibold mt-1"
                      style={{
                        color: '#6B7280',
                        textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                      }}
                    >
                      {new Date(reservation.endTime).toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>

      <CancelReservationDialog
        reservation={reservation}
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        onConfirm={handleCancelReservation}
      />
    </Sheet>
  )
}
