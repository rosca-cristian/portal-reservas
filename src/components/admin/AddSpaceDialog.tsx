import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import { X, Upload } from 'lucide-react'
import { spaceSchema, EQUIPMENT_OPTIONS } from '@/schemas/spaceSchema'
import type { SpaceFormData } from '@/schemas/spaceSchema'

interface Floor {
  id: string
  name: string
  building: string
}

interface AddSpaceDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function AddSpaceDialog({ isOpen, onClose }: AddSpaceDialogProps) {
  const [photos, setPhotos] = useState<string[]>([])
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
    defaultValues: {
      equipment: [],
      photos: [],
      coordinates: {
        svgPathId: 'temp-space-' + Date.now(),
        boundingBox: { x: 0, y: 0, width: 100, height: 100 }
      }
    }
  })

  const selectedEquipment = watch('equipment') || []

  const createMutation = useMutation({
    mutationFn: async (data: SpaceFormData) => {
      const response = await apiClient.post('/api/admin/spaces', {
        ...data,
        photos
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-spaces'] })
      reset()
      setPhotos([])
      onClose()
      alert('Space created successfully!')
    },
    onError: (error: any) => {
      alert(`Error: ${error.response?.data?.message || 'Failed to create space'}`)
    }
  })

  const onSubmit = (data: SpaceFormData) => {
    createMutation.mutate({ ...data, photos })
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Add New Space</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Name *</label>
            <input
              {...register('name')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Study Room A"
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Type *</label>
            <select
              {...register('type')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select type...</option>
              <option value="desk">Individual Desk</option>
              <option value="group-room">Group Room</option>
            </select>
            {errors.type && <p className="text-red-600 text-sm mt-1">{errors.type.message}</p>}
          </div>

          {/* Floor */}
          <div>
            <label className="block text-sm font-medium mb-2">Floor *</label>
            <select
              {...register('floorId')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select floor...</option>
              {floorsData?.map(floor => (
                <option key={floor.id} value={floor.id}>
                  {floor.name} - {floor.building}
                </option>
              ))}
            </select>
            {errors.floorId && <p className="text-red-600 text-sm mt-1">{errors.floorId.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Capacity */}
            <div>
              <label className="block text-sm font-medium mb-2">Capacity *</label>
              <input
                type="number"
                {...register('capacity')}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1"
              />
              {errors.capacity && <p className="text-red-600 text-sm mt-1">{errors.capacity.message}</p>}
            </div>

            {/* Min Capacity */}
            <div>
              <label className="block text-sm font-medium mb-2">Min Capacity *</label>
              <input
                type="number"
                {...register('minCapacity')}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1"
              />
              {errors.minCapacity && <p className="text-red-600 text-sm mt-1">{errors.minCapacity.message}</p>}
            </div>
          </div>

          {/* Equipment */}
          <div>
            <label className="block text-sm font-medium mb-2">Equipment</label>
            <div className="grid grid-cols-2 gap-2">
              {EQUIPMENT_OPTIONS.map(item => (
                <label key={item} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedEquipment.includes(item)}
                    onChange={() => toggleEquipment(item)}
                    className="rounded"
                  />
                  <span className="text-sm">{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <textarea
              {...register('description')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Enter space description..."
            />
            {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>}
          </div>

          {/* Photos */}
          <div>
            <label className="block text-sm font-medium mb-2">Photos</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
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
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-600">Click to upload photos (max 5MB each)</span>
              </label>
            </div>

            {photos.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img src={photo} alt={`Upload ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Space'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
