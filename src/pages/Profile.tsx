import { useAuthStore } from '@/stores/authStore'

export default function Profile() {
  const { user } = useAuthStore()

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Profile Card */}
      <div
        className="rounded-3xl p-8 transition-all duration-300"
        style={{
          background: 'linear-gradient(145deg, #f9f9f9, #efefef)',
          boxShadow: `
            12px 12px 24px rgba(133, 196, 219, 0.4),
            -12px -12px 24px rgba(255, 255, 255, 0.9),
            inset 2px 2px 4px rgba(255,255,255,0.5)
          `
        }}
      >
        {/* Avatar and Name Section */}
        <div className="flex items-center space-x-6 mb-6">
          {/* Large Avatar */}
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center font-bold text-white text-4xl"
            style={{
              background: 'linear-gradient(145deg, #C4B5FD, #A594D6)',
              boxShadow: `
                8px 8px 16px rgba(165, 148, 214, 0.4),
                -8px -8px 16px rgba(255, 255, 255, 0.9),
                inset 3px 3px 6px rgba(255,255,255,0.4),
                inset -3px -3px 6px rgba(0,0,0,0.1)
              `
            }}
          >
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>

          {/* Name and Role */}
          <div>
            <h1
              className="text-3xl font-extrabold mb-1"
              style={{
                color: '#1a1a2e',
                textShadow: '2px 2px 4px rgba(255,255,255,0.8)'
              }}
            >
              {user?.name}
            </h1>
            <div
              className="inline-block px-4 py-1 rounded-full text-sm font-bold"
              style={{
                background: user?.role === 'admin'
                  ? 'linear-gradient(145deg, #FFE5B4, #FFD700)'
                  : 'linear-gradient(145deg, #8BDBDB, #6FB8B8)',
                color: user?.role === 'admin' ? '#8B4513' : 'white',
                textShadow: user?.role === 'admin'
                  ? '1px 1px 2px rgba(255,255,255,0.6)'
                  : '1px 1px 2px rgba(0,0,0,0.2)',
                boxShadow: `
                  4px 4px 8px rgba(133, 196, 219, 0.3),
                  -4px -4px 8px rgba(255, 255, 255, 0.8)
                `
              }}
            >
              {user?.role?.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          className="h-px mb-6"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(133, 196, 219, 0.3), transparent)'
          }}
        />

        {/* User Info */}
        <div className="space-y-4">
          <InfoRow label="Email" value={user?.email || 'N/A'} icon="📧" />
          <InfoRow label="Role" value={user?.role || 'N/A'} icon="🎭" />
          <InfoRow label="Member Since" value={new Date().toLocaleDateString()} icon="📅" />
        </div>
      </div>
    </div>
  )
}

// Info Row Component
function InfoRow({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div
      className="flex items-center justify-between p-4 rounded-2xl"
      style={{
        background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
        boxShadow: `
          6px 6px 12px rgba(133, 196, 219, 0.2),
          -6px -6px 12px rgba(255, 255, 255, 0.8)
        `
      }}
    >
      <div className="flex items-center space-x-3">
        <span className="text-2xl">{icon}</span>
        <span
          className="font-bold text-sm"
          style={{
            color: '#4A5568',
            textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
          }}
        >
          {label}
        </span>
      </div>
      <span
        className="font-semibold text-sm"
        style={{
          color: '#1a1a2e',
          textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
        }}
      >
        {value}
      </span>
    </div>
  )
}
