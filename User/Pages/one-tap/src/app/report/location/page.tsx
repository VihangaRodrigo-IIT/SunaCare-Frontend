'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProgressIndicator } from '@/components/Common/ProgressIndicator'
import { AddressSearchBar } from '@/components/Map/AddressSearchBar'
import { MapPicker } from '@/components/Map/MapPicker'
import { ErrorMessage } from '@/components/Common/ErrorMessage'
import { FiArrowLeft } from 'react-icons/fi'

interface StoredDetails {
  primaryStatus: string
  specificSigns: string[]
  additionalContext: string
}

export default function LocationPage() {
  const router = useRouter()
  const [details, setDetails] = useState<StoredDetails | null>(null)
  const [address, setAddress] = useState('')
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const storedDetails = sessionStorage.getItem('reportDetails')
    if (!storedDetails) {
      setError('Session expired. Please start over.')
      return
    }
    try {
      setDetails(JSON.parse(storedDetails))
    } catch {
      setError('Failed to load report data')
    }
  }, [])

  const handleLocationSelect = (addr: string, lat: number, lng: number) => {
    setAddress(addr)
    setLocation({ lat, lng })
    setError('')
  }

  const handleNext = async () => {
    if (!address || !location) {
      setError('Please select a location')
      return
    }

    setIsLoading(true)

    // Store location in sessionStorage
    sessionStorage.setItem(
      'reportLocation',
      JSON.stringify({
        address,
        latitude: location.lat,
        longitude: location.lng,
      })
    )

    router.push('/report/review')
  }

  const handleBack = () => {
    router.back()
  }

  if (!details) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <ProgressIndicator
          currentStep={3}
          totalSteps={4}
          steps={['Evidence', 'Details', 'Location', 'Success']}
        />
        <div className="flex-1 flex items-center justify-center p-4">
          {error && <ErrorMessage message={error} />}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ProgressIndicator
        currentStep={3}
        totalSteps={4}
        steps={['Evidence', 'Details', 'Location', 'Success']}
      />

      <div className="flex-1 p-4 container-safe max-w-2xl mx-auto w-full space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Where is the animal?
          </h1>
          <p className="text-gray-600">
            Help us locate the animal by providing the address or coordinates
          </p>
        </div>

        {error && (
          <ErrorMessage
            message={error}
            onClose={() => setError('')}
          />
        )}

        <div>
          <h2 className="text-sm font-bold text-gray-900 uppercase mb-4">
            Location
          </h2>
          <div className="space-y-6">
            <AddressSearchBar
              value={address}
              onChange={handleLocationSelect}
              placeholder="Enter address or use current location..."
            />

            <MapPicker
              onLocationSelect={handleLocationSelect}
              initialLat={location?.lat || 7.8731}
              initialLng={location?.lng || 80.7718}
            />
          </div>
        </div>

        {address && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Selected Location:</strong> {address}
            </p>
          </div>
        )}
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
            disabled={!address || isLoading}
            className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 active:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors button-touch"
          >
            {isLoading ? 'Loading...' : 'Next: Review'}
          </button>
        </div>
      </div>
    </div>
  )
}
