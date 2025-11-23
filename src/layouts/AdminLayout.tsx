import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

export default function AdminLayout() {
  const { user, logout } = useAuthStore()
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <div
      className="min-h-screen flex"
      style={{
        background: 'linear-gradient(135deg, #D4E6FF 0%, #C4B5FD 50%, #8BDBDB 100%)',
        fontFamily: "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      }}
    >
      {/* Sidebar */}
      <aside
        className="w-72"
        style={{
          background: 'linear-gradient(180deg, #f9f9f9, #efefef)',
          boxShadow: `
            8px 0 24px rgba(133, 196, 219, 0.3),
            inset -2px 0 4px rgba(255,255,255,0.8)
          `
        }}
      >
        <div className="p-6">
          {/* Admin Header */}
          <div className="mb-8">
            <h2
              className="text-2xl font-extrabold mb-1"
              style={{
                color: '#1a1a2e',
                textShadow: '2px 2px 4px rgba(255,255,255,0.8)'
              }}
            >
              ⚙️ Admin Panel
            </h2>
            <div
              className="inline-block px-3 py-1 rounded-full text-xs font-bold mt-2"
              style={{
                background: 'linear-gradient(145deg, #FFE5B4, #FFD700)',
                color: '#8B4513',
                textShadow: '1px 1px 2px rgba(255,255,255,0.6)',
                boxShadow: `
                  4px 4px 8px rgba(133, 196, 219, 0.3),
                  -4px -4px 8px rgba(255, 255, 255, 0.8)
                `
              }}
            >
              ADMINISTRATOR
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            <NavLink to="/admin" icon="📊" active={isActive('/admin') && location.pathname === '/admin'}>
              Dashboard
            </NavLink>
            <NavLink to="/admin/spaces" icon="🏢" active={isActive('/admin/spaces')}>
              Spaces
            </NavLink>
            <NavLink to="/admin/reservations" icon="📅" active={isActive('/admin/reservations')}>
              Reservations
            </NavLink>
            <NavLink to="/admin/reports" icon="📈" active={isActive('/admin/reports')}>
              Reports
            </NavLink>
            <NavLink to="/admin/settings" icon="⚙️" active={isActive('/admin/settings')}>
              Settings
            </NavLink>
          </nav>

          {/* Divider */}
          <div
            className="h-px my-6"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(133, 196, 219, 0.3), transparent)'
            }}
          />

          {/* Back to User View */}
          <Link to="/spaces">
            <button
              className="w-full px-4 py-2.5 rounded-2xl font-bold text-sm transition-all duration-300 mb-4"
              style={{
                background: 'linear-gradient(145deg, #F0F9FF, #D4E6FF)',
                color: '#1a1a2e',
                textShadow: '1px 1px 2px rgba(255,255,255,0.6)',
                boxShadow: `
                  6px 6px 12px rgba(133, 196, 219, 0.3),
                  -6px -6px 12px rgba(255, 255, 255, 0.9)
                `
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `
                  8px 8px 16px rgba(133, 196, 219, 0.4),
                  -8px -8px 16px rgba(255, 255, 255, 0.95)
                `;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `
                  6px 6px 12px rgba(133, 196, 219, 0.3),
                  -6px -6px 12px rgba(255, 255, 255, 0.9)
                `;
              }}
            >
              ← Back to User View
            </button>
          </Link>

          {/* Divider */}
          <div
            className="h-px mb-6"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(133, 196, 219, 0.3), transparent)'
            }}
          />

          {/* User Profile Section */}
          <div
            className="p-4 rounded-2xl mb-4"
            style={{
              background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
              boxShadow: `
                6px 6px 12px rgba(133, 196, 219, 0.2),
                -6px -6px 12px rgba(255, 255, 255, 0.8)
              `
            }}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-lg"
                style={{
                  background: 'linear-gradient(145deg, #FFE5B4, #FFD700)',
                  boxShadow: `
                    4px 4px 8px rgba(255, 215, 0, 0.4),
                    -4px -4px 8px rgba(255, 255, 255, 0.9),
                    inset 2px 2px 4px rgba(255,255,255,0.4),
                    inset -2px -2px 4px rgba(0,0,0,0.1)
                  `
                }}
              >
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div>
                <div
                  className="text-sm font-bold"
                  style={{
                    color: '#1a1a2e',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                  }}
                >
                  {user?.name}
                </div>
                <div
                  className="text-xs font-semibold"
                  style={{ color: '#4A5568' }}
                >
                  {user?.email}
                </div>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="w-full px-5 py-2.5 rounded-2xl font-bold text-sm transition-all duration-300"
            style={{
              background: 'linear-gradient(145deg, #FFB6B6, #FF9999)',
              color: '#8B0000',
              textShadow: '1px 1px 2px rgba(255,255,255,0.6)',
              boxShadow: `
                8px 8px 16px rgba(133, 196, 219, 0.4),
                -8px -8px 16px rgba(255, 255, 255, 0.9)
              `,
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = `
                12px 12px 24px rgba(133, 196, 219, 0.5),
                -12px -12px 24px rgba(255, 255, 255, 0.95),
                inset 2px 2px 4px rgba(255,255,255,0.4)
              `;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `
                8px 8px 16px rgba(133, 196, 219, 0.4),
                -8px -8px 16px rgba(255, 255, 255, 0.9)
              `;
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `
                inset 4px 4px 8px rgba(0,0,0,0.15),
                inset -4px -4px 8px rgba(255,255,255,0.3)
              `;
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = `
                12px 12px 24px rgba(133, 196, 219, 0.5),
                -12px -12px 24px rgba(255, 255, 255, 0.95),
                inset 2px 2px 4px rgba(255,255,255,0.4)
              `;
            }}
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}

// Navigation Link Component
function NavLink({
  to,
  icon,
  children,
  active
}: {
  to: string;
  icon: string;
  children: React.ReactNode;
  active: boolean;
}) {
  return (
    <Link to={to}>
      <div
        className="px-4 py-3 rounded-2xl font-bold text-sm transition-all duration-300"
        style={{
          background: active
            ? 'linear-gradient(145deg, #8BDBDB, #6FB8B8)'
            : 'linear-gradient(145deg, #F0F9FF, #D4E6FF)',
          color: active ? 'white' : '#1a1a2e',
          textShadow: active
            ? '1px 1px 2px rgba(0,0,0,0.2)'
            : '1px 1px 2px rgba(255,255,255,0.6)',
          boxShadow: active
            ? `
                inset 4px 4px 8px rgba(0,0,0,0.15),
                inset -4px -4px 8px rgba(255,255,255,0.3)
              `
            : `
                6px 6px 12px rgba(133, 196, 219, 0.3),
                -6px -6px 12px rgba(255, 255, 255, 0.9)
              `
        }}
        onMouseEnter={(e) => {
          if (!active) {
            e.currentTarget.style.transform = 'translateX(4px)';
            e.currentTarget.style.boxShadow = `
              8px 8px 16px rgba(133, 196, 219, 0.4),
              -8px -8px 16px rgba(255, 255, 255, 0.95)
            `;
          }
        }}
        onMouseLeave={(e) => {
          if (!active) {
            e.currentTarget.style.transform = 'translateX(0)';
            e.currentTarget.style.boxShadow = `
              6px 6px 12px rgba(133, 196, 219, 0.3),
              -6px -6px 12px rgba(255, 255, 255, 0.9)
            `;
          }
        }}
      >
        {icon} {children}
      </div>
    </Link>
  )
}
