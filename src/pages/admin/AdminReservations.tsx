import { useState, useEffect } from 'react'
import { Download } from 'lucide-react'
import ReservationsTable from '@/components/admin/ReservationsTable'
import ReservationsFilters from '@/components/admin/ReservationsFilters'
import { exportToCSV } from '@/utils/exportToCSV'
import { apiClient } from '@/lib/api/client'
import type { AdminReservation } from '@/types/reservation'

export default function AdminReservations() {
  const [filteredReservations, setFilteredReservations] = useState<AdminReservation[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    spaceId: '',
    user: '',
    status: '',
  })

  useEffect(() => {
    fetchReservations()
  }, [filters])

  const fetchReservations = async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = {}

      if (filters.dateFrom) params.dateFrom = filters.dateFrom
      if (filters.dateTo) params.dateTo = filters.dateTo
      if (filters.spaceId) params.spaceId = filters.spaceId
      if (filters.user) params.user = filters.user
      if (filters.status) params.status = filters.status

      const response = await apiClient.get('/api/admin/reservations', { params })

      setFilteredReservations(response.data.data || [])
    } catch (error) {
      console.error('Error fetching reservations:', error)
      setFilteredReservations([])
    } finally {
      setLoading(false)
    }
  }

  const handleExportCSV = () => {
    const csvData = filteredReservations.map(res => ({
      'Reservation ID': res.id,
      'User': res.userName,
      'Email': res.userEmail,
      'Space': res.spaceName,
      'Type': res.type,
      'Date': new Date(res.startTime).toLocaleDateString(),
      'Start Time': new Date(res.startTime).toLocaleTimeString(),
      'End Time': new Date(res.endTime).toLocaleTimeString(),
      'Status': res.status,
      'Created At': new Date(res.createdAt).toLocaleString(),
    }))

    exportToCSV(csvData, `reservations-${new Date().toISOString().split('T')[0]}.csv`)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1
            className="text-3xl font-extrabold"
            style={{
              color: '#1a1a2e',
              textShadow: '2px 2px 4px rgba(255,255,255,0.8)'
            }}
          >
            📅 Manage Reservations
          </h1>
          <p
            className="font-semibold mt-1"
            style={{
              color: '#4A5568',
              textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
            }}
          >
            View and manage all reservations across the system
          </p>
        </div>
        <ClayButton
          onClick={handleExportCSV}
          variant="secondary"
          disabled={filteredReservations.length === 0}
        >
          <Download className="mr-2 h-4 w-4 inline" />
          Export to CSV
        </ClayButton>
      </div>

      <ReservationsFilters
        filters={filters}
        onFiltersChange={setFilters}
      />

      <ReservationsTable
        reservations={filteredReservations}
        loading={loading}
        onRefresh={fetchReservations}
      />
    </div>
  )
}

// Clay Button Component
function ClayButton({
  onClick,
  children,
  variant = 'primary',
  disabled = false
}: {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
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
      disabled={disabled}
      className="px-5 py-2.5 rounded-2xl font-bold text-sm transition-all duration-300"
      style={{
        ...variantStyles,
        textShadow: variant === 'primary' ? '1px 1px 2px rgba(0,0,0,0.2)' : '1px 1px 2px rgba(255,255,255,0.6)',
        boxShadow: `
          8px 8px 16px rgba(133, 196, 219, 0.4),
          -8px -8px 16px rgba(255, 255, 255, 0.9)
        `,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = `
            12px 12px 24px rgba(133, 196, 219, 0.5),
            -12px -12px 24px rgba(255, 255, 255, 0.95),
            inset 2px 2px 4px rgba(255,255,255,0.4)
          `;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = `
            8px 8px 16px rgba(133, 196, 219, 0.4),
            -8px -8px 16px rgba(255, 255, 255, 0.9)
          `;
        }
      }}
      onMouseDown={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = `
            inset 4px 4px 8px rgba(0,0,0,0.15),
            inset -4px -4px 8px rgba(255,255,255,0.3)
          `;
        }
      }}
      onMouseUp={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = `
            12px 12px 24px rgba(133, 196, 219, 0.5),
            -12px -12px 24px rgba(255, 255, 255, 0.95),
            inset 2px 2px 4px rgba(255,255,255,0.4)
          `;
        }
      }}
    >
      {children}
    </button>
  );
}
