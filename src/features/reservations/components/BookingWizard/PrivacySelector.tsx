import { Lock, Unlock } from 'lucide-react';
import { useReservationsStore } from '../../stores/reservationsStore';
import type { PrivacyOption } from '../../../../types/reservation';

export default function PrivacySelector() {
  const { wizard, setPrivacyOption } = useReservationsStore();
  const privacyOption = wizard.privacyOption || 'public';

  const handleChange = (option: PrivacyOption) => {
    setPrivacyOption(option);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Privacy Option
      </label>

      <div className="space-y-3">
        {/* Public Option */}
        <label
          className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
            privacyOption === 'public'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input
            type="radio"
            name="privacyOption"
            value="public"
            checked={privacyOption === 'public'}
            onChange={() => handleChange('public')}
            className="mt-1"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Unlock className="w-4 h-4 text-green-600" />
              <span className="font-medium text-gray-900">Public</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Other users can discover and join this session directly from the floor plan.
              Anyone with the invitation link can join.
            </p>
          </div>
        </label>

        {/* Private Option */}
        <label
          className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
            privacyOption === 'private'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input
            type="radio"
            name="privacyOption"
            value="private"
            checked={privacyOption === 'private'}
            onChange={() => handleChange('private')}
            className="mt-1"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-900">Private</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Only users with the invitation link can join. The session will not appear
              as joinable on the floor plan.
            </p>
          </div>
        </label>
      </div>
    </div>
  );
}
