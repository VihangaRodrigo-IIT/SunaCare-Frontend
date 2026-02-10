'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProgressIndicator } from '@/components/Common/ProgressIndicator'
import { ErrorMessage } from '@/components/Common/ErrorMessage'
import { FiArrowLeft } from 'react-icons/fi'
import { FiHome, FiZap, FiShield, FiCheck, FiHeart } from 'react-icons/fi'

type PrimaryStatus = 'injured' | 'sick' | 'abuse' | 'litter' | 'safe' | null

const PRIMARY_STATUSES = [
  { value: 'injured', label: 'Injured', icon: '🩹', color: 'bg-red-50 border-red-300' },
  { value: 'sick', label: 'Sick', icon: '⚕️', color: 'bg-orange-50 border-orange-300' },
  { value: 'abuse', label: 'Abuse', icon: '🛡️', color: 'bg-purple-50 border-purple-300' },
  { value: 'litter', label: 'Litter', icon: '👶', color: 'bg-blue-50 border-blue-300' },
  { value: 'safe', label: 'Safe', icon: '✓', color: 'bg-green-50 border-green-300' },
]

const SPECIFIC_SIGNS: Record<string, string[]> = {
  injured: ['Bleeding', 'Limping', 'Broken Limb', 'Open Wound', 'Road Accident', 'Unconscious'],
  sick: ['Skin/Mange', 'Starving/Thin', 'Ticks/Fleas', 'Eye Infection', 'Breathing Issue', 'Vomiting'],
  abuse: ['Tied Up/Chained', 'Caged', 'Beaten', 'Abandoned', 'Aggressive'],
  litter: ['Pregnant Mom', 'Nursing Mom', 'Puppies Only', 'Kittens Only', 'Abandoned Litter'],
  safe: ['Lost Pet', 'Wandering', 'Found', 'Aggressive'],
}

interface StoredEvidence {
  photos: string[]
  animalType: string
  animalCount: number
}

export default function DetailsPage() {
  const router = useRouter()
  const [evidence, setEvidence] = useState<StoredEvidence | null>(null)
  const [primaryStatus, setPrimaryStatus] = useState<PrimaryStatus>(null)
  const [specificSigns, setSpecificSigns] = useState<string[]>([])
  const [additionalContext, setAdditionalContext] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const storedEvidence = sessionStorage.getItem('reportEvidence')
    if (!storedEvidence) {
      setError('Session expired. Please start over.')
      return
    }
    try {
      setEvidence(JSON.parse(storedEvidence))
    } catch {
      setError('Failed to load report data')
    }
  }, [])

  const handleSignSelect = (sign: string) => {
    if (specificSigns.includes(sign)) {
      setSpecificSigns(specificSigns.filter((s) => s !== sign))
    } else {
      setSpecificSigns([...specificSigns, sign])
    }
  }

  const handleNext = async () => {
    if (!primaryStatus) {
      setError('Please select a primary status')
      return
    }

    if (!additionalContext.trim()) {
      setError('Please provide additional context')
      return
    }

    setIsLoading(true)

    // Store details in sessionStorage
    sessionStorage.setItem(
      'reportDetails',
      JSON.stringify({
        primaryStatus,
        specificSigns,
        additionalContext,
      })
    )

    router.push('/report/location')
  }

  const handleBack = () => {
    router.back()
  }

  if (!evidence) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <ProgressIndicator
          currentStep={2}
          totalSteps={4}
          steps={['Evidence', 'Details', 'Location', 'Success']}
        />
        <div className="flex-1 flex items-center justify-center p-4">
          {error && <ErrorMessage message={error} />}
        </div>
      </div>
    )
  }

  const availableSigns = primaryStatus ? SPECIFIC_SIGNS[primaryStatus] : []

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ProgressIndicator
        currentStep={2}
        totalSteps={4}
        steps={['Evidence', 'Details', 'Location', 'Success']}
      />

      <div className="flex-1 p-4 container-safe max-w-2xl mx-auto w-full space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            What's happening?
          </h1>
          <p className="text-gray-600">
            Provide details to help the rescue team prepare.
          </p>
        </div>

        {error && (
          <ErrorMessage
            message={error}
            onClose={() => setError('')}
          />
        )}

        {/* Primary Status */}
        <div>
          <h2 className="text-sm font-bold text-gray-900 uppercase mb-4">
            Primary Status
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {PRIMARY_STATUSES.map((status) => (
              <button
                key={status.value}
                onClick={() => {
                  setPrimaryStatus(status.value as PrimaryStatus)
                  setSpecificSigns([])
                }}
                className={`relative p-4 rounded-lg border-2 transition-all button-touch ${
                  primaryStatus === status.value
                    ? `border-primary-500 ${status.color}`
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">{status.icon}</div>
                <div className="font-semibold text-sm text-gray-900">
                  {status.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Specific Signs */}
        {primaryStatus && availableSigns.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-gray-900 uppercase mb-2">
              Specific Signs
            </h2>
            <p className="text-xs text-gray-600 mb-3">(Tap to select)</p>
            <div className="flex flex-wrap gap-2">
              {availableSigns.map((sign) => (
                <button
                  key={sign}
                  onClick={() => handleSignSelect(sign)}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                    specificSigns.includes(sign)
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'bg-white text-gray-900 border border-gray-300 hover:border-primary-500'
                  }`}
                >
                  {sign}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Additional Context */}
        <div>
          <h2 className="text-sm font-bold text-gray-900 uppercase mb-4">
            Additional Context
          </h2>
          <textarea
            value={additionalContext}
            onChange={(e) => setAdditionalContext(e.target.value)}
            placeholder="Describe the situation... (e.g. 'Dog is scared, hiding under a car, looks very weak')"
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg font-sans text-base focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <p className="text-xs text-gray-600 mt-2">
            {additionalContext.length} characters
          </p>
        </div>
      </div>

      <div className="border-t border-gray-200 bg-white p-4 container-safe">
        <div className="flex gap-3 max-w-2xl mx-auto">
          <button
            onClick={handleBack}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-900 rounded-lg font-semibold hover:bg-gray-200 active:bg-gray-300 transition-colors button-touch"
          >
            <FiArrowLeft size={20} />
          </button>
          <button
            onClick={handleNext}
            disabled={!primaryStatus || !additionalContext.trim() || isLoading}
            className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 active:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors button-touch"
          >
            {isLoading ? 'Loading...' : 'Next: Location'}
          </button>
        </div>
      </div>
    </div>
  )
}
