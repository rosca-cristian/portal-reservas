import { z } from 'zod'

export const unavailabilitySchema = z.object({
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
  startDate: z.string().refine((date) => {
    return !isNaN(Date.parse(date))
  }, 'Start date is required'),
  endDate: z.string().optional().refine((date) => {
    if (!date) return true
    return !isNaN(Date.parse(date))
  }, 'End date must be a valid date')
}).refine((data) => {
  if (!data.endDate) return true
  const start = new Date(data.startDate)
  const end = new Date(data.endDate)
  return end > start
}, {
  message: 'End date must be after start date',
  path: ['endDate']
})

export type UnavailabilityFormData = z.infer<typeof unavailabilitySchema>
