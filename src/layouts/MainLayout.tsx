import { Outlet, Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

export default function MainLayout() {
  const { user, isAuthenticated, logout } = useAuthStore()

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #D4E6FF 0%, #C4B5FD 50%, #8BDBDB 100%)',
        fontFamily: "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      }}
    >
      <nav
        style={{
          background: 'linear-gradient(180deg, #f9f9f9, #efefef)',
          boxShadow: `
            0 4px 12px rgba(163, 177, 198, 0.3),
            inset 0 -2px 4px rgba(255,255,255,0.8)
          `
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo and Navigation Links */}
            <div className="flex items-center space-x-6">
              <Link
                to="/"
                className="text-2xl font-extrabold hidden md:block"
                style={{
                  color: '#0d3d56',
                  textShadow: `
                    2px 2px 4px rgba(255,255,255,0.8),
                    -1px -1px 2px rgba(13, 61, 86, 0.2)
                  `
                }}
              >
                🏢 SpaceFlow
              </Link>

              {isAuthenticated && (
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <NavLink to="/spaces">🏠 Spaces</NavLink>
                  <NavLink to="/my-reservations">📅 My Reservations</NavLink>
                  <NavLink to="/profile">👤 Profile</NavLink>

                  {user?.role === 'admin' && (
                    <NavLink to="/admin" isAdmin>⚙️ Admin</NavLink>
                  )}
                </div>
              )}
            </div>

            {/* User Info and Actions */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <ClayButton onClick={logout} variant="danger">
                  🚪 Logout
                </ClayButton>
              ) : (
                <>
                  <Link to="/login">
                    <ClayButton variant="secondary">
                      🔑 Login
                    </ClayButton>
                  </Link>
                  <Link to="/register">
                    <ClayButton variant="primary">
                      ✨ Register
                    </ClayButton>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  )
}

// Clay Navigation Link Component
function NavLink({ to, children, isAdmin = false }: { to: string; children: React.ReactNode; isAdmin?: boolean }) {
  return (
    <Link
      to={to}
      className="px-4 py-2 rounded-2xl font-bold text-sm transition-all duration-300"
      style={{
        background: isAdmin
          ? 'linear-gradient(145deg, #FFE5B4, #FFD700)'
          : 'linear-gradient(145deg, #F0F9FF, #D4E6FF)',
        color: isAdmin ? '#8B4513' : '#1a1a2e',
        textShadow: '1px 1px 2px rgba(255,255,255,0.6)',
        boxShadow: `
          6px 6px 12px rgba(133, 196, 219, 0.3),
          -6px -6px 12px rgba(255, 255, 255, 0.9)
        `
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = `
          8px 8px 16px rgba(133, 196, 219, 0.4),
          -8px -8px 16px rgba(255, 255, 255, 0.95)
        `
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = `
          6px 6px 12px rgba(133, 196, 219, 0.3),
          -6px -6px 12px rgba(255, 255, 255, 0.9)
        `
      }}
    >
      {children}
    </Link>
  )
}

// Clay Button Component
function ClayButton({
  onClick,
  children,
  variant = 'primary'
}: {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger'
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: 'linear-gradient(145deg, #8BDBDB, #6FB8B8)',
          color: 'white'
        }
      case 'danger':
        return {
          background: 'linear-gradient(145deg, #FFB6B6, #FF9999)',
          color: '#8B0000'
        }
      case 'secondary':
      default:
        return {
          background: 'linear-gradient(145deg, #F0F9FF, #D4E6FF)',
          color: '#1a1a2e'
        }
    }
  }

  const variantStyles = getVariantStyles()

  return (
    <button
      onClick={onClick}
      className="px-5 py-2.5 rounded-2xl font-bold text-sm transition-all duration-300"
      style={{
        ...variantStyles,
        textShadow: variant === 'primary' ? '1px 1px 2px rgba(0,0,0,0.2)' : '1px 1px 2px rgba(255,255,255,0.6)',
        boxShadow: `
          8px 8px 16px rgba(133, 196, 219, 0.4),
          -8px -8px 16px rgba(255, 255, 255, 0.9)
        `,
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = `
          12px 12px 24px rgba(133, 196, 219, 0.5),
          -12px -12px 24px rgba(255, 255, 255, 0.95),
          inset 2px 2px 4px rgba(255,255,255,0.4)
        `
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = `
          8px 8px 16px rgba(133, 196, 219, 0.4),
          -8px -8px 16px rgba(255, 255, 255, 0.9)
        `
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = `
          inset 4px 4px 8px rgba(0,0,0,0.15),
          inset -4px -4px 8px rgba(255,255,255,0.3)
        `
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = `
          12px 12px 24px rgba(133, 196, 219, 0.5),
          -12px -12px 24px rgba(255, 255, 255, 0.95),
          inset 2px 2px 4px rgba(255,255,255,0.4)
        `
      }}
    >
      {children}
    </button>
  )
}
