import { Lock, Unlock, Users } from 'lucide-react';

interface PrivacyIndicatorProps {
  privacyOption: 'public' | 'private';
  currentCapacity?: number;
  maxCapacity?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function PrivacyIndicator({
  privacyOption,
  currentCapacity,
  maxCapacity,
  size = 'md',
  showLabel = true,
}: PrivacyIndicatorProps) {
  const isPublic = privacyOption === 'public';
  const hasCapacity = currentCapacity !== undefined && maxCapacity !== undefined;
  const isFull = hasCapacity && currentCapacity >= maxCapacity;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  if (isPublic) {
    return (
      <div
        className={`inline-flex items-center gap-2 ${sizeClasses[size]} rounded-full ${
          isFull
            ? 'bg-gray-100 text-gray-600'
            : 'bg-green-100 text-green-700'
        }`}
      >
        {isFull ? (
          <Lock className={iconSizes[size]} />
        ) : (
          <Unlock className={iconSizes[size]} />
        )}
        {showLabel && (
          <span className="font-medium">
            {isFull ? 'Full' : 'Join Available'}
          </span>
        )}
        {hasCapacity && (
          <span className="flex items-center gap-1">
            <Users className={iconSizes[size]} />
            {currentCapacity}/{maxCapacity}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 ${sizeClasses[size]} rounded-full bg-gray-100 text-gray-600`}
    >
      <Lock className={iconSizes[size]} />
      {showLabel && <span className="font-medium">Private Session</span>}
    </div>
  );
}
