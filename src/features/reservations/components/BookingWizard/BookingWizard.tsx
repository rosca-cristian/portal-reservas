import { useEffect } from 'react';
import { useReservationsStore } from '../../stores/reservationsStore';
import DateSelectionStep from './DateSelectionStep';
import ReviewAndConfirmationStep from './ReviewAndConfirmationStep';

interface BookingWizardProps {
  spaceId: string;
  spaceName: string;
  spaceType?: string;
  minCapacity?: number;
  maxCapacity?: number;
  onClose: () => void;
}

export default function BookingWizard({
  spaceId,
  spaceName,
  spaceType,
  minCapacity = 2,
  maxCapacity = 10,
  onClose
}: BookingWizardProps) {
  const { wizard, resetWizard, setIsGroupRoom } = useReservationsStore();
  const isGroupRoom = spaceType === 'group_room';

  useEffect(() => {
    setIsGroupRoom(isGroupRoom);
  }, [isGroupRoom, setIsGroupRoom]);

  const handleCancel = () => {
    resetWizard();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)'
      }}
      onClick={onClose}
    >
      <div
        className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 rounded-3xl"
        style={{
          background: 'linear-gradient(145deg, #f9f9f9, #efefef)',
          boxShadow: `
            20px 20px 40px rgba(133, 196, 219, 0.5),
            -20px -20px 40px rgba(255, 255, 255, 0.95)
          `
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6">
          <h2
            className="text-2xl font-extrabold"
            style={{
              color: '#1a1a2e',
              textShadow: '2px 2px 4px rgba(255,255,255,0.8)'
            }}
          >
            📅 Book {spaceName}
          </h2>
          <div className="flex items-center gap-4 mt-4">
            <div
              className={`flex items-center gap-2 ${wizard.currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                style={{
                  background: wizard.currentStep >= 1
                    ? 'linear-gradient(145deg, #8BDBDB, #6FB8B8)'
                    : 'linear-gradient(145deg, #d0d0d0, #b0b0b0)',
                  boxShadow: wizard.currentStep >= 1
                    ? `
                      6px 6px 12px rgba(139, 219, 219, 0.4),
                      -6px -6px 12px rgba(255, 255, 255, 0.8)
                    `
                    : `
                      4px 4px 8px rgba(200, 200, 200, 0.3),
                      -4px -4px 8px rgba(255, 255, 255, 0.8)
                    `
                }}
              >
                1
              </div>
              <span
                className="font-bold"
                style={{
                  color: wizard.currentStep >= 1 ? '#1a1a2e' : '#9CA3AF',
                  textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                }}
              >
                Date & Time
              </span>
            </div>
            <div
              className="flex-1 h-1 rounded-full"
              style={{
                background: wizard.currentStep >= 2
                  ? 'linear-gradient(90deg, #8BDBDB, #6FB8B8)'
                  : 'linear-gradient(145deg, #e0e0e0, #d0d0d0)',
                boxShadow: `
                  inset 2px 2px 4px rgba(133, 196, 219, 0.2),
                  inset -2px -2px 4px rgba(255, 255, 255, 0.9)
                `
              }}
            />
            <div
              className={`flex items-center gap-2 ${wizard.currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                style={{
                  background: wizard.currentStep >= 2
                    ? 'linear-gradient(145deg, #8BDBDB, #6FB8B8)'
                    : 'linear-gradient(145deg, #d0d0d0, #b0b0b0)',
                  boxShadow: wizard.currentStep >= 2
                    ? `
                      6px 6px 12px rgba(139, 219, 219, 0.4),
                      -6px -6px 12px rgba(255, 255, 255, 0.8)
                    `
                    : `
                      4px 4px 8px rgba(200, 200, 200, 0.3),
                      -4px -4px 8px rgba(255, 255, 255, 0.8)
                    `
                }}
              >
                2
              </div>
              <span
                className="font-bold"
                style={{
                  color: wizard.currentStep >= 2 ? '#1a1a2e' : '#9CA3AF',
                  textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                }}
              >
                Review
              </span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        {wizard.currentStep === 1 && (
          <DateSelectionStep
            spaceId={spaceId}
            minCapacity={minCapacity}
            maxCapacity={maxCapacity}
          />
        )}

        {wizard.currentStep === 2 && (
          <ReviewAndConfirmationStep
            spaceName={spaceName}
            spaceType={spaceType}
          />
        )}

        {/* Footer */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={handleCancel}
            className="px-6 py-2 rounded-2xl font-bold text-sm transition-all duration-200"
            style={{
              background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
              color: '#6B7280',
              border: '1px solid rgba(133, 196, 219, 0.3)',
              boxShadow: `
                4px 4px 8px rgba(133, 196, 219, 0.2),
                -4px -4px 8px rgba(255, 255, 255, 0.9)
              `,
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
