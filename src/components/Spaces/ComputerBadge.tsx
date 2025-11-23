import { Monitor } from 'lucide-react';

interface ComputerBadgeProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export default function ComputerBadge({ variant = 'full', className = '' }: ComputerBadgeProps) {
  if (variant === 'compact') {
    return (
      <div
        className={`inline-flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full ${className}`}
        title="Computer Available"
        aria-label="This desk has a computer"
      >
        <Monitor className="w-4 h-4 text-blue-600" />
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold ${className}`}
      aria-label="This desk has a computer"
    >
      <Monitor className="w-3.5 h-3.5" />
      <span>Computer</span>
    </div>
  );
}
