'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProgressIndicator } from '@/components/Common/ProgressIndicator'
import { ErrorMessage } from '@/components/Common/ErrorMessage'
import { Loader } from '@/components/Common/Loader'
import { FiArrowLeft, FiCheck } from 'react-icons/fi'
import { AnimalType, SeverityLevel } from '@/types/report'

interface StoredEvidence {
  photos: string[]
  animalType: AnimalType
  animalCount: number
}

interface StoredDetails {
  primaryStatus: string
  specificSigns: string[]
  additionalContext: string
}

interface StoredLocation {
  address: string
  latitude: number
  longitude: number
}

export default function ReviewPage() {
  const router = useRouter()
  const [evidence, setEvidence] = useState<StoredEvidence | null>(null)
  const [details, setDetails] = useState<StoredDetails | null>(null)
  const [location, setLocation] = useState<StoredLocation | null>(null)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const storedEvidence = sessionStorage.getItem('reportEvidence')
    const storedDetails = sessionStorage.getItem('reportDetails')
    const storedLocation = sessionStorage.getItem('reportLocation')

    if (!storedEvidence || !storedDetails || !storedLocation) {
      setError('Session expired. Please start over.')
      return
    }

    try {
      setEvidence(JSON.parse(storedEvidence))
      setDetails(JSON.parse(storedDetails))
      setLocation(JSON.parse(storedLocation))
    } catch {
      setError('Failed to load report data')
    }
  }, [])

  const handleSubmit = async () => {
    if (!evidence || !details || !location) return

    setIsSubmitting(true)

    try {
      // Prepare report payload
      const reportPayload = {
        location,
        animal: {
          type: evidence.animalType,
          count: evidence.animalCount,
          photos: evidence.photos,
        },
        status: details.primaryStatus,
        signs: details.specificSigns,
        description: details.additionalContext,
      }

      // In a real app, submit to API
      // const response = await apiClient.submitReport(reportPayload)
      // const ticketId = response.data?.ticketId

      // Mock submission with delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Store ticket ID
      const mockTicketId = 'TKT-' + Math.random().toString(36).substring(7).toUpperCase()
      sessionStorage.setItem('reportTicketId', mockTicketId)
      sessionStorage.removeItem('reportEvidence')
      sessionStorage.removeItem('reportDetails')
      sessionStorage.removeItem('reportLocation')

      router.push('/report/success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit report')
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    router.back()
  }

  if (!evidence || !details || !location) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <ProgressIndicator
          currentStep={4}
          totalSteps={4}
          steps={['Evidence', 'Details', 'Location', 'Success']}
        />
        <div className="flex-1 flex items-center justify-center p-4">
          {error ? (
            <ErrorMessage message={error} />
          ) : (
            <Loader message="Loading report..." />
          )}
        </div>
      </div>
    )
  }

  const severityColors = {
    critical: 'text-red-600 bg-red-50',
    moderate: 'text-orange-600 bg-orange-50',
    minor: 'text-blue-600 bg-blue-50',
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ProgressIndicator
        currentStep={4}
        totalSteps={4}
        steps={['Evidence', 'Details', 'Location', 'Success']}
      />

      <div className="flex-1 p-4 container-safe max-w-2xl mx-auto w-full space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Review Report
          </h1>
          <p className="text-gray-600">
            Please verify all information before submitting
          </p>
        </div>

        {error && (
          <ErrorMessage
            message={error}
            onClose={() => setError('')}
          />
        )}

        {/* Evidence Review */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Evidence</h2>

          <div>
            <p className="text-sm font-semibold text-gray-600 uppercase mb-2">
              Photos ({evidence.photos.length})
            </p>
            <div className="grid grid-cols-3 gap-2">
              {evidence.photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className="w-full aspect-square object-cover rounded-lg"
                />
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase">Animal Type</p>
              <p className="text-gray-900 capitalize">{evidence.animalType}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase">Count</p>
              <p className="text-gray-900">{evidence.animalCount}</p>
            </div>
          </div>
        </div>

        {/* Details Review */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Details</h2>

          <div>
            <p className="text-sm font-semibold text-gray-600 uppercase">Primary Status</p>
            <p className="text-gray-900 capitalize">{details.primaryStatus}</p>
          </div>

          {details.specificSigns.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase mb-2">Specific Signs</p>
              <div className="flex flex-wrap gap-2">
                {details.specificSigns.map((sign) => (
                  <span
                    key={sign}
                    className="px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-900"
                  >
                    {sign}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-sm font-semibold text-gray-600 uppercase mb-2">
              Additional Context
            </p>
            <p className="text-gray-900 text-sm leading-relaxed">
              {details.additionalContext}
            </p>
          </div>
        </div>

        {/* Location Review */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Location</h2>
          <p className="text-gray-600">{location.address}</p>
          <p className="text-sm text-gray-500 mt-1">
            {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-200 bg-white p-4 container-safe">
        <div className="flex gap-3 max-w-2xl mx-auto">
          <button
            onClick={handleBack}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-900 rounded-lg font-semibold hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50 transition-colors button-touch"
          >
            <FiArrowLeft size={20} />
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 active:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors button-touch"
          >
            {isSubmitting ? (
              'Submitting...'
            ) : (
              <>
                Submit Report
                <FiCheck size={20} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
