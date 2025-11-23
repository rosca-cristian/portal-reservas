import { Users, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useJoinInvitation } from '../../reservations/hooks/useInvitation';

interface JoinSessionButtonProps {
  invitationToken: string;
  currentCapacity: number;
  maxCapacity: number;
  spaceName: string;
}

export default function JoinSessionButton({
  invitationToken,
  currentCapacity,
  maxCapacity,
  spaceName,
}: JoinSessionButtonProps) {
  const navigate = useNavigate();
  const [isJoining, setIsJoining] = useState(false);
  const joinMutation = useJoinInvitation();

  const isFull = currentCapacity >= maxCapacity;

  const handleJoinSession = async () => {
    setIsJoining(true);

    try {
      await joinMutation.mutateAsync(invitationToken);
      toast.success(`Successfully joined session at ${spaceName}!`);
      navigate('/my-reservations');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to join session');
      setIsJoining(false);
    }
  };

  if (isFull) {
    return (
      <button
        disabled
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed"
      >
        <Users className="w-5 h-5" />
        <span>Session Full ({currentCapacity}/{maxCapacity})</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleJoinSession}
      disabled={isJoining || joinMutation.isPending}
      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <UserPlus className="w-5 h-5" />
      <span>
        {isJoining || joinMutation.isPending ? 'Joining...' : `Join This Session (${currentCapacity}/${maxCapacity})`}
      </span>
    </button>
  );
}
