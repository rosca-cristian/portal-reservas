import { useState, useEffect } from 'react'
import { RefreshCw, TrendingUp, Calendar, Users, MapPin } from 'lucide-react'
import { apiClient } from '@/lib/api/client'

interface Space {
  id: string
  name: string
  type: string
  capacity: number
  floor: { name: string }
}

interface UtilizationMetrics {
  totalReservations: number
  utilizationRate: number
  mostPopularSpace: Space
  totalUsers: number
  popularSpaces: Array<{ space: Space; reservationCount: number; utilizationRate: number }>
  underutilizedSpaces: Array<{ space: Space; reservationCount: number; utilizationRate: number }>
}

export default function Reports() {
  const [metrics, setMetrics] = useState<UtilizationMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const fetchMetrics = async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = {}
      if (dateFrom) params.dateFrom = dateFrom
      if (dateTo) params.dateTo = dateTo

      const response = await apiClient.get('/api/admin/analytics/utilization', { params })
      setMetrics(response.data.data)
    } catch (error) {
      console.error('Error fetching metrics:', error)
      setMetrics(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
  }, [dateFrom, dateTo])

  if (loading) {
    return (
      <div className="p-6">
        <div
          className="flex justify-center items-center h-64 rounded-3xl"
          style={{
            background: 'linear-gradient(145deg, #f9f9f9, #efefef)',
            boxShadow: `
              12px 12px 24px rgba(133, 196, 219, 0.4),
              -12px -12px 24px rgba(255, 255, 255, 0.9)
            `
          }}
        >
          <div
            className="animate-spin rounded-full h-12 w-12"
            style={{
              border: '3px solid transparent',
              borderTop: '3px solid #8BDBDB',
              borderRight: '3px solid #8BDBDB'
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1
          className="text-3xl font-extrabold"
          style={{
            color: '#1a1a2e',
            textShadow: '2px 2px 4px rgba(255,255,255,0.8)'
          }}
        >
          📈 Utilization Reports
        </h1>
        <ClayButton onClick={fetchMetrics} variant="secondary">
          <RefreshCw className="h-4 w-4 mr-2 inline" />
          Refresh
        </ClayButton>
      </div>

      {/* Date Range Filter */}
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
        <div className="space-y-4">
          <h2
            className="text-lg font-extrabold"
            style={{
              color: '#1a1a2e',
              textShadow: '2px 2px 4px rgba(255,255,255,0.8)'
            }}
          >
            📅 Date Range
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="dateFrom"
                className="text-sm font-bold"
                style={{
                  color: '#4A5568',
                  textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                }}
              >
                From
              </label>
              <input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-300"
                style={{
                  background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
                  color: '#1a1a2e',
                  border: 'none',
                  outline: 'none',
                  boxShadow: `
                    inset 4px 4px 8px rgba(133, 196, 219, 0.2),
                    inset -4px -4px 8px rgba(255, 255, 255, 0.9)
                  `
                }}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="dateTo"
                className="text-sm font-bold"
                style={{
                  color: '#4A5568',
                  textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                }}
              >
                To
              </label>
              <input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-300"
                style={{
                  background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
                  color: '#1a1a2e',
                  border: 'none',
                  outline: 'none',
                  boxShadow: `
                    inset 4px 4px 8px rgba(133, 196, 219, 0.2),
                    inset -4px -4px 8px rgba(255, 255, 255, 0.9)
                  `
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      {metrics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              label="Total Reservations"
              value={metrics.totalReservations}
              icon={Calendar}
              iconColor="#8BDBDB"
            />
            <MetricCard
              label="Utilization Rate"
              value={`${metrics.utilizationRate}%`}
              icon={TrendingUp}
              iconColor="#6FB8B8"
            />
            <MetricCard
              label="Total Users"
              value={metrics.totalUsers}
              icon={Users}
              iconColor="#C4B5FD"
            />
            <MetricCard
              label="Most Popular"
              value={metrics.mostPopularSpace?.name || 'N/A'}
              icon={MapPin}
              iconColor="#FFD700"
              isText
            />
          </div>

          {/* Popular Spaces */}
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
              className="text-lg font-extrabold mb-4"
              style={{
                color: '#1a1a2e',
                textShadow: '2px 2px 4px rgba(255,255,255,0.8)'
              }}
            >
              🏆 Popular Spaces
            </h2>
            <div className="space-y-3">
              {metrics.popularSpaces.map((item, index) => (
                <div
                  key={item.space.id}
                  className="flex items-center justify-between p-4 rounded-2xl"
                  style={{
                    background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
                    boxShadow: `
                      6px 6px 12px rgba(133, 196, 219, 0.2),
                      -6px -6px 12px rgba(255, 255, 255, 0.8)
                    `
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="text-lg font-extrabold"
                      style={{
                        color: '#9CA3AF',
                        textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                      }}
                    >
                      #{index + 1}
                    </span>
                    <span
                      className="font-bold"
                      style={{
                        color: '#1a1a2e',
                        textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                      }}
                    >
                      {item.space.name}
                    </span>
                  </div>
                  <span
                    className="text-sm font-bold px-3 py-1 rounded-full"
                    style={{
                      background: 'linear-gradient(145deg, #8BDBDB, #6FB8B8)',
                      color: 'white',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                      boxShadow: `
                        4px 4px 8px rgba(139, 219, 219, 0.3),
                        -4px -4px 8px rgba(255, 255, 255, 0.8)
                      `
                    }}
                  >
                    {item.reservationCount} reservations
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Underutilized Spaces */}
          {metrics.underutilizedSpaces.length > 0 && (
            <div
              className="p-6 rounded-3xl"
              style={{
                background: 'linear-gradient(145deg, #FFF5E6, #FFE5CC)',
                boxShadow: `
                  12px 12px 24px rgba(255, 200, 150, 0.4),
                  -12px -12px 24px rgba(255, 255, 255, 0.9),
                  inset 2px 2px 4px rgba(255,255,255,0.5)
                `
              }}
            >
              <h2
                className="text-lg font-extrabold mb-4"
                style={{
                  color: '#8B4513',
                  textShadow: '2px 2px 4px rgba(255,255,255,0.8)'
                }}
              >
                ⚠️ Underutilized Spaces (&lt;20%)
              </h2>
              <div className="space-y-3">
                {metrics.underutilizedSpaces.map((item) => (
                  <div
                    key={item.space.id}
                    className="flex items-center justify-between p-4 rounded-2xl"
                    style={{
                      background: 'linear-gradient(145deg, #FFEDD5, #FED7AA)',
                      boxShadow: `
                        6px 6px 12px rgba(255, 200, 150, 0.3),
                        -6px -6px 12px rgba(255, 255, 255, 0.8)
                      `
                    }}
                  >
                    <span
                      className="font-bold"
                      style={{
                        color: '#8B4513',
                        textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                      }}
                    >
                      {item.space.name}
                    </span>
                    <span
                      className="text-sm font-bold"
                      style={{
                        color: '#C2410C',
                        textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                      }}
                    >
                      {item.utilizationRate.toFixed(1)}% utilized
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {!metrics && !loading && (
        <div
          className="p-12 text-center rounded-3xl"
          style={{
            background: 'linear-gradient(145deg, #f9f9f9, #efefef)',
            boxShadow: `
              12px 12px 24px rgba(133, 196, 219, 0.4),
              -12px -12px 24px rgba(255, 255, 255, 0.9)
            `
          }}
        >
          <p
            className="font-semibold"
            style={{
              color: '#6B7280',
              textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
            }}
          >
            📊 No data available for the selected period
          </p>
        </div>
      )}
    </div>
  )
}

// Metric Card Component
function MetricCard({
  label,
  value,
  icon: Icon,
  iconColor,
  isText = false
}: {
  label: string;
  value: string | number;
  icon: any;
  iconColor: string;
  isText?: boolean;
}) {
  return (
    <div
      className="p-6 rounded-3xl transition-all duration-300"
      style={{
        background: 'linear-gradient(145deg, #f9f9f9, #efefef)',
        boxShadow: `
          12px 12px 24px rgba(133, 196, 219, 0.4),
          -12px -12px 24px rgba(255, 255, 255, 0.9),
          inset 2px 2px 4px rgba(255,255,255,0.5)
        `
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = `
          16px 16px 32px rgba(133, 196, 219, 0.5),
          -16px -16px 32px rgba(255, 255, 255, 0.95),
          inset 2px 2px 4px rgba(255,255,255,0.5)
        `;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = `
          12px 12px 24px rgba(133, 196, 219, 0.4),
          -12px -12px 24px rgba(255, 255, 255, 0.9),
          inset 2px 2px 4px rgba(255,255,255,0.5)
        `;
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p
            className="text-sm font-bold mb-2"
            style={{
              color: '#6B7280',
              textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
            }}
          >
            {label}
          </p>
          <p
            className={`${isText ? 'text-xl' : 'text-3xl'} font-extrabold`}
            style={{
              color: '#1a1a2e',
              textShadow: '2px 2px 4px rgba(255,255,255,0.8)'
            }}
          >
            {value}
          </p>
        </div>
        <Icon
          className="h-10 w-10"
          style={{
            color: iconColor,
            filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))'
          }}
        />
      </div>
    </div>
  );
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
