import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import { Plus, Edit, Map as MapIcon, X } from 'lucide-react'
import { FloorPlanEditor } from './FloorPlanEditor'
import type { Floor, Space } from '@/types/space'

export function FloorManager({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [selectedFloorId, setSelectedFloorId] = useState<string | null>(null)
    const [isEditorOpen, setIsEditorOpen] = useState(false)
    const queryClient = useQueryClient()

    const { data: floors = [] } = useQuery<Floor[]>({
        queryKey: ['floors'],
        queryFn: async () => {
            const response = await apiClient.get('/api/admin/floors')
            return response.data.data || response.data
        },
        enabled: isOpen
    })

    const { data: spaces = [] } = useQuery<Space[]>({
        queryKey: ['admin-spaces'],
        queryFn: async () => {
            const response = await apiClient.get('/api/admin/spaces')
            return response.data.data || response.data
        },
        enabled: isOpen
    })

    const createFloorMutation = useMutation({
        mutationFn: async () => {
            const name = prompt('Enter floor name:', `Floor ${floors.length + 1}`)
            if (!name) throw new Error('Floor name is required')

            const newFloor = {
                name,
                svgPath: '',
                building: 'Main Building'
            }
            const response = await apiClient.post('/api/admin/floors', newFloor)
            return response.data.data || response.data
        },
        onSuccess: (newFloor) => {
            queryClient.invalidateQueries({ queryKey: ['floors'] })
            if (newFloor && newFloor.id) {
                setSelectedFloorId(newFloor.id)
                setIsEditorOpen(true)
            }
        }
    })

    const handleEditFloor = (floorId: string) => {
        setSelectedFloorId(floorId)
        setIsEditorOpen(true)
    }

    if (!isOpen) return null

    const selectedFloor = floors.find(f => f.id === selectedFloorId)
    const floorSpaces = spaces.filter(s => s.floorId === selectedFloorId)

    return (
        <>
            <div
                className="fixed inset-0 flex items-center justify-center z-40"
                style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(4px)'
                }}
                onClick={onClose}
            >
                <div
                    className="max-w-2xl w-full max-h-[80vh] flex flex-col rounded-3xl"
                    style={{
                        background: 'linear-gradient(145deg, #f9f9f9, #efefef)',
                        boxShadow: `
                            20px 20px 40px rgba(133, 196, 219, 0.5),
                            -20px -20px 40px rgba(255, 255, 255, 0.95)
                        `
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div
                        className="p-6 flex justify-between items-center"
                        style={{
                            borderBottom: '1px solid rgba(133, 196, 219, 0.2)'
                        }}
                    >
                        <h2
                            className="text-2xl font-extrabold"
                            style={{
                                color: '#1a1a2e',
                                textShadow: '2px 2px 4px rgba(255,255,255,0.8)'
                            }}
                        >
                            🏢 Manage Floors
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl transition-all duration-200"
                            style={{
                                background: 'linear-gradient(145deg, #FFB6B6, #FF9999)',
                                color: '#8B0000',
                                boxShadow: `
                                    4px 4px 8px rgba(255, 150, 150, 0.3),
                                    -4px -4px 8px rgba(255, 255, 255, 0.8)
                                `,
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                                e.currentTarget.style.boxShadow = `
                                    6px 6px 12px rgba(255, 150, 150, 0.4),
                                    -6px -6px 12px rgba(255, 255, 255, 0.9)
                                `;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = `
                                    4px 4px 8px rgba(255, 150, 150, 0.3),
                                    -4px -4px 8px rgba(255, 255, 255, 0.8)
                                `;
                            }}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto flex-1">
                        <div className="grid gap-4">
                            {floors.map(floor => (
                                <div
                                    key={floor.id}
                                    className="flex items-center justify-between p-5 rounded-3xl transition-all duration-200"
                                    style={{
                                        background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
                                        boxShadow: `
                                            8px 8px 16px rgba(133, 196, 219, 0.3),
                                            -8px -8px 16px rgba(255, 255, 255, 0.9),
                                            inset 2px 2px 4px rgba(255,255,255,0.5)
                                        `
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = `
                                            10px 10px 20px rgba(133, 196, 219, 0.4),
                                            -10px -10px 20px rgba(255, 255, 255, 0.95),
                                            inset 2px 2px 4px rgba(255,255,255,0.5)
                                        `;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = `
                                            8px 8px 16px rgba(133, 196, 219, 0.3),
                                            -8px -8px 16px rgba(255, 255, 255, 0.9),
                                            inset 2px 2px 4px rgba(255,255,255,0.5)
                                        `;
                                    }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-12 h-12 rounded-2xl flex items-center justify-center"
                                            style={{
                                                background: 'linear-gradient(145deg, #8BDBDB, #6FB8B8)',
                                                boxShadow: `
                                                    6px 6px 12px rgba(139, 219, 219, 0.4),
                                                    -6px -6px 12px rgba(255, 255, 255, 0.8),
                                                    inset 2px 2px 4px rgba(255,255,255,0.3)
                                                `,
                                                color: 'white'
                                            }}
                                        >
                                            <MapIcon className="w-6 h-6" style={{ filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.2))' }} />
                                        </div>
                                        <div>
                                            <h3
                                                className="font-extrabold text-lg"
                                                style={{
                                                    color: '#1a1a2e',
                                                    textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                                                }}
                                            >
                                                {floor.name}
                                            </h3>
                                            <p
                                                className="text-sm font-semibold"
                                                style={{
                                                    color: '#6B7280',
                                                    textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                                                }}
                                            >
                                                {spaces.filter(s => s.floorId === floor.id).length} spaces
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleEditFloor(floor.id)}
                                        className="px-4 py-2 rounded-2xl flex items-center gap-2 font-bold text-sm transition-all duration-200"
                                        style={{
                                            background: 'linear-gradient(145deg, #F0F9FF, #D4E6FF)',
                                            color: '#1a5490',
                                            textShadow: '1px 1px 2px rgba(255,255,255,0.6)',
                                            boxShadow: `
                                                6px 6px 12px rgba(133, 196, 219, 0.3),
                                                -6px -6px 12px rgba(255, 255, 255, 0.8)
                                            `,
                                            cursor: 'pointer'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = `
                                                8px 8px 16px rgba(133, 196, 219, 0.4),
                                                -8px -8px 16px rgba(255, 255, 255, 0.9)
                                            `;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = `
                                                6px 6px 12px rgba(133, 196, 219, 0.3),
                                                -6px -6px 12px rgba(255, 255, 255, 0.8)
                                            `;
                                        }}
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit Plan
                                    </button>
                                </div>
                            ))}

                            {/* Add New Floor Button */}
                            <button
                                onClick={() => createFloorMutation.mutate()}
                                className="flex items-center justify-center gap-2 p-5 rounded-3xl font-bold transition-all duration-200"
                                style={{
                                    background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
                                    border: '2px dashed rgba(133, 196, 219, 0.4)',
                                    color: '#6B7280',
                                    textShadow: '1px 1px 2px rgba(255,255,255,0.6)',
                                    boxShadow: `
                                        8px 8px 16px rgba(133, 196, 219, 0.2),
                                        -8px -8px 16px rgba(255, 255, 255, 0.9)
                                    `,
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = '#1a1a2e';
                                    e.currentTarget.style.borderColor = 'rgba(139, 219, 219, 0.6)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = `
                                        10px 10px 20px rgba(133, 196, 219, 0.3),
                                        -10px -10px 20px rgba(255, 255, 255, 0.95)
                                    `;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = '#6B7280';
                                    e.currentTarget.style.borderColor = 'rgba(133, 196, 219, 0.4)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = `
                                        8px 8px 16px rgba(133, 196, 219, 0.2),
                                        -8px -8px 16px rgba(255, 255, 255, 0.9)
                                    `;
                                }}
                            >
                                <Plus className="w-5 h-5" />
                                Add New Floor
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isEditorOpen && selectedFloorId && (
                <FloorPlanEditor
                    isOpen={isEditorOpen}
                    onClose={() => setIsEditorOpen(false)}
                    floorId={selectedFloorId}
                    initialFloor={selectedFloor}
                    initialSpaces={floorSpaces}
                />
            )}
        </>
    )
}
