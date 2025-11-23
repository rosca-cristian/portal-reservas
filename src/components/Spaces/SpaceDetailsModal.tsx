/**
 * SpaceDetailsModal Component - Display comprehensive space details with booking option
 * Story 2.6: Space Details Modal
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@/components/ui/Modal';
import { EquipmentIcons } from './EquipmentIcons';
import { WeekViewCalendar } from './WeekViewCalendar';
import PrivacyIndicator from '@/features/spaces/components/PrivacyIndicator';
import JoinSessionButton from '@/features/spaces/components/JoinSessionButton';
import type { Space } from '@/types/space';
import { Users, MapPin } from 'lucide-react';

interface SpaceDetailsModalProps {
  space: Space | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SpaceDetailsModal({ space, isOpen, onClose }: SpaceDetailsModalProps) {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);

  if (!space) return null;

  const handleTimeSlotClick = (date: Date, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  const handleBookSpace = () => {
    const params = new URLSearchParams({
      spaceId: space.id,
    });

    if (selectedDate && selectedTime) {
      params.append('date', selectedDate.toISOString());
      params.append('time', selectedTime);
    }

    navigate(`/booking?${params.toString()}`);
    onClose();
  };

  const isGroupRoom = space.type === 'Group Room';
  const isUnavailable = space.availabilityStatus === 'UNAVAILABLE';
  const isOccupied = space.availabilityStatus === 'OCCUPIED';
  const hasCurrentReservation = isOccupied && space.currentReservation;
  const canJoinSession =
    hasCurrentReservation &&
    space.currentReservation.privacyOption === 'public' &&
    space.currentReservation.currentCapacity < space.currentReservation.maxCapacity;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-5xl">
      <div className="space-y-6">
        {/* Header Section */}
        <div>
          <h1
            className="text-3xl font-extrabold mb-3"
            style={{
              color: '#1a1a2e',
              textShadow: '2px 2px 4px rgba(255,255,255,0.8), -1px -1px 2px rgba(0,0,0,0.1)'
            }}
          >
            {space.name}
          </h1>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Type Badge */}
            <span
              className="px-4 py-2 rounded-full text-sm font-bold"
              style={{
                background: 'linear-gradient(145deg, #C4B5FD, #A594D6)',
                color: 'white',
                boxShadow: `
                  6px 6px 12px rgba(165, 148, 214, 0.4),
                  -6px -6px 12px rgba(255, 255, 255, 0.9),
                  inset 2px 2px 4px rgba(255,255,255,0.3)
                `
              }}
            >
              {space.type}
            </span>

            {/* Availability Badge */}
            {space.availabilityStatus && (
              <span
                className="px-4 py-2 rounded-full text-sm font-bold"
                style={
                  space.availabilityStatus === 'AVAILABLE'
                    ? {
                      background: 'linear-gradient(145deg, #A8E6D4, #6FB8B8)',
                      color: '#0d4d3d',
                      boxShadow: `
                          6px 6px 12px rgba(111, 184, 184, 0.4),
                          -6px -6px 12px rgba(255, 255, 255, 0.9),
                          inset 2px 2px 4px rgba(255,255,255,0.3)
                        `
                    }
                    : space.availabilityStatus === 'OCCUPIED'
                      ? {
                        background: 'linear-gradient(145deg, #FFB6B6, #FF9999)',
                        color: '#8B0000',
                        boxShadow: `
                          6px 6px 12px rgba(255, 150, 150, 0.4),
                          -6px -6px 12px rgba(255, 255, 255, 0.9),
                          inset 2px 2px 4px rgba(255,255,255,0.3)
                        `
                      }
                      : {
                        background: 'linear-gradient(145deg, #e0e0e0, #c0c0c0)',
                        color: '#4A5568',
                        boxShadow: `
                          6px 6px 12px rgba(160, 160, 160, 0.4),
                          -6px -6px 12px rgba(255, 255, 255, 0.9),
                          inset 2px 2px 4px rgba(255,255,255,0.3)
                        `
                      }
                }
              >
                {space.availabilityStatus}
              </span>
            )}
          </div>
        </div>

        {/* Photos Carousel - Placeholder */}
        {space.photos && space.photos.length > 0 && (
          <div
            className="relative h-64 md:h-96 rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
              boxShadow: `
                12px 12px 24px rgba(133, 196, 219, 0.3),
                -12px -12px 24px rgba(255, 255, 255, 0.9)
              `
            }}
          >
            <img
              src={space.photos[0]}
              alt={space.name}
              className="w-full h-full object-cover"
            />
            {space.photos.length > 1 && (
              <div
                className="absolute bottom-4 right-4 px-4 py-2 rounded-full text-sm font-bold"
                style={{
                  background: 'linear-gradient(145deg, rgba(139, 219, 219, 0.95), rgba(111, 184, 184, 0.95))',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  boxShadow: `
                    6px 6px 12px rgba(0, 0, 0, 0.3),
                    -4px -4px 8px rgba(255, 255, 255, 0.5)
                  `
                }}
              >
                1 / {space.photos.length}
              </div>
            )}
          </div>
        )}

        {/* Space Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Capacity */}
          <div
            className="p-5 rounded-2xl"
            style={{
              background: 'linear-gradient(145deg, #ffffff, #ececec)',
              boxShadow: `
                10px 10px 20px rgba(133, 196, 219, 0.3),
                -10px -10px 20px rgba(255, 255, 255, 0.9)
              `
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5" style={{ color: '#0d3d56' }} />
              <h4 className="font-bold" style={{ color: '#16213e' }}>Capacity</h4>
            </div>
            <p
              className="text-2xl font-extrabold"
              style={{
                color: '#1a1a2e',
                textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
              }}
            >
              {space.capacity} {space.capacity === 1 ? 'person' : 'people'}
            </p>
            {isGroupRoom && space.minCapacity && (
              <p className="text-sm font-semibold mt-1" style={{ color: '#4A5568' }}>
                Min: {space.minCapacity} people
              </p>
            )}
          </div>

          {/* Floor Location */}
          <div
            className="p-5 rounded-2xl"
            style={{
              background: 'linear-gradient(145deg, #ffffff, #ececec)',
              boxShadow: `
                10px 10px 20px rgba(133, 196, 219, 0.3),
                -10px -10px 20px rgba(255, 255, 255, 0.9)
              `
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-5 w-5" style={{ color: '#0d3d56' }} />
              <h4 className="font-bold" style={{ color: '#16213e' }}>Location</h4>
            </div>
            <p
              className="text-2xl font-extrabold"
              style={{
                color: '#1a1a2e',
                textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
              }}
            >
              {space.floor?.name || `Floor ${space.floorId}`}
            </p>
            {space.floor?.building && (
              <p className="text-sm font-semibold mt-1" style={{ color: '#4A5568' }}>
                {space.floor.building}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        {space.description && (
          <div>
            <h4
              className="font-bold mb-3 text-base"
              style={{
                color: '#16213e',
                textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
              }}
            >
              📝 About this space
            </h4>
            <p
              className="font-semibold leading-relaxed"
              style={{ color: '#4A5568' }}
            >
              {space.description}
            </p>
          </div>
        )}

        {/* Equipment */}
        {space.equipment && space.equipment.length > 0 && (
          <div>
            <h4
              className="font-bold mb-3 text-base"
              style={{
                color: '#16213e',
                textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
              }}
            >
              🛠️ Available Equipment
            </h4>
            <EquipmentIcons equipment={space.equipment} showLabels />
          </div>
        )}

        {/* Current Session Info (for occupied group rooms) */}
        {hasCurrentReservation && isGroupRoom && (
          <div className="glassmorphism p-4 rounded-lg border border-blue-200/50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">Current Session</h4>
              <PrivacyIndicator
                privacyOption={space.currentReservation.privacyOption}
                currentCapacity={space.currentReservation.currentCapacity}
                maxCapacity={space.currentReservation.maxCapacity}
                size="sm"
              />
            </div>

            {space.currentReservation.privacyOption === 'public' && space.currentReservation.invitationToken ? (
              <JoinSessionButton
                invitationToken={space.currentReservation.invitationToken}
                currentCapacity={space.currentReservation.currentCapacity}
                maxCapacity={space.currentReservation.maxCapacity}
                spaceName={space.name}
              />
            ) : (
              <div className="text-center py-4 text-gray-600">
                <p className="text-sm">This is a private session</p>
                <p className="text-xs text-gray-500 mt-1">Join via invitation link only</p>
              </div>
            )}
          </div>
        )}

        {/* Week View Calendar */}
        {!hasCurrentReservation && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Availability This Week</h4>
            <p className="text-sm text-gray-600 mb-3">
              {selectedDate && selectedTime
                ? `Selected: ${selectedDate.toLocaleDateString()} at ${selectedTime}`
                : 'Click on an available time slot to select it (optional)'}
            </p>
            <WeekViewCalendar
              spaceId={space.id}
              onTimeSlotClick={handleTimeSlotClick}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
            />
          </div>
        )}

        {/* Group Room Info */}
        {isGroupRoom && (
          <div className="glassmorphism bg-blue-50/50 p-4 rounded-lg border border-blue-200/50">
            <h4 className="font-medium text-blue-900 mb-2">Group Room Features</h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Create public or private study sessions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Generate invitation links with QR codes for easy sharing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>
                  Flexible capacity: {space.minCapacity || 2} - {space.capacity} people
                </span>
              </li>
            </ul>
          </div>
        )}

        {/* Book This Space Button (only if not showing join button) */}
        {!canJoinSession && (
          <button
            onClick={() => handleBookSpace()}
            disabled={isUnavailable || isOccupied}
            className="w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300"
            style={
              isUnavailable || isOccupied
                ? {
                  background: 'linear-gradient(145deg, #e0e0e0, #c0c0c0)',
                  color: '#7f8c8d',
                  cursor: 'not-allowed',
                  boxShadow: `
                      inset 4px 4px 8px rgba(0,0,0,0.1),
                      inset -4px -4px 8px rgba(255,255,255,0.5)
                    `
                }
                : {
                  background: 'linear-gradient(145deg, #8BDBDB, #6FB8B8)',
                  color: 'white',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                  boxShadow: `
                      8px 8px 16px rgba(133, 196, 219, 0.4),
                      -8px -8px 16px rgba(255, 255, 255, 0.9)
                    `,
                  cursor: 'pointer'
                }
            }
            onMouseEnter={(e) => {
              if (!isUnavailable && !isOccupied) {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = `
                  12px 12px 24px rgba(139, 219, 219, 0.6),
                  -12px -12px 24px rgba(255, 255, 255, 0.95),
                  inset 2px 2px 4px rgba(255,255,255,0.4)
                `;
              }
            }}
            onMouseLeave={(e) => {
              if (!isUnavailable && !isOccupied) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `
                  8px 8px 16px rgba(133, 196, 219, 0.4),
                  -8px -8px 16px rgba(255, 255, 255, 0.9)
                `;
              }
            }}
          >
            {isUnavailable ? '🚫 Space Unavailable' : isOccupied ? '⏰ Currently Occupied' : '📅 Book This Space'}
          </button>
        )}
      </div>
    </Modal>
  );
}
