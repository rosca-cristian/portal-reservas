import { Eye, CheckCircle, X } from 'lucide-react'

interface PreviewBannerProps {
  onPublish: () => void
  onCancel: () => void
  isPublishing?: boolean
}

export function PreviewBanner({ onPublish, onCancel, isPublishing }: PreviewBannerProps) {
  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-400 text-yellow-900 px-6 py-3 flex items-center justify-between shadow-lg z-50">
      <div className="flex items-center gap-3">
        <Eye className="w-5 h-5" />
        <div>
          <p className="font-semibold">Preview Mode</p>
          <p className="text-sm">You are previewing changes. Click 'Publish' to save or 'Cancel' to discard.</p>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-white text-yellow-900 rounded-lg hover:bg-yellow-50 flex items-center gap-2 font-medium"
          disabled={isPublishing}
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
        <button
          onClick={onPublish}
          disabled={isPublishing}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium disabled:opacity-50"
        >
          <CheckCircle className="w-4 h-4" />
          {isPublishing ? 'Publishing...' : 'Publish Changes'}
        </button>
      </div>
    </div>
  )
}
