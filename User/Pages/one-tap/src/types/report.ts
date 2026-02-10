// Type definitions for reports
export type AnimalType =
  | 'dog'
  | 'cat'
  | 'bird'
  | 'cattle'
  | 'other'

export type SeverityLevel =
  | 'critical'
  | 'moderate'
  | 'minor'

export interface Location {
  latitude: number
  longitude: number
  address: string
}

export interface AnimalDetails {
  type: AnimalType
  description: string
  photos: string[]
}

export interface EmergencyReport {
  id?: string
  userId: string
  location: Location
  animal: AnimalDetails
  severity: SeverityLevel
  description: string
  timestamp?: Date
  status?: 'pending' | 'submitted' | 'confirmed' | 'resolved'
  ticketId?: string
}

export interface ReportFlowState {
  location: Location | null
  animal: AnimalDetails | null
  severity: SeverityLevel | null
  description: string
  currentStep: number
  isSubmitting: boolean
}
