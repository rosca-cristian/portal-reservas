import { useState } from 'react';
import { Share2 } from 'lucide-react';
import ShareMenu from './ShareMenu';

interface ShareButtonProps {
  url: string;
  spaceName: string;
  date: string;
  time: string;
}

export default function ShareButton({ url, spaceName, date, time }: ShareButtonProps) {
  const [showMenu, setShowMenu] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: 'Join my study group',
      text: `Join me at ${spaceName} on ${date} at ${time}`,
      url: url,
    };

    // Check if Web Share API is available
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or error - ignore
        if ((err as Error).name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    } else {
      // Show fallback menu
      setShowMenu(true);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium border border-gray-300"
      >
        <Share2 className="w-4 h-4" />
        Share
      </button>

      {showMenu && (
        <ShareMenu
          url={url}
          spaceName={spaceName}
          date={date}
          time={time}
          onClose={() => setShowMenu(false)}
        />
      )}
    </div>
  );
}
