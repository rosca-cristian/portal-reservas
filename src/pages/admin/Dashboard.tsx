import { useEffect, useState } from 'react'
import { Users, BookOpen, TrendingUp, UserPlus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { StatCard } from '@/components/admin/StatCard'
import { apiClient } from '@/lib/api/client'

interface AdminStats {
  users: {
    total: number
    students: number
    instructors: number
    admins: number
  }
  courses: {
    total: number
  }
  enrollments: {
    total: number
    completed: number
    completionRate: number
  }
  growth: {
    newUsersThisMonth: number
    newCoursesThisMonth: number
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        const response = await apiClient.get('/api/admin/stats')
        console.log('Admin stats response:', response.data)
        setStats(response.data)
        setError(null)
      } catch (err) {
        setError('Failed to load admin stats')
        console.error('Error fetching admin stats:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1
          className="text-4xl font-extrabold mb-2"
          style={{
            color: '#1a1a2e',
            textShadow: '2px 2px 4px rgba(255,255,255,0.8)'
          }}
        >
          📊 Admin Dashboard
        </h1>
        <p
          className="font-semibold"
          style={{
            color: '#4A5568',
            textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
          }}
        >
          Overview of system statistics and activity
        </p>
      </div>

      {error && (
        <div
          className="mb-6 p-6 rounded-3xl"
          style={{
            background: 'linear-gradient(145deg, #FFB6B6, #FF9999)',
            color: '#8B0000',
            textShadow: '1px 1px 2px rgba(255,255,255,0.6)',
            boxShadow: `
              12px 12px 24px rgba(255, 150, 150, 0.4),
              -12px -12px 24px rgba(255, 255, 255, 0.9)
            `
          }}
        >
          <strong>⚠️ Error:</strong> {error}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-6 rounded-3xl h-32"
              style={{
                background: 'linear-gradient(145deg, #f9f9f9, #efefef)',
                boxShadow: `
                  12px 12px 24px rgba(133, 196, 219, 0.4),
                  -12px -12px 24px rgba(255, 255, 255, 0.9)
                `
              }}
            >
              <div
                className="h-4 rounded-full mb-4 animate-pulse"
                style={{
                  background: 'linear-gradient(145deg, #e0e0e0, #d0d0d0)'
                }}
              />
              <div
                className="h-8 rounded-full animate-pulse"
                style={{
                  background: 'linear-gradient(145deg, #e0e0e0, #d0d0d0)'
                }}
              />
            </div>
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={stats.users.total}
            icon={Users}
            description={`${stats.users.students} students, ${stats.users.instructors} instructors`}
          />
          <StatCard
            title="Total Courses"
            value={stats.courses.total}
            icon={BookOpen}
            description="All courses in the system"
          />
          <StatCard
            title="Enrollments"
            value={stats.enrollments.total}
            icon={TrendingUp}
            description={`${stats.enrollments.completionRate.toFixed(1)}% completion rate`}
          />
          <StatCard
            title="New Users This Month"
            value={stats.growth.newUsersThisMonth}
            icon={UserPlus}
            description={`${stats.growth.newCoursesThisMonth} new courses`}
          />
        </div>
      ) : null}

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className="p-6 rounded-3xl"
          style={{
            background: 'linear-gradient(145deg, #f9f9f9, #efefef)',
            boxShadow: `
              12px 12px 24px rgba(133, 196, 219, 0.4),
              -12px -12px 24px rgba(255, 255, 255, 0.9),
              inset 2px 2px 4px rgba(255,255,255,0.5)
            `
          }}
        >
          <h2
            className="text-xl font-extrabold mb-4"
            style={{
              color: '#1a1a2e',
              textShadow: '2px 2px 4px rgba(255,255,255,0.8)'
            }}
          >
            📝 Recent Activity
          </h2>
          <p
            className="font-semibold"
            style={{
              color: '#4A5568',
              textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
            }}
          >
            Recent reservations and space updates will appear here
          </p>
        </div>

        <div
          className="p-6 rounded-3xl"
          style={{
            background: 'linear-gradient(145deg, #f9f9f9, #efefef)',
            boxShadow: `
              12px 12px 24px rgba(133, 196, 219, 0.4),
              -12px -12px 24px rgba(255, 255, 255, 0.9),
              inset 2px 2px 4px rgba(255,255,255,0.5)
            `
          }}
        >
          <h2
            className="text-xl font-extrabold mb-4"
            style={{
              color: '#1a1a2e',
              textShadow: '2px 2px 4px rgba(255,255,255,0.8)'
            }}
          >
            ⚡ Quick Actions
          </h2>
          <div className="space-y-3">
            <Link to="/admin/spaces">
              <ClayButton variant="primary">
                🏢 Manage Spaces
              </ClayButton>
            </Link>
            <Link to="/admin/reservations">
              <ClayButton variant="secondary">
                📅 View Reservations
              </ClayButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
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
  variant?: 'primary' | 'secondary' | 'danger';
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: 'linear-gradient(145deg, #8BDBDB, #6FB8B8)',
          color: 'white'
        };
      case 'danger':
        return {
          background: 'linear-gradient(145deg, #FFB6B6, #FF9999)',
          color: '#8B0000'
        };
      case 'secondary':
      default:
        return {
          background: 'linear-gradient(145deg, #F0F9FF, #D4E6FF)',
          color: '#1a1a2e'
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <button
      onClick={onClick}
      className="w-full px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-300"
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
      {children}
    </button>
  );
}
