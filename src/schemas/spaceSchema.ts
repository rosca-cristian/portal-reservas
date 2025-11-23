import { z } from 'zod'

export const spaceSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  type: z.enum(['desk', 'group-room'], {
    required_error: 'Type is required'
  }),
  floorId: z.string().uuid('Please select a valid floor'),
  capacity: z.coerce.number().min(1, 'Capacity must be at least 1'),
  minCapacity: z.coerce.number().min(1, 'Minimum capacity must be at least 1'),
  equipment: z.array(z.string()).default([]),
  description: z.string().min(1, 'Description is required'),
  photos: z.array(z.string()).default([]),
  coordinates: z.object({
    svgPathId: z.string(),
    boundingBox: z.object({
      x: z.number(),
      y: z.number(),
      width: z.number(),
      height: z.number()
    })
  })
})

export type SpaceFormData = z.infer<typeof spaceSchema>

export const EQUIPMENT_OPTIONS = [
  'Computer',
  'Whiteboard',
  'Projector',
  'Monitor',
  'TV Screen',
  'Audio System',
  'Video Conference'
] as const
