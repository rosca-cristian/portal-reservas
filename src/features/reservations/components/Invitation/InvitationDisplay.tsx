import { QRCodeSVG } from 'qrcode.react';
import { Share2, Download } from 'lucide-react';
import { generateInvitationUrl } from '@/lib/utils/invitation';
import CopyLinkButton from './CopyLinkButton';
import ShareButton from './ShareButton';

interface InvitationDisplayProps {
  invitationToken: string;
  reservationId: string;
  spaceName: string;
  date: string;
  time: string;
}

export default function InvitationDisplay({
  invitationToken,
  reservationId,
  spaceName,
  date,
  time
}: InvitationDisplayProps) {
  const invitationUrl = generateInvitationUrl(invitationToken);

  const handleDownloadQR = () => {
    const canvas = document.querySelector('#qr-code canvas') as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `invitation-${reservationId}.png`;
      link.href = url;
      link.click();
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-blue-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Invitation Link & QR Code</h3>

      <div className="grid md:grid-cols-2 gap-6">
        {/* QR Code Section */}
        <div className="flex flex-col items-center space-y-3">
          <div id="qr-code" className="bg-white p-4 rounded-lg shadow-sm">
            <QRCodeSVG
              value={invitationUrl}
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>
          <button
            onClick={handleDownloadQR}
            className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <Download className="w-4 h-4" />
            Download QR Code
          </button>
        </div>

        {/* Link Section */}
        <div className="flex flex-col justify-center space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Invitation Link
            </label>
            <div className="bg-white border border-gray-300 rounded-lg p-3 break-all text-sm text-gray-800">
              {invitationUrl}
            </div>
          </div>

          <div className="flex gap-2">
            <CopyLinkButton url={invitationUrl} />
            <ShareButton
              url={invitationUrl}
              spaceName={spaceName}
              date={date}
              time={time}
            />
          </div>

          <div className="text-xs text-gray-600">
            <p>• Share this link with participants</p>
            <p>• QR code can be scanned with any camera</p>
            <p>• Link expires 30 days after creation</p>
          </div>
        </div>
      </div>
    </div>
  );
}
