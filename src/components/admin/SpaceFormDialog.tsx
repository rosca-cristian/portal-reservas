import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import { X, Upload, Eye } from 'lucide-react'
import { spaceSchema, EQUIPMENT_OPTIONS } from '@/schemas/spaceSchema'
import type { SpaceFormData } from '@/schemas/spaceSchema'
import { PreviewBanner } from './PreviewBanner'

interface Floor {
  id: string
  name: string
  building: string
}

interface SpaceFormDialogProps {
  isOpen: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  initialData?: any
}

export function SpaceFormDialog({ isOpen, onClose, mode, initialData }: SpaceFormDialogProps) {
  const [photos, setPhotos] = useState<string[]>(initialData?.photos || [])
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const queryClient = useQueryClient()

  // Fetch floors
  const { data: floorsData } = useQuery({
    queryKey: ['floors'],
    queryFn: async () => {
      const response = await apiClient.get('/api/floors')
      return response.data.data as Floor[]
    }
  })

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<SpaceFormData>({
    resolver: zodResolver(spaceSchema),
    defaultValues: mode === 'edit' && initialData ? {
      name: initialData.name,
      type: initialData.type,
      floorId: typeof initialData.floor === 'object' && initialData.floor ? initialData.floor.id : (initialData.floorId || ''),
      capacity: initialData.capacity,
      minCapacity: initialData.minCapacity,
      equipment: initialData.equipment || [],
      description: initialData.description || '',
      photos: initialData.photos || [],
      coordinates: initialData.coordinates || {
        svgPathId: 'temp-space-' + Date.now(),
        boundingBox: { x: 0, y: 0, width: 100, height: 100 }
      }
    } : {
      equipment: [],
      photos: [],
      coordinates: {
        svgPathId: 'temp-space-' + Date.now(),
        boundingBox: { x: 0, y: 0, width: 100, height: 100 }
      }
    }
  })

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      reset({
        name: initialData.name,
        type: initialData.type,
        floorId: typeof initialData.floor === 'object' && initialData.floor ? initialData.floor.id : (initialData.floorId || ''),
        capacity: initialData.capacity,
        minCapacity: initialData.minCapacity,
        equipment: initialData.equipment || [],
        description: initialData.description || '',
        photos: initialData.photos || [],
        coordinates: initialData.coordinates || {
          svgPathId: 'temp-space-' + Date.now(),
          boundingBox: { x: 0, y: 0, width: 100, height: 100 }
        }
      })
      setPhotos(initialData.photos || [])
    }
  }, [initialData, mode, reset])

  const selectedEquipment = watch('equipment') || []

  const mutation = useMutation({
    mutationFn: async (data: SpaceFormData) => {
      const payload = { ...data, photos }
      if (mode === 'create') {
        const response = await apiClient.post('/api/admin/spaces', payload)
        return response.data
      } else {
        const response = await apiClient.patch(`/api/admin/spaces/${initialData.id}`, payload)
        return response.data
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-spaces'] })
      reset()
      setPhotos([])
      onClose()
      alert(`Space ${mode === 'create' ? 'created' : 'updated'} successfully!`)
    },
    onError: (error: any) => {
      alert(`Error: ${error.response?.data?.message || `Failed to ${mode} space`}`)
    }
  })

  const onSubmit = (data: SpaceFormData) => {
    mutation.mutate({ ...data, photos })
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large (max 5MB)`)
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotos(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const toggleEquipment = (item: string) => {
    const current = selectedEquipment
    const updated = current.includes(item)
      ? current.filter(e => e !== item)
      : [...current, item]
    setValue('equipment', updated)
  }

  const handlePreview = () => {
    setIsPreviewMode(true)
  }

  const handlePublishFromPreview = () => {
    handleSubmit(onSubmit)()
  }

  const handleCancelClick = () => {
    const formValues = watch()
    const hasChanges = mode === 'create' || JSON.stringify(formValues) !== JSON.stringify(initialData)

    if (hasChanges && isPreviewMode) {
      setShowCancelConfirm(true)
    } else {
      onClose()
    }
  }

  const handleDiscardChanges = () => {
    setShowCancelConfirm(false)
    setIsPreviewMode(false)
    reset()
    setPhotos([])
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {isPreviewMode && (
        <PreviewBanner
          onPublish={handlePublishFromPreview}
          onCancel={handleCancelClick}
          isPublishing={mutation.isPending}
        />
      )}

      <div
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
        style={{
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)'
        }}
        onClick={onClose}
      >
        <div
          className="max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-3xl"
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
            className="sticky top-0 px-6 py-4 flex justify-between items-center"
            style={{
              background: 'linear-gradient(145deg, #f9f9f9, #efefef)',
              borderBottom: '1px solid rgba(133, 196, 219, 0.2)',
              zIndex: 10
            }}
          >
            <h2
              className="text-2xl font-extrabold"
              style={{
                color: '#1a1a2e',
                textShadow: '2px 2px 4px rgba(255,255,255,0.8)'
              }}
            >
              {mode === 'create' ? '➕ Add New Space' : '✏️ Edit Space'}
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
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Name */}
            <div>
              <label
                className="block text-sm font-bold mb-2"
                style={{
                  color: '#4A5568',
                  textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                }}
              >
                Name *
              </label>
              <input
                {...register('name')}
                className="w-full px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-300"
                placeholder="e.g., Study Room A"
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
              {errors.name && (
                <p
                  className="text-sm mt-1 font-semibold"
                  style={{ color: '#8B0000' }}
                >
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Type */}
            <div>
              <label
                className="block text-sm font-bold mb-2"
                style={{
                  color: '#4A5568',
                  textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                }}
              >
                Type *
              </label>
              <select
                {...register('type')}
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
                <option value="">Select type...</option>
                <option value="desk">Individual Desk</option>
                <option value="group-room">Group Room</option>
              </select>
              {errors.type && (
                <p
                  className="text-sm mt-1 font-semibold"
                  style={{ color: '#8B0000' }}
                >
                  {errors.type.message}
                </p>
              )}
            </div>

            {/* Floor */}
            <div>
              <label
                className="block text-sm font-bold mb-2"
                style={{
                  color: '#4A5568',
                  textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                }}
              >
                Floor *
              </label>
              <select
                {...register('floorId')}
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
                <option value="">Select floor...</option>
                {floorsData?.map(floor => (
                  <option key={floor.id} value={floor.id}>
                    {floor.name} - {floor.building}
                  </option>
                ))}
              </select>
              {errors.floorId && (
                <p
                  className="text-sm mt-1 font-semibold"
                  style={{ color: '#8B0000' }}
                >
                  {errors.floorId.message}
                </p>
              )}
            </div>

            {/* Capacity */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-bold mb-2"
                  style={{
                    color: '#4A5568',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                  }}
                >
                  Capacity *
                </label>
                <input
                  type="number"
                  {...register('capacity')}
                  className="w-full px-4 py-3 rounded-2xl font-semibold text-sm"
                  placeholder="1"
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
                {errors.capacity && (
                  <p
                    className="text-sm mt-1 font-semibold"
                    style={{ color: '#8B0000' }}
                  >
                    {errors.capacity.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  className="block text-sm font-bold mb-2"
                  style={{
                    color: '#4A5568',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                  }}
                >
                  Min Capacity *
                </label>
                <input
                  type="number"
                  {...register('minCapacity')}
                  className="w-full px-4 py-3 rounded-2xl font-semibold text-sm"
                  placeholder="1"
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
                {errors.minCapacity && (
                  <p
                    className="text-sm mt-1 font-semibold"
                    style={{ color: '#8B0000' }}
                  >
                    {errors.minCapacity.message}
                  </p>
                )}
              </div>
            </div>

            {/* Equipment */}
            <div>
              <label
                className="block text-sm font-bold mb-2"
                style={{
                  color: '#4A5568',
                  textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                }}
              >
                Equipment
              </label>
              <div className="grid grid-cols-2 gap-2">
                {EQUIPMENT_OPTIONS.map(item => (
                  <label
                    key={item}
                    className="flex items-center gap-2 p-3 rounded-2xl cursor-pointer transition-all duration-200"
                    style={{
                      background: selectedEquipment.includes(item)
                        ? 'linear-gradient(145deg, #8BDBDB, #6FB8B8)'
                        : 'linear-gradient(145deg, #ffffff, #f5f5f5)',
                      color: selectedEquipment.includes(item) ? 'white' : '#1a1a2e',
                      boxShadow: selectedEquipment.includes(item)
                        ? `
                          6px 6px 12px rgba(139, 219, 219, 0.4),
                          -6px -6px 12px rgba(255, 255, 255, 0.8),
                          inset 2px 2px 4px rgba(255,255,255,0.3)
                        `
                        : `
                          4px 4px 8px rgba(133, 196, 219, 0.2),
                          -4px -4px 8px rgba(255, 255, 255, 0.9)
                        `
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedEquipment.includes(item)}
                      onChange={() => toggleEquipment(item)}
                      className="rounded"
                      style={{ accentColor: selectedEquipment.includes(item) ? 'white' : '#8BDBDB' }}
                    />
                    <span className="text-sm font-semibold">{item}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                className="block text-sm font-bold mb-2"
                style={{
                  color: '#4A5568',
                  textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                }}
              >
                Description *
              </label>
              <textarea
                {...register('description')}
                className="w-full px-4 py-3 rounded-2xl font-semibold text-sm"
                rows={3}
                placeholder="Enter space description..."
                style={{
                  background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
                  color: '#1a1a2e',
                  border: 'none',
                  outline: 'none',
                  boxShadow: `
                    inset 4px 4px 8px rgba(133, 196, 219, 0.2),
                    inset -4px -4px 8px rgba(255, 255, 255, 0.9)
                  `,
                  resize: 'vertical'
                }}
              />
              {errors.description && (
                <p
                  className="text-sm mt-1 font-semibold"
                  style={{ color: '#8B0000' }}
                >
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Photos */}
            <div>
              <label
                className="block text-sm font-bold mb-2"
                style={{
                  color: '#4A5568',
                  textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                }}
              >
                Photos
              </label>
              <div
                className="p-6 rounded-3xl"
                style={{
                  border: '2px dashed rgba(133, 196, 219, 0.4)',
                  background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
                  boxShadow: `
                    inset 4px 4px 8px rgba(133, 196, 219, 0.1),
                    inset -4px -4px 8px rgba(255, 255, 255, 0.9)
                  `
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="flex flex-col items-center gap-2 cursor-pointer"
                >
                  <Upload
                    className="w-8 h-8"
                    style={{ color: '#6B7280' }}
                  />
                  <span
                    className="text-sm font-semibold"
                    style={{
                      color: '#6B7280',
                      textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
                    }}
                  >
                    Click to upload photos (max 5MB each)
                  </span>
                </label>
              </div>

              {photos.length > 0 && (
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {photos.map((photo, index) => (
                    <div
                      key={index}
                      className="relative group rounded-2xl overflow-hidden"
                      style={{
                        boxShadow: `
                          6px 6px 12px rgba(133, 196, 219, 0.3),
                          -6px -6px 12px rgba(255, 255, 255, 0.8)
                        `
                      }}
                    >
                      <img
                        src={photo}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-24 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-1 right-1 p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                        style={{
                          background: 'linear-gradient(145deg, #FFB6B6, #FF9999)',
                          color: 'white',
                          boxShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                        }}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div
              className="flex gap-3 justify-end pt-4"
              style={{
                borderTop: '1px solid rgba(133, 196, 219, 0.2)'
              }}
            >
              <button
                type="button"
                onClick={handleCancelClick}
                className="px-6 py-2 rounded-2xl font-bold text-sm transition-all duration-200"
                style={{
                  background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
                  color: '#6B7280',
                  border: '1px solid rgba(133, 196, 219, 0.3)',
                  boxShadow: `
                    4px 4px 8px rgba(133, 196, 219, 0.2),
                    -4px -4px 8px rgba(255, 255, 255, 0.9)
                  `,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              {!isPreviewMode && mode === 'edit' && (
                <button
                  type="button"
                  onClick={handlePreview}
                  className="px-6 py-2 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all duration-200"
                  style={{
                    background: 'linear-gradient(145deg, #C4B5FD, #A594D6)',
                    color: '#4C1D95',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.6)',
                    boxShadow: `
                      6px 6px 12px rgba(196, 181, 253, 0.4),
                      -6px -6px 12px rgba(255, 255, 255, 0.8)
                    `,
                    cursor: 'pointer'
                  }}
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
              )}
              <button
                type="submit"
                disabled={mutation.isPending}
                className="px-6 py-2 rounded-2xl font-bold text-sm transition-all duration-200"
                style={{
                  background: mutation.isPending
                    ? 'linear-gradient(145deg, #d0d0d0, #b0b0b0)'
                    : 'linear-gradient(145deg, #8BDBDB, #6FB8B8)',
                  color: 'white',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                  boxShadow: mutation.isPending
                    ? 'none'
                    : `
                      8px 8px 16px rgba(139, 219, 219, 0.4),
                      -8px -8px 16px rgba(255, 255, 255, 0.9)
                    `,
                  cursor: mutation.isPending ? 'not-allowed' : 'pointer',
                  opacity: mutation.isPending ? 0.6 : 1
                }}
              >
                {mutation.isPending
                  ? (mode === 'create' ? 'Creating...' : 'Updating...')
                  : (mode === 'create' ? 'Create Space' : 'Update Space')
                }
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Discard Changes Confirmation */}
      {showCancelConfirm && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[60]"
          style={{
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)'
          }}
        >
          <div
            className="max-w-md w-full p-6 rounded-3xl"
            style={{
              background: 'linear-gradient(145deg, #f9f9f9, #efefef)',
              boxShadow: `
                20px 20px 40px rgba(133, 196, 219, 0.5),
                -20px -20px 40px rgba(255, 255, 255, 0.95)
              `
            }}
          >
            <h3
              className="text-xl font-extrabold mb-4"
              style={{
                color: '#1a1a2e',
                textShadow: '2px 2px 4px rgba(255,255,255,0.8)'
              }}
            >
              ⚠️ Discard Unsaved Changes?
            </h3>
            <p
              className="mb-6 font-semibold"
              style={{
                color: '#6B7280',
                textShadow: '1px 1px 2px rgba(255,255,255,0.6)'
              }}
            >
              You have unsaved changes in preview mode. Are you sure you want to discard them?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="px-6 py-2 rounded-2xl font-bold text-sm transition-all duration-200"
                style={{
                  background: 'linear-gradient(145deg, #F0F9FF, #D4E6FF)',
                  color: '#1a5490',
                  boxShadow: `
                    6px 6px 12px rgba(133, 196, 219, 0.3),
                    -6px -6px 12px rgba(255, 255, 255, 0.8)
                  `,
                  cursor: 'pointer'
                }}
              >
                Keep Editing
              </button>
              <button
                onClick={handleDiscardChanges}
                className="px-6 py-2 rounded-2xl font-bold text-sm transition-all duration-200"
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
              >
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
