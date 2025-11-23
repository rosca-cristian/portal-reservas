import { X } from 'lucide-react'

interface ReservationsFiltersProps {
  filters: {
    dateFrom: string
    dateTo: string
    spaceId: string
    user: string
    status: string
  }
  onFiltersChange: (filters: any) => void
}

export default function ReservationsFilters({ filters, onFiltersChange }: ReservationsFiltersProps) {
  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const handleClearFilters = () => {
    onFiltersChange({
      dateFrom: '',
      dateTo: '',
      spaceId: '',
      user: '',
      status: '',
    })
  }

  const hasActiveFilters = Object.values(filters).some(v => v !== '')

  return (
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="dateFrom"
            className="text-sm font-bold block"
            style={{
              color: '#4A5568',
              textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
            }}
          >
            From Date
          </label>
          <input
            id="dateFrom"
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
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
            className="text-sm font-bold block"
            style={{
              color: '#4A5568',
              textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
            }}
          >
            To Date
          </label>
          <input
            id="dateTo"
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
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
            htmlFor="user"
            className="text-sm font-bold block"
            style={{
              color: '#4A5568',
              textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
            }}
          >
            User
          </label>
          <input
            id="user"
            type="text"
            placeholder="Search by name or email..."
            value={filters.user}
            onChange={(e) => handleFilterChange('user', e.target.value)}
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
            htmlFor="status"
            className="text-sm font-bold block"
            style={{
              color: '#4A5568',
              textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
            }}
          >
            Status
          </label>
          <select
            id="status"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
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
          >
            <option value="">All statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="in_progress">In Progress</option>
          </select>
        </div>

        <div className="flex items-end">
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="w-full px-4 py-3 rounded-2xl font-bold text-sm transition-all duration-300"
              style={{
                background: 'linear-gradient(145deg, #FFB6B6, #FF9999)',
                color: '#8B0000',
                textShadow: '1px 1px 2px rgba(255,255,255,0.6)',
                boxShadow: `
                  8px 8px 16px rgba(255, 150, 150, 0.4),
                  -8px -8px 16px rgba(255, 255, 255, 0.9)
                `,
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `
                  10px 10px 20px rgba(255, 150, 150, 0.5),
                  -10px -10px 20px rgba(255, 255, 255, 0.95)
                `;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `
                  8px 8px 16px rgba(255, 150, 150, 0.4),
                  -8px -8px 16px rgba(255, 255, 255, 0.9)
                `;
              }}
            >
              <X className="mr-2 h-4 w-4 inline" />
              Clear Filters
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
