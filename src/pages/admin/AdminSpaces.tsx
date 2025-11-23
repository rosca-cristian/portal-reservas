import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import { Edit, Trash2, XCircle, Plus, ArrowUpDown, ArrowUp, ArrowDown, CheckCircle } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import { SpaceFormDialog } from '@/components/admin/SpaceFormDialog'
import { MarkUnavailableDialog } from '@/components/admin/MarkUnavailableDialog'
import { FloorManager } from '@/components/admin/FloorManager'

interface Space {
  id: string
  name: string
  type: string
  capacity: number
  floor: number | { id: string; name: string; building: string } | null
  equipment: string[]
  status: 'available' | 'unavailable' | 'maintenance'
  availabilityStatus?: 'AVAILABLE' | 'OCCUPIED' | 'UNAVAILABLE'
}

type SortField = 'name' | 'type' | 'capacity' | 'floor' | 'status'
type SortDirection = 'asc' | 'desc'

export default function AdminSpaces() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isFloorManagerOpen, setIsFloorManagerOpen] = useState(false)
  const [editingSpace, setEditingSpace] = useState<Space | null>(null)
  const [unavailableSpace, setUnavailableSpace] = useState<Space | null>(null)
  const itemsPerPage = 50
  const queryClient = useQueryClient()

  const debouncedSearch = useDebounce(searchQuery, 300)

  const { data: spaces = [], isLoading, error } = useQuery<Space[]>({
    queryKey: ['admin-spaces'],
    queryFn: async () => {
      const response = await apiClient.get('/api/admin/spaces')
      return response.data.data || response.data
    }
  })

  const markAvailableMutation = useMutation({
    mutationFn: async (spaceId: string) => {
      const response = await apiClient.delete(`/api/admin/spaces/${spaceId}/unavailability`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-spaces'] })
      alert('Space marked as available')
    },
    onError: (error: any) => {
      alert(`Error: ${error.response?.data?.message || 'Failed to mark space available'}`)
    }
  })

  const handleMarkAvailable = (space: Space) => {
    if (confirm(`Mark "${space.name}" as available again?`)) {
      markAvailableMutation.mutate(space.id)
    }
  }

  // Filter spaces based on search
  const filteredSpaces = useMemo(() => {
    // Ensure spaces is always an array
    if (!Array.isArray(spaces)) return []
    if (!debouncedSearch) return spaces

    const query = debouncedSearch.toLowerCase()
    return spaces.filter(space =>
      space.name.toLowerCase().includes(query) ||
      space.type.toLowerCase().includes(query) ||
      space.equipment.some(eq => eq.toLowerCase().includes(query))
    )
  }, [spaces, debouncedSearch])

  // Sort spaces
  const sortedSpaces = useMemo(() => {
    const sorted = [...filteredSpaces].sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]

      // Special handling for floor object
      if (sortField === 'floor') {
        aValue = typeof a.floor === 'object' && a.floor ? a.floor.name || '' : String(a.floor || '')
        bValue = typeof b.floor === 'object' && b.floor ? b.floor.name || '' : String(b.floor || '')
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
      }

      return 0
    })

    return sorted
  }, [filteredSpaces, sortField, sortDirection])

  // Paginate spaces
  const paginatedSpaces = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return sortedSpaces.slice(startIndex, startIndex + itemsPerPage)
  }, [sortedSpaces, currentPage])

  const totalPages = Math.ceil(sortedSpaces.length / itemsPerPage)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 ml-1 inline" />
    return sortDirection === 'asc'
      ? <ArrowUp className="w-4 h-4 ml-1 inline" />
      : <ArrowDown className="w-4 h-4 ml-1 inline" />
  }

  const getStatusBadge = (status?: string) => {
    const statusLower = status?.toLowerCase() || 'available'
    const statusStyles: Record<string, { background: string; color: string }> = {
      available: {
        background: 'linear-gradient(145deg, #8BDBDB, #6FB8B8)',
        color: 'white'
      },
      occupied: {
        background: 'linear-gradient(145deg, #D4E6FF, #B3D4FF)',
        color: '#1a5490'
      },
      unavailable: {
        background: 'linear-gradient(145deg, #FFB6B6, #FF9999)',
        color: '#8B0000'
      },
      maintenance: {
        background: 'linear-gradient(145deg, #FFE5B4, #FFD700)',
        color: '#8B4513'
      }
    }

    const displayStatus = status || 'Available'
    const style = statusStyles[statusLower] || statusStyles.available

    return (
      <span
        className="px-2 py-1 rounded-full text-xs font-bold"
        style={{
          ...style,
          textShadow: statusLower === 'available'
            ? '1px 1px 2px rgba(0,0,0,0.2)'
            : '1px 1px 2px rgba(255,255,255,0.6)',
          boxShadow: `
            4px 4px 8px rgba(133, 196, 219, 0.3),
            -4px -4px 8px rgba(255, 255, 255, 0.8)
          `
        }}
      >
        {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1).toLowerCase()}
      </span>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div
          className="p-6 rounded-3xl"
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
          <strong>⚠️ Error:</strong> Failed to load spaces. Please try again.
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1
            className="text-4xl font-extrabold mb-2"
            style={{
              color: '#1a1a2e',
              textShadow: '2px 2px 4px rgba(255,255,255,0.8)'
            }}
          >
            🏢 Spaces Management
          </h1>
          <p
            className="font-semibold"
            style={{
              color: '#4A5568',
              textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
            }}
          >
            Manage all spaces in the system
          </p>
        </div>
        <div className="flex gap-3">
          <ClayButton onClick={() => setIsAddDialogOpen(true)} variant="primary">
            <Plus className="w-5 h-5 inline mr-2" />
            Add Space
          </ClayButton>
          <ClayButton onClick={() => setIsFloorManagerOpen(true)} variant="secondary">
            <ArrowUpDown className="w-5 h-5 inline mr-2" />
            Manage Floors
          </ClayButton>
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Search spaces by name, type, or equipment..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-6 py-4 rounded-2xl font-semibold text-sm transition-all duration-300"
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
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = `
              inset 6px 6px 12px rgba(133, 196, 219, 0.3),
              inset -6px -6px 12px rgba(255, 255, 255, 0.95)
            `;
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = `
              inset 4px 4px 8px rgba(133, 196, 219, 0.2),
              inset -4px -4px 8px rgba(255, 255, 255, 0.9)
            `;
          }}
        />
        {debouncedSearch && (
          <p
            className="text-sm font-semibold mt-2"
            style={{
              color: '#4A5568',
              textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
            }}
          >
            Found {filteredSpaces.length} space{filteredSpaces.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Table */}
      {isLoading ? (
        <div
          className="p-8 rounded-3xl text-center"
          style={{
            background: 'linear-gradient(145deg, #f9f9f9, #efefef)',
            boxShadow: `
              12px 12px 24px rgba(133, 196, 219, 0.4),
              -12px -12px 24px rgba(255, 255, 255, 0.9)
            `
          }}
        >
          <div
            className="animate-spin w-8 h-8 rounded-full mx-auto"
            style={{
              border: '3px solid transparent',
              borderTop: '3px solid #8BDBDB',
              borderRight: '3px solid #8BDBDB'
            }}
          />
          <p
            className="mt-4 font-semibold"
            style={{
              color: '#4A5568',
              textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
            }}
          >
            Loading spaces...
          </p>
        </div>
      ) : (
        <>
          <div
            className="rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #f9f9f9, #efefef)',
              boxShadow: `
                12px 12px 24px rgba(133, 196, 219, 0.4),
                -12px -12px 24px rgba(255, 255, 255, 0.9),
                inset 2px 2px 4px rgba(255,255,255,0.5)
              `
            }}
          >
            <table className="w-full">
              <thead
                style={{
                  background: 'linear-gradient(145deg, #e8e8e8, #d8d8d8)',
                  borderBottom: '1px solid rgba(133, 196, 219, 0.2)'
                }}
              >
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-extrabold uppercase tracking-wider cursor-pointer transition-all duration-200"
                    style={{
                      color: '#1a1a2e',
                      textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                    }}
                    onClick={() => handleSort('name')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(139, 219, 219, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    Name {getSortIcon('name')}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('type')}
                  >
                    Type {getSortIcon('type')}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('capacity')}
                  >
                    Capacity {getSortIcon('capacity')}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('floor')}
                  >
                    Floor {getSortIcon('floor')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Equipment
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('status')}
                  >
                    Status {getSortIcon('status')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedSpaces.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      {debouncedSearch ? 'No spaces found matching your search' : 'No spaces available'}
                    </td>
                  </tr>
                ) : (
                  paginatedSpaces.map((space) => (
                    <tr key={space.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{space.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{space.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{space.capacity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {typeof space.floor === 'object' && space.floor
                          ? `${space.floor.name} - ${space.floor.building}`
                          : `Floor ${space.floor}`}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {space.equipment.slice(0, 3).map((eq) => (
                            <span key={eq} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                              {eq}
                            </span>
                          ))}
                          {space.equipment.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                              +{space.equipment.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(space.availabilityStatus)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                            title="Edit space"
                            onClick={() => setEditingSpace(space)}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {space.availabilityStatus?.toUpperCase() === 'UNAVAILABLE' ? (
                            <button
                              className="p-2 text-green-600 hover:bg-green-50 rounded transition"
                              title="Mark available"
                              onClick={() => handleMarkAvailable(space)}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              className="p-2 text-yellow-600 hover:bg-yellow-50 rounded transition"
                              title="Mark unavailable"
                              onClick={() => setUnavailableSpace(space)}
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                            title="Delete space"
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${space.name}?`)) {
                                alert('Delete functionality - Future story')
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, sortedSpaces.length)} of {sortedSpaces.length} spaces
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-4 py-2 border border-gray-300 rounded-lg bg-blue-50">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Create dialog */}
      <SpaceFormDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        mode="create"
      />

      {/* Edit dialog */}
      <SpaceFormDialog
        isOpen={!!editingSpace}
        onClose={() => setEditingSpace(null)}
        mode="edit"
        initialData={editingSpace}
      />

      {/* Mark Unavailable dialog */}
      <MarkUnavailableDialog
        isOpen={!!unavailableSpace}
        onClose={() => setUnavailableSpace(null)}
        space={unavailableSpace}
      />

      {/* Floor Manager */}
      <FloorManager
        isOpen={isFloorManagerOpen}
        onClose={() => setIsFloorManagerOpen(false)}
      />
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
