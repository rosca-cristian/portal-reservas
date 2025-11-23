import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import { X, AlertCircle } from 'lucide-react'
import { unavailabilitySchema } from '@/schemas/unavailabilitySchema'
import type { UnavailabilityFormData } from '@/schemas/unavailabilitySchema'

interface MarkUnavailableDialogProps {
  isOpen: boolean
  onClose: () => void
  space: { id: string; name: string } | null
}

export function MarkUnavailableDialog({ isOpen, onClose, space }: MarkUnavailableDialogProps) {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const queryClient = useQueryClient()

  const { register, handleSubmit, formState: { errors }, reset } = useForm<UnavailabilityFormData>({
    resolver: zodResolver(unavailabilitySchema),
    defaultValues: {
      reason: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: ''
    }
  })

  const mutation = useMutation({
    mutationFn: async (data: UnavailabilityFormData & { spaceId: string }) => {
      const response = await apiClient.post(`/api/admin/spaces/${data.spaceId}/unavailability`, {
        reason: data.reason,
        startDate: data.startDate,
        endDate: data.endDate || null
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-spaces'] })
      reset()
      setShowConfirmation(true)
      setTimeout(() => {
        setShowConfirmation(false)
        onClose()
      }, 2000)
    },
    onError: (error: any) => {
      alert(`Error: ${error.response?.data?.message || 'Failed to mark space unavailable'}`)
    }
  })

  const onSubmit = (data: UnavailabilityFormData) => {
    if (!space) return
    mutation.mutate({ ...data, spaceId: space.id })
  }

  const handleClose = () => {
    reset()
    setShowConfirmation(false)
    onClose()
  }

  if (!isOpen || !space) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Mark Space Unavailable</h2>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {showConfirmation ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Space Marked Unavailable</h3>
            <p className="text-gray-600">{space.name} is now unavailable for booking</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Space: {space.name}</p>
                <p className="text-xs text-yellow-700 mt-1">
                  Users will not be able to book this space during the unavailability period.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Reason *</label>
              <textarea
                {...register('reason')}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="e.g., Maintenance, Cleaning, Renovation..."
              />
              {errors.reason && (
                <p className="text-red-600 text-sm mt-1">{errors.reason.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Start Date *</label>
              <input
                type="date"
                {...register('startDate')}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {errors.startDate && (
                <p className="text-red-600 text-sm mt-1">{errors.startDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">End Date (Optional)</label>
              <input
                type="date"
                {...register('endDate')}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty for indefinite unavailability. Space will auto-reactivate when end date passes.
              </p>
              {errors.endDate && (
                <p className="text-red-600 text-sm mt-1">{errors.endDate.message}</p>
              )}
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50"
              >
                {mutation.isPending ? 'Marking...' : 'Mark Unavailable'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
