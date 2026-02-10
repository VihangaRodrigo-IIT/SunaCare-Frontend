'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProgressIndicator } from '@/components/Common/ProgressIndicator'
import { PhotoUpload } from '@/components/ReportFlow/PhotoUpload'
import { AnimalTypeSelector } from '@/components/ReportFlow/AnimalTypeSelector'
import { ErrorMessage } from '@/components/Common/ErrorMessage'
import { FiMinus, FiPlus } from 'react-icons/fi'
import { AnimalType } from '@/types/report'

export default function EvidencePage() {
  const router = useRouter()
  const [photos, setPhotos] = useState<string[]>([])
  const [animalType, setAnimalType] = useState<AnimalType | null>(null)
  const [animalCount, setAnimalCount] = useState(1)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleAddPhoto = (url: string) => {
    setPhotos([...photos, url])
  }

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index))
  }

  const handleNext = async () => {
    if (photos.length === 0) {
      setError('Please add at least one photo')
      return
    }

    if (!animalType) {
      setError('Please select animal type')
      return
    }

    if (animalCount < 1) {
      setError('Please specify how many animals')
      return
    }

    setIsLoading(true)

    // Store evidence data in sessionStorage
    sessionStorage.setItem(
      'reportEvidence',
      JSON.stringify({
        photos,
        animalType,
        animalCount,
      })
    )

    router.push('/report/details')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ProgressIndicator
        currentStep={1}
        totalSteps={4}
        steps={['Evidence', 'Details', 'Location', 'Success']}
      />

      <div className="flex-1 p-4 container-safe max-w-2xl mx-auto w-full space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Let's start with evidence.
          </h1>
          <p className="text-gray-600">
            Photos help rescuers identify the animal and urgency.
          </p>
        </div>

        {error && (
          <ErrorMessage
            message={error}
            onClose={() => setError('')}
          />
        )}

        {/* Photo Upload */}
        <div>
          <h2 className="text-sm font-bold text-gray-900 uppercase mb-4">
            Photos ({photos.length}/5)
          </h2>
          <PhotoUpload
            photos={photos}
            onAdd={handleAddPhoto}
            onRemove={handleRemovePhoto}
            maxPhotos={5}
          />
        </div>

        {/* Animal Type */}
        <div>
          <h2 className="text-sm font-bold text-gray-900 uppercase mb-4">
            Animal Type
          </h2>
          <AnimalTypeSelector selected={animalType} onSelect={setAnimalType} />
        </div>

        {/* Animal Count */}
        <div>
          <h2 className="text-sm font-bold text-gray-900 uppercase mb-4">
            How Many?
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setAnimalCount(Math.max(1, animalCount - 1))}
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg border-2 border-gray-300 text-gray-600 hover:border-primary-500 hover:text-primary-500 transition-colors button-touch"
            >
              <FiMinus size={20} />
            </button>
            <div className="flex-1 text-center">
              <p className="text-3xl font-bold text-gray-900">{animalCount}</p>
              <p className="text-xs text-gray-600 uppercase">Animal</p>
            </div>
            <button
              onClick={() => setAnimalCount(animalCount + 1)}
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg border-2 border-gray-300 text-gray-600 hover:border-primary-500 hover:text-primary-500 transition-colors button-touch"
            >
              <FiPlus size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 bg-white p-4 container-safe">
        <button
          onClick={handleNext}
          disabled={photos.length === 0 || !animalType || isLoading}
          className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 active:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors button-touch"
        >
          {isLoading ? 'Loading...' : 'Next: Details'}
        </button>
      </div>
    </div>
  )
}
