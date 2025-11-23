import { Mail, MessageCircle, Twitter, Facebook, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface ShareMenuProps {
  url: string;
  spaceName: string;
  date: string;
  time: string;
  onClose: () => void;
}

export default function ShareMenu({ url, spaceName, date, time, onClose }: ShareMenuProps) {
  const message = `Join my study group at ${spaceName} on ${date} at ${time}!`;

  const shareOptions = [
    {
      name: 'Email',
      icon: Mail,
      action: () => {
        const subject = encodeURIComponent(`Join my study group at ${spaceName}`);
        const body = encodeURIComponent(`${message}\n\n${url}`);
        window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
        onClose();
      },
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      action: () => {
        const text = encodeURIComponent(`${message} ${url}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
        onClose();
      },
    },
    {
      name: 'Twitter',
      icon: Twitter,
      action: () => {
        const text = encodeURIComponent(`${message} ${url}`);
        window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
        onClose();
      },
    },
    {
      name: 'Facebook',
      icon: Facebook,
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        onClose();
      },
    },
    {
      name: 'Copy Link',
      icon: Copy,
      action: async () => {
        try {
          await navigator.clipboard.writeText(url);
          toast.success('Link copied to clipboard!');
          onClose();
        } catch {
          toast.error('Failed to copy link');
        }
      },
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />

      {/* Menu */}
      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
        <div className="py-1">
          {shareOptions.map((option) => (
            <button
              key={option.name}
              onClick={option.action}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
            >
              <option.icon className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700 font-medium">{option.name}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
