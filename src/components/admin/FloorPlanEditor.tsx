import { useState, useRef, useEffect } from 'react'
import { X, Save, MousePointer, Trash2, Monitor, Armchair, LayoutGrid } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import type { Space, Floor } from '@/types/space'

interface FloorPlanEditorProps {
  isOpen: boolean
  onClose: () => void
  floorId: string
  initialFloor?: Floor
  initialSpaces?: Space[]
}

type ToolType = 'pointer' | 'seat' | 'table'

interface ToolSettings {
  orientation: 'horizontal' | 'vertical'
  chairs: number
  hasComputer: boolean
}

export function FloorPlanEditor({ isOpen, onClose, floorId, initialFloor, initialSpaces = [] }: FloorPlanEditorProps) {
  const [spaces, setSpaces] = useState<Space[]>(initialSpaces)
  const [floor, setFloor] = useState<Floor | undefined>(initialFloor)
  const [selectedTool, setSelectedTool] = useState<ToolType>('pointer')
  const [toolSettings, setToolSettings] = useState<ToolSettings>({
    orientation: 'vertical',
    chairs: 4,
    hasComputer: false
  })
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const svgRef = useRef<SVGSVGElement>(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    setSpaces(initialSpaces)
  }, [initialSpaces])

  useEffect(() => {
    setFloor(initialFloor)
  }, [initialFloor])

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (floor) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, createdAt, updatedAt, ...floorData } = floor as any
        await apiClient.patch(`/api/admin/floors/${floorId}`, floorData)
      }

      // Separate new spaces from existing ones
      const existingSpaces = spaces.filter(s => !s.id.startsWith('temp-') && initialSpaces.some(is => is.id === s.id))
      const newSpaces = spaces.filter(s => s.id.startsWith('temp-') || !initialSpaces.some(is => is.id === s.id))

      // Create new spaces
      await Promise.all(newSpaces.map(space => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, createdAt, updatedAt, ...spaceData } = space as any
        return apiClient.post('/api/admin/spaces', spaceData)
      }))

      // Update existing spaces
      await Promise.all(existingSpaces.map(space => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, createdAt, updatedAt, ...spaceData } = space as any
        return apiClient.patch(`/api/admin/spaces/${space.id}`, spaceData)
      }))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-spaces'] })
      queryClient.invalidateQueries({ queryKey: ['floor', floorId] })
      alert('Floor plan saved successfully!')
    },
    onError: (error: any) => {
      console.error('Save failed:', error)
      alert(`Failed to save floor plan: ${error.response?.data?.message || error.message}`)
    }
  })

  const handleMouseDown = (e: React.MouseEvent, spaceId: string) => {
    if (selectedTool !== 'pointer') return
    e.stopPropagation()
    setSelectedSpaceId(spaceId)
    setIsDragging(true)

    const svg = svgRef.current
    if (!svg) return

    const pt = svg.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse())

    const space = spaces.find(s => s.id === spaceId)
    if (space && space.coordinates?.boundingBox) {
      setDragOffset({
        x: svgP.x - space.coordinates.boundingBox.x,
        y: svgP.y - space.coordinates.boundingBox.y
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedSpaceId) return

    const svg = svgRef.current
    if (!svg) return

    const pt = svg.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse())

    setSpaces(prev => prev.map(s => {
      if (s.id === selectedSpaceId && s.coordinates?.boundingBox) {
        return {
          ...s,
          coordinates: {
            ...s.coordinates,
            boundingBox: {
              ...s.coordinates.boundingBox,
              x: svgP.x - dragOffset.x,
              y: svgP.y - dragOffset.y
            }
          }
        }
      }
      return s
    }))
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (selectedTool === 'pointer') {
      setSelectedSpaceId(null)
      return
    }

    const svg = svgRef.current
    if (!svg) return

    const pt = svg.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse())

    const isVertical = toolSettings.orientation === 'vertical'
    let width = 60
    let height = 60
    let type: any = 'desk'

    if (selectedTool === 'seat') {
      width = isVertical ? 40 : 60
      height = isVertical ? 60 : 40
      type = 'desk'
    } else if (selectedTool === 'table') {
      width = isVertical ? 100 : 160
      height = isVertical ? 160 : 100
      type = 'group-room'
    }

    const newSpace: Space = {
      id: `temp-${Date.now()}`,
      name: `New ${selectedTool === 'seat' ? 'Seat' : 'Table'} ${spaces.length + 1}`,
      type,
      capacity: selectedTool === 'table' ? toolSettings.chairs : 1,
      minCapacity: 1,
      description: selectedTool === 'table' ? 'Group study table' : 'Individual desk',
      floorId: floorId,
      equipment: toolSettings.hasComputer ? ['Computer'] : [],
      coordinates: {
        svgPathId: `space-${Date.now()}`,
        boundingBox: {
          x: svgP.x - width / 2,
          y: svgP.y - height / 2,
          width,
          height
        },
        rotation: 0,
        config: {
          chairs: selectedTool === 'table' ? toolSettings.chairs : 0,
          chairsPosition: toolSettings.orientation,
          hasComputer: toolSettings.hasComputer
        }
      }
    }

    setSpaces([...spaces, newSpace])
    setSelectedSpaceId(newSpace.id)
    setSelectedTool('pointer')
  }

  const handleDeleteSpace = (id: string) => {
    if (confirm('Are you sure you want to delete this space?')) {
      setSpaces(spaces.filter(s => s.id !== id))
      setSelectedSpaceId(null)
    }
  }

  const renderChairs = (space: Space) => {
    if (!space.coordinates?.config?.chairs || space.coordinates.config.chairs <= 0) return null

    const { width, height } = space.coordinates.boundingBox!
    const count = space.coordinates.config.chairs
    const isVertical = space.coordinates.config.chairsPosition === 'vertical'

    const chairs = []
    const chairSize = 12

    // Simple distribution logic
    if (isVertical) {
      // Chairs on left and right
      const sideCount = Math.ceil(count / 2)
      const spacing = height / (sideCount + 1)

      for (let i = 0; i < count; i++) {
        const isRight = i >= sideCount
        const index = isRight ? i - sideCount : i
        const cx = isRight ? width + 5 : -5 - chairSize
        const cy = (index + 1) * spacing - chairSize / 2

        chairs.push(
          <rect
            key={`chair-${i}`}
            x={cx}
            y={cy}
            width={chairSize}
            height={chairSize}
            rx={4}
            fill="#94a3b8"
          />
        )
      }
    } else {
      // Chairs on top and bottom
      const sideCount = Math.ceil(count / 2)
      const spacing = width / (sideCount + 1)

      for (let i = 0; i < count; i++) {
        const isBottom = i >= sideCount
        const index = isBottom ? i - sideCount : i
        const cx = (index + 1) * spacing - chairSize / 2
        const cy = isBottom ? height + 5 : -5 - chairSize

        chairs.push(
          <rect
            key={`chair-${i}`}
            x={cx}
            y={cy}
            width={chairSize}
            height={chairSize}
            rx={4}
            fill="#94a3b8"
          />
        )
      }
    }

    return <g>{chairs}</g>
  }

  if (!isOpen) return null

  const selectedSpace = spaces.find(s => s.id === selectedSpaceId)

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white w-full h-full flex flex-col">
        {/* Toolbar */}
        <div className="h-16 border-b px-6 flex items-center justify-between bg-white shadow-sm z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold">Floor Plan Editor</h2>
            {floor?.name && (
              <>
                <div className="h-8 w-px bg-gray-200" />
                <span className="text-sm text-gray-600 font-medium">{floor.name}</span>
              </>
            )}
            <div className="h-8 w-px bg-gray-200" />

            {/* Tools */}
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setSelectedTool('pointer')}
                className={`p-2 rounded flex items-center gap-2 ${selectedTool === 'pointer' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:bg-gray-200'}`}
                title="Select & Move"
              >
                <MousePointer className="w-4 h-4" />
                <span className="text-sm font-medium">Select</span>
              </button>
              <button
                onClick={() => setSelectedTool('seat')}
                className={`p-2 rounded flex items-center gap-2 ${selectedTool === 'seat' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:bg-gray-200'}`}
                title="Add Seat"
              >
                <Armchair className="w-4 h-4" />
                <span className="text-sm font-medium">Seat</span>
              </button>
              <button
                onClick={() => setSelectedTool('table')}
                className={`p-2 rounded flex items-center gap-2 ${selectedTool === 'table' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:bg-gray-200'}`}
                title="Add Table"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="text-sm font-medium">Table</span>
              </button>
            </div>

            {/* Tool Settings */}
            {selectedTool !== 'pointer' && (
              <>
                <div className="h-8 w-px bg-gray-200" />
                <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-4 duration-200">
                  <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border">
                    <button
                      onClick={() => setToolSettings(s => ({ ...s, orientation: 'horizontal' }))}
                      className={`px-3 py-1 rounded text-sm ${toolSettings.orientation === 'horizontal' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
                    >
                      Horizontal
                    </button>
                    <button
                      onClick={() => setToolSettings(s => ({ ...s, orientation: 'vertical' }))}
                      className={`px-3 py-1 rounded text-sm ${toolSettings.orientation === 'vertical' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
                    >
                      Vertical
                    </button>
                  </div>

                  {selectedTool === 'table' && (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Chairs:</span>
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={toolSettings.chairs}
                          onChange={(e) => setToolSettings(s => ({ ...s, chairs: parseInt(e.target.value) || 0 }))}
                          className="w-16 px-2 py-1 border rounded text-sm"
                        />
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={toolSettings.hasComputer}
                          onChange={(e) => setToolSettings(s => ({ ...s, hasComputer: e.target.checked }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">Computer</span>
                      </label>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition shadow-sm hover:shadow"
            >
              <Save className="w-4 h-4" />
              {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Canvas Area */}
          <div className="flex-1 bg-gray-50 overflow-auto p-8 flex items-center justify-center cursor-crosshair">
            <div className="bg-white shadow-xl relative transition-all duration-300" style={{
              width: floor?.dimensions?.width || 1000,
              height: floor?.dimensions?.height || 1000
            }}>
              <svg
                ref={svgRef}
                width={floor?.dimensions?.width || 1000}
                height={floor?.dimensions?.height || 1000}
                viewBox={`0 0 ${floor?.dimensions?.width || 1000} ${floor?.dimensions?.height || 1000}`}
                className="block"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onClick={handleBackgroundClick}
              >
                {/* Grid Background */}
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Spaces */}
                {spaces.map(space => {
                  const { x, y, width, height } = space.coordinates?.boundingBox || { x: 0, y: 0, width: 60, height: 60 }
                  const isSelected = selectedSpaceId === space.id
                  const hasComputer = space.coordinates?.config?.hasComputer || space.equipment.includes('Computer')

                  return (
                    <g
                      key={space.id}
                      transform={`translate(${x}, ${y})`}
                      onMouseDown={(e) => handleMouseDown(e, space.id)}
                      className="cursor-move"
                      style={{ opacity: isDragging && isSelected ? 0.8 : 1 }}
                      pointerEvents="all"
                    >
                      {/* Selection Halo */}
                      {isSelected && (
                        <rect
                          x={-4} y={-4}
                          width={width + 8}
                          height={height + 8}
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="2"
                          rx="6"
                          strokeDasharray="4 4"
                          className="animate-pulse"
                        />
                      )}

                      {/* Main Shape */}
                      <rect
                        width={width}
                        height={height}
                        fill={isSelected ? '#eff6ff' : '#fff'}
                        stroke={isSelected ? '#3b82f6' : '#94a3b8'}
                        strokeWidth={isSelected ? 2 : 1.5}
                        rx="4"
                        className="transition-colors duration-200"
                        style={{ filter: 'drop-shadow(0 2px 4px rgb(0 0 0 / 0.05))' }}
                      />

                      {/* Chairs */}
                      {renderChairs(space)}

                      {/* Computer Icon */}
                      {hasComputer && (
                        <g transform={`translate(${width / 2 - 8}, ${height / 2 - 8})`}>
                          <Monitor className="w-4 h-4 text-gray-400" />
                        </g>
                      )}

                      {/* Label */}
                      {!hasComputer && (
                        <text
                          x={width / 2}
                          y={height / 2}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize="11"
                          fill={isSelected ? '#1e40af' : '#64748b'}
                          className="pointer-events-none select-none font-medium"
                        >
                          {space.name.replace('Table ', 'T').replace('Seat ', 'S')}
                        </text>
                      )}
                    </g>
                  )
                })}
              </svg>
            </div>
          </div>

          {/* Properties Sidebar */}
          <div className="w-80 bg-white border-l flex flex-col shadow-lg z-20">
            <div className="p-6 border-b bg-gray-50">
              <h3 className="font-bold text-lg text-gray-800">Properties</h3>
              <p className="text-sm text-gray-500">Edit selected space details</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {selectedSpace ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Name</label>
                    <input
                      type="text"
                      value={selectedSpace.name}
                      onChange={(e) => setSpaces(spaces.map(s => s.id === selectedSpace.id ? { ...s, name: e.target.value } : s))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Type</label>
                    <select
                      value={selectedSpace.type === 'group-room' ? 'Group Room' : selectedSpace.type === 'desk' ? 'Individual Desk' : selectedSpace.type}
                      onChange={(e) => {
                        const displayValue = e.target.value;
                        const backendValue = displayValue === 'Group Room' ? 'group-room' : displayValue === 'Individual Desk' ? 'desk' : displayValue;
                        setSpaces(spaces.map(s => s.id === selectedSpace.id ? { ...s, type: backendValue as any } : s))
                      }}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 focus:bg-white transition-all"
                    >
                      <option value="Individual Desk">Individual Desk</option>
                      <option value="Group Room">Group Room</option>
                      <option value="Conference Room">Conference Room</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Width</label>
                      <input
                        type="number"
                        value={selectedSpace.coordinates?.boundingBox?.width}
                        onChange={(e) => setSpaces(spaces.map(s => s.id === selectedSpace.id ? {
                          ...s,
                          coordinates: {
                            ...s.coordinates!,
                            boundingBox: { ...s.coordinates!.boundingBox!, width: Number(e.target.value) }
                          }
                        } : s))}
                        className="w-full px-3 py-2 border rounded-lg outline-none bg-gray-50 focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Height</label>
                      <input
                        type="number"
                        value={selectedSpace.coordinates?.boundingBox?.height}
                        onChange={(e) => setSpaces(spaces.map(s => s.id === selectedSpace.id ? {
                          ...s,
                          coordinates: {
                            ...s.coordinates!,
                            boundingBox: { ...s.coordinates!.boundingBox!, height: Number(e.target.value) }
                          }
                        } : s))}
                        className="w-full px-3 py-2 border rounded-lg outline-none bg-gray-50 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Configuration</label>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Chairs</span>
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={selectedSpace.coordinates?.config?.chairs || 0}
                          onChange={(e) => setSpaces(spaces.map(s => s.id === selectedSpace.id ? {
                            ...s,
                            coordinates: {
                              ...s.coordinates!,
                              config: { ...s.coordinates!.config, chairs: parseInt(e.target.value) || 0 }
                            }
                          } : s))}
                          className="w-20 px-2 py-1 border rounded text-sm bg-gray-50"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Arrangement</span>
                        <select
                          value={selectedSpace.coordinates?.config?.chairsPosition || 'horizontal'}
                          onChange={(e) => setSpaces(spaces.map(s => s.id === selectedSpace.id ? {
                            ...s,
                            coordinates: {
                              ...s.coordinates!,
                              config: { ...s.coordinates!.config, chairsPosition: e.target.value as any }
                            }
                          } : s))}
                          className="w-32 px-2 py-1 border rounded text-sm bg-gray-50"
                        >
                          <option value="horizontal">Horizontal</option>
                          <option value="vertical">Vertical</option>
                        </select>
                      </div>

                      <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedSpace.coordinates?.config?.hasComputer || false}
                          onChange={(e) => setSpaces(spaces.map(s => s.id === selectedSpace.id ? {
                            ...s,
                            coordinates: {
                              ...s.coordinates!,
                              config: { ...s.coordinates!.config, hasComputer: e.target.checked }
                            }
                          } : s))}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Has Computer</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-6 border-t mt-auto">
                    <button
                      onClick={() => handleDeleteSpace(selectedSpace.id)}
                      className="w-full px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 flex items-center justify-center gap-2 font-medium transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Space
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 p-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <MousePointer className="w-8 h-8 opacity-50" />
                  </div>
                  <h4 className="text-gray-900 font-medium mb-1">No Selection</h4>
                  <p className="text-sm">Select a space on the floor plan to edit its properties</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
