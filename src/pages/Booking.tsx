import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { format, addDays } from 'date-fns';
import { Calendar, Clock, MapPin, ArrowLeft, Users } from 'lucide-react';
import apiClient from '@/lib/api/client';

interface Space {
  id: string;
  name: string;
  type: string;
  capacity: number;
  minCapacity: number;
  description: string;
  photos: string[];
  equipment: string[];
  floor: {
    name: string;
    building: string;
  };
}

export default function Booking() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const spaceId = searchParams.get('spaceId');
  const dateParam = searchParams.get('date');
  const timeParam = searchParams.get('time');

  const [selectedDate, setSelectedDate] = useState<Date>(
    dateParam ? new Date(dateParam) : new Date()
  );
  const [selectedTime, setSelectedTime] = useState<string>(timeParam || '09:00');
  const [duration, setDuration] = useState<number>(2);
  const [notes, setNotes] = useState<string>('');
  const [groupSize, setGroupSize] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  // Fetch space details
  const { data: spaceResponse, isLoading: spaceLoading } = useQuery({
    queryKey: ['space', spaceId],
    queryFn: async () => {
      const res = await apiClient.get(`/api/spaces/${spaceId}`);
      return res.data;
    },
    enabled: !!spaceId,
  });

  const space: Space | undefined = spaceResponse?.data;
  const isGroupRoom = space?.type === 'group-room';

  // Create reservation mutation
  const createReservation = useMutation({
    mutationFn: async (reservationData: any) => {
      console.log('Creating reservation with data:', reservationData);
      const res = await apiClient.post('/api/reservations', reservationData);
      console.log('Reservation created:', res.data);
      return res.data;
    },
    onSuccess: (data) => {
      console.log('Success! Navigating to confirmation:', data);
      navigate(`/booking/confirmation/${data.data.id}`);
    },
    onError: (err: any) => {
      console.error('Booking error:', err);
      console.error('Error response:', err.response?.data);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to create reservation';
      setError(errorMessage);
    },
  });

  useEffect(() => {
    if (!spaceId) {
      navigate('/spaces');
    }
  }, [spaceId, navigate]);

  if (spaceLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{
          background: 'linear-gradient(145deg, #f9f9f9, #efefef)'
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
    );
  }

  if (!space) {
    return (
      <div
        className="p-6 min-h-screen"
        style={{
          background: 'linear-gradient(145deg, #f9f9f9, #efefef)'
        }}
      >
        <h1
          className="text-2xl font-bold mb-4"
          style={{
            color: '#1a1a2e',
            textShadow: '2px 2px 4px rgba(255,255,255,0.8)'
          }}
        >
          Space not found
        </h1>
        <button
          onClick={() => navigate('/spaces')}
          className="px-4 py-2 rounded-2xl font-bold text-sm transition-all duration-200"
          style={{
            background: 'linear-gradient(145deg, #8BDBDB, #6FB8B8)',
            color: 'white',
            textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
            boxShadow: `
              6px 6px 12px rgba(139, 219, 219, 0.4),
              -6px -6px 12px rgba(255, 255, 255, 0.8)
            `,
            cursor: 'pointer'
          }}
        >
          Back to Spaces
        </button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isGroupRoom && groupSize < space.minCapacity) {
      setError(`This room requires at least ${space.minCapacity} participants`);
      return;
    }

    if (isGroupRoom && groupSize > space.capacity) {
      setError(`This room has a maximum capacity of ${space.capacity}`);
      return;
    }

    const [hours, minutes] = selectedTime.split(':').map(Number);
    const startTime = new Date(selectedDate);
    startTime.setHours(hours, minutes, 0, 0);

    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + duration);

    createReservation.mutate({
      spaceId: space.id,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      notes: notes || undefined,
      type: isGroupRoom ? 'group' : 'individual',
      groupSize: isGroupRoom ? groupSize : undefined,
    });
  };

  const timeSlots = Array.from({ length: 14 }, (_, i) => {
    const hour = i + 8;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = addDays(today, 7);

  return (
    <div
      className="min-h-screen p-6"
      style={{
        background: 'linear-gradient(145deg, #f9f9f9, #efefef)'
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/spaces')}
            className="flex items-center mb-4 px-4 py-2 rounded-2xl font-bold text-sm transition-all duration-200"
            style={{
              background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
              color: '#6B7280',
              boxShadow: `
                6px 6px 12px rgba(133, 196, 219, 0.3),
                -6px -6px 12px rgba(255, 255, 255, 0.8)
              `,
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateX(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Spaces
          </button>
          <h1
            className="text-3xl font-extrabold"
            style={{
              color: '#1a1a2e',
              textShadow: '2px 2px 4px rgba(255,255,255,0.8)'
            }}
          >
            📅 Book Space
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Space Details */}
          <div
            className="p-6 rounded-3xl"
            style={{
              background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
              boxShadow: `
                12px 12px 24px rgba(133, 196, 219, 0.4),
                -12px -12px 24px rgba(255, 255, 255, 0.9),
                inset 2px 2px 4px rgba(255,255,255,0.5)
              `
            }}
          >
            <img
              src={space.photos[0] || '/placeholder.jpg'}
              alt={space.name}
              className="w-full h-48 object-cover rounded-2xl mb-4"
              style={{
                boxShadow: `
                  6px 6px 12px rgba(133, 196, 219, 0.3),
                  -6px -6px 12px rgba(255, 255, 255, 0.8)
                `
              }}
            />
            <h2
              className="text-2xl font-extrabold mb-2"
              style={{
                color: '#1a1a2e',
                textShadow: '2px 2px 4px rgba(255,255,255,0.8)'
              }}
            >
              {space.name}
            </h2>
            <div
              className="flex items-center mb-2 font-semibold"
              style={{
                color: '#6B7280',
                textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
              }}
            >
              <MapPin className="w-4 h-4 mr-2" />
              {space.floor.name} - {space.floor.building}
            </div>
            <div
              className="flex items-center mb-4 font-semibold"
              style={{
                color: '#6B7280',
                textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
              }}
            >
              <Users className="w-4 h-4 mr-2" />
              Capacity: {space.capacity}
              {isGroupRoom && ` (Min: ${space.minCapacity})`}
            </div>
            <p
              className="mb-4 font-semibold"
              style={{
                color: '#4A5568',
                textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
              }}
            >
              {space.description}
            </p>
            <div
              className="pt-4"
              style={{
                borderTop: '1px solid rgba(133, 196, 219, 0.2)'
              }}
            >
              <h3
                className="font-extrabold mb-2"
                style={{
                  color: '#1a1a2e',
                  textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                }}
              >
                Equipment
              </h3>
              <div className="flex flex-wrap gap-2">
                {space.equipment.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-sm font-bold"
                    style={{
                      background: 'linear-gradient(145deg, #8BDBDB, #6FB8B8)',
                      color: 'white',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                      boxShadow: `
                        4px 4px 8px rgba(139, 219, 219, 0.3),
                        -4px -4px 8px rgba(255, 255, 255, 0.8)
                      `
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div
            className="p-6 rounded-3xl"
            style={{
              background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
              boxShadow: `
                12px 12px 24px rgba(133, 196, 219, 0.4),
                -12px -12px 24px rgba(255, 255, 255, 0.9),
                inset 2px 2px 4px rgba(255,255,255,0.5)
              `
            }}
          >
            <h2
              className="text-xl font-extrabold mb-4"
              style={{
                color: '#1a1a2e',
                textShadow: '2px 2px 4px rgba(255,255,255,0.8)'
              }}
            >
              Reservation Details
            </h2>
            {error && (
              <div
                className="mb-4 p-3 rounded-2xl font-semibold text-sm"
                style={{
                  background: 'linear-gradient(145deg, #FFB6B6, #FF9999)',
                  color: '#8B0000',
                  textShadow: '1px 1px 2px rgba(255,255,255,0.6)',
                  boxShadow: `
                    6px 6px 12px rgba(255, 150, 150, 0.4),
                    -6px -6px 12px rgba(255, 255, 255, 0.8)
                  `
                }}
              >
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Date */}
              <div>
                <label
                  className="block text-sm font-bold mb-2"
                  style={{
                    color: '#4A5568',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                  }}
                >
                  <Calendar className="inline w-4 h-4 mr-2" />
                  Date
                </label>
                <input
                  type="date"
                  value={format(selectedDate, 'yyyy-MM-dd')}
                  min={format(today, 'yyyy-MM-dd')}
                  max={format(maxDate, 'yyyy-MM-dd')}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl font-semibold text-sm"
                  required
                  style={{
                    background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
                    color: '#1a1a2e',
                    border: 'none',
                    outline: 'none',
                    boxShadow: `
                      inset 4px 4px 8px rgba(133, 196, 219, 0.2),
                      inset -4px -4px 8px rgba(255, 255, 255, 0.9)
                    `
                  }}
                />
                <p
                  className="text-xs mt-1 font-semibold"
                  style={{
                    color: '#6B7280',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                  }}
                >
                  You can book up to 7 days in advance
                </p>
              </div>

              {/* Time */}
              <div>
                <label
                  className="block text-sm font-bold mb-2"
                  style={{
                    color: '#4A5568',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                  }}
                >
                  <Clock className="inline w-4 h-4 mr-2" />
                  Start Time
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl font-semibold text-sm"
                  required
                  style={{
                    background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
                    color: '#1a1a2e',
                    border: 'none',
                    outline: 'none',
                    boxShadow: `
                      inset 4px 4px 8px rgba(133, 196, 219, 0.2),
                      inset -4px -4px 8px rgba(255, 255, 255, 0.9)
                    `
                  }}
                >
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration */}
              <div>
                <label
                  className="block text-sm font-bold mb-2"
                  style={{
                    color: '#4A5568',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                  }}
                >
                  Duration (hours)
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl font-semibold text-sm"
                  required
                  style={{
                    background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
                    color: '#1a1a2e',
                    border: 'none',
                    outline: 'none',
                    boxShadow: `
                      inset 4px 4px 8px rgba(133, 196, 219, 0.2),
                      inset -4px -4px 8px rgba(255, 255, 255, 0.9)
                    `
                  }}
                >
                  <option value={1}>1 hour</option>
                  <option value={2}>2 hours</option>
                  <option value={3}>3 hours</option>
                  <option value={4}>4 hours</option>
                </select>
              </div>

              {/* Group Size (for group rooms) */}
              {isGroupRoom && (
                <div>
                  <label
                    className="block text-sm font-bold mb-2"
                    style={{
                      color: '#4A5568',
                      textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                    }}
                  >
                    <Users className="inline w-4 h-4 mr-2" />
                    Group Size
                  </label>
                  <input
                    type="number"
                    min={space.minCapacity}
                    max={space.capacity}
                    value={groupSize}
                    onChange={(e) => setGroupSize(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl font-semibold text-sm"
                    required
                    style={{
                      background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
                      color: '#1a1a2e',
                      border: 'none',
                      outline: 'none',
                      boxShadow: `
                        inset 4px 4px 8px rgba(133, 196, 219, 0.2),
                        inset -4px -4px 8px rgba(255, 255, 255, 0.9)
                      `
                    }}
                  />
                  <p
                    className="text-xs mt-1 font-semibold"
                    style={{
                      color: '#6B7280',
                      textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                    }}
                  >
                    Min: {space.minCapacity}, Max: {space.capacity}
                  </p>
                </div>
              )}

              {/* Notes */}
              <div>
                <label
                  className="block text-sm font-bold mb-2"
                  style={{
                    color: '#4A5568',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                  }}
                >
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl font-semibold text-sm"
                  rows={3}
                  placeholder="Add any special requests or notes..."
                  style={{
                    background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
                    color: '#1a1a2e',
                    border: 'none',
                    outline: 'none',
                    boxShadow: `
                      inset 4px 4px 8px rgba(133, 196, 219, 0.2),
                      inset -4px -4px 8px rgba(255, 255, 255, 0.9)
                    `,
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Summary */}
              <div
                className="pt-4"
                style={{
                  borderTop: '1px solid rgba(133, 196, 219, 0.2)'
                }}
              >
                <h3
                  className="font-extrabold mb-2"
                  style={{
                    color: '#1a1a2e',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                  }}
                >
                  Reservation Summary
                </h3>
                <div
                  className="space-y-1 text-sm font-semibold"
                  style={{
                    color: '#6B7280',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                  }}
                >
                  <p>
                    <strong style={{ color: '#1a1a2e' }}>Date:</strong> {format(selectedDate, 'MMMM d, yyyy')}
                  </p>
                  <p>
                    <strong style={{ color: '#1a1a2e' }}>Time:</strong> {selectedTime} -
                    {format(
                      new Date().setHours(
                        Number(selectedTime.split(':')[0]) + duration,
                        Number(selectedTime.split(':')[1])
                      ),
                      'HH:mm'
                    )}
                  </p>
                  <p>
                    <strong style={{ color: '#1a1a2e' }}>Duration:</strong> {duration} hour{duration > 1 ? 's' : ''}
                  </p>
                  {isGroupRoom && (
                    <p>
                      <strong style={{ color: '#1a1a2e' }}>Group Size:</strong> {groupSize} people
                    </p>
                  )}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={createReservation.isPending}
                className="w-full px-4 py-3 rounded-2xl font-bold transition-all duration-200"
                style={{
                  background: createReservation.isPending
                    ? 'linear-gradient(145deg, #d0d0d0, #b0b0b0)'
                    : 'linear-gradient(145deg, #8BDBDB, #6FB8B8)',
                  color: 'white',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                  boxShadow: createReservation.isPending
                    ? 'none'
                    : `
                      10px 10px 20px rgba(139, 219, 219, 0.4),
                      -10px -10px 20px rgba(255, 255, 255, 0.9)
                    `,
                  cursor: createReservation.isPending ? 'not-allowed' : 'pointer',
                  opacity: createReservation.isPending ? 0.6 : 1
                }}
              >
                {createReservation.isPending ? 'Creating Reservation...' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
