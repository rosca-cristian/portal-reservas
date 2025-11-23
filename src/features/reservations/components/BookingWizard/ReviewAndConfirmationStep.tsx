import { useState } from 'react';
import { format } from 'date-fns';
import { Lock, Unlock, Users } from 'lucide-react';
import { useReservationsStore } from '../../stores/reservationsStore';
import { useCreateReservation } from '../../hooks/useCreateReservation';

interface ReviewAndConfirmationStepProps {
  spaceName: string;
  spaceType?: string;
}

export default function ReviewAndConfirmationStep({
  spaceName,
  spaceType = 'Individual Desk'
}: ReviewAndConfirmationStepProps) {
  const [notes, setNotes] = useState('');
  const { wizard, setStepTwoData, setWizardStep } = useReservationsStore();
  const { mutate: createReservation, isPending } = useCreateReservation();

  const { stepOne, groupSize, privacyOption, isGroupRoom } = wizard;

  const handleBack = () => {
    setWizardStep(1);
  };

  const handleConfirm = () => {
    if (!stepOne.spaceId || !stepOne.date || !stepOne.startTime) {
      return;
    }

    setStepTwoData({ notes });

    // Calculate end time (start time + duration)
    const [hours] = stepOne.startTime.split(':');

    const startDateTime = new Date(stepOne.date);
    startDateTime.setHours(parseInt(hours), 0, 0, 0);

    const endDateTime = new Date(stepOne.date);
    endDateTime.setHours(endHour, 0, 0, 0);

    const reservationData: any = {
      spaceId: stepOne.spaceId,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      notes: notes || undefined,
      type: isGroupRoom ? 'group' : 'individual',
    };

    if (isGroupRoom) {
      reservationData.groupSize = groupSize;
      reservationData.privacyOption = privacyOption || 'public';
    }

    createReservation(reservationData);
  };

  return (
    <div className="space-y-6">
      {/* Booking Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Space:</span>
            <span className="font-semibold">{spaceName}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Type:</span>
            <span className="font-semibold">{spaceType}</span>
          </div>

          {stepOne.date && (
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-semibold">
                {format(stepOne.date, 'EEEE, MMMM d, yyyy')}
              </span>
            </div>
          )}

          {stepOne.startTime && (
            <div className="flex justify-between">
              <span className="text-gray-600">Time:</span>
              <span className="font-semibold">
                {stepOne.startTime} - {
                  (() => {
                    const [hours] = stepOne.startTime.split(':');
                    const endHour = parseInt(hours) + (stepOne.duration || 1);
                    return `${endHour.toString().padStart(2, '0')}:00`;
                  })()
                }
              </span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span className="font-semibold">{stepOne.duration || 1} hour(s)</span>
          </div>

          {/* Group Room Fields */}
          {isGroupRoom && (
            <>
              <div className="flex justify-between items-center pt-3 border-t">
                <span className="text-gray-600">Group Size:</span>
                <span className="font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {groupSize} participants
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Privacy:</span>
                <span className="font-semibold flex items-center gap-2">
                  {privacyOption === 'public' ? (
                    <>
                      <Unlock className="w-4 h-4 text-green-600" />
                      Public
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-gray-600" />
                      Private
                    </>
                  )}
                </span>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                <p className="font-medium">You are the organizer</p>
                <p className="mt-1">An invitation link and QR code will be generated after booking confirmation.</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Optional Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
          Notes (Optional)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value.slice(0, 500))}
          placeholder="Add any special requirements or notes..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={4}
          maxLength={500}
        />
        <div className="text-xs text-gray-500 mt-1 text-right">
          {notes.length}/500 characters
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-4">
        <button
          onClick={handleBack}
          disabled={isPending}
          className="px-6 py-2 text-gray-600 hover:text-gray-800 font-semibold disabled:opacity-50"
        >
          Back
        </button>

        <button
          onClick={handleConfirm}
          disabled={isPending}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Confirming...' : 'Confirm Booking'}
        </button>
      </div>
    </div>
  );
}
