'use client'

import React, { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Loader } from '@/components/Common/Loader'

// Dynamically import with no SSR
const DynamicMapContent = dynamic(
  () => import('./MapContent'),
  { 
    ssr: false,
    loading: () => <Loader text="Loading map..." />
  }
)

interface MapPickerProps {
  onLocationSelect: (address: string, lat: number, lng: number) => void
  initialLat?: number
  initialLng?: number
}

// Sri Lanka center coordinates
const SRI_LANKA_CENTER = { lat: 7.8731, lng: 80.7718 }

export const MapPicker: React.FC<MapPickerProps> = ({
  onLocationSelect,
  initialLat = SRI_LANKA_CENTER.lat,
  initialLng = SRI_LANKA_CENTER.lng,
}) => {
  const [isClient, setIsClient] = useState(false)
  const [markerCoords, setMarkerCoords] = useState({
    lat: initialLat || 7.8731,
    lng: initialLng || 80.7718
  })

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleLocationSelect = (address: string, lat: number, lng: number) => {
    setMarkerCoords({ lat, lng })
    onLocationSelect(address, lat, lng)
  }

  if (!isClient) {
    return <Loader text="Loading map..." />
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Pin Location on Map
        </label>
        <p className="text-sm text-gray-600 mb-3">
          Click on the map to move the marker, or drag it to your location
        </p>
      </div>

      <div className="w-full bg-white border-2 border-gray-300 rounded-lg overflow-hidden" style={{ height: '320px' }}>
        <DynamicMapContent
          onLocationSelect={handleLocationSelect}
          initialLat={markerCoords.lat}
          initialLng={markerCoords.lng}
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
        <p>
          <strong>Selected:</strong> {markerCoords.lat.toFixed(4)}, {markerCoords.lng.toFixed(4)}
        </p>
      </div>
    </div>
  )
}
