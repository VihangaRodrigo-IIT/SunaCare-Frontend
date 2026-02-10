import { z } from 'zod'

export const locationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().min(5, 'Address must be at least 5 characters'),
})

export const animalDetailsSchema = z.object({
  type: z.enum(['dog', 'cat', 'bird', 'cattle', 'other']),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  photos: z.array(z.string()).min(1, 'At least one photo is required'),
})

export const reportSchema = z.object({
  location: locationSchema,
  animal: animalDetailsSchema,
  severity: z.enum(['critical', 'moderate', 'minor']),
  description: z.string().min(20, 'Description must be at least 20 characters'),
})

export type LocationInput = z.infer<typeof locationSchema>
export type AnimalDetailsInput = z.infer<typeof animalDetailsSchema>
export type ReportInput = z.infer<typeof reportSchema>
