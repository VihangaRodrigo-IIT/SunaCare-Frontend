'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Loader } from '@/components/Common/Loader'

// Dynamically import with no SSR
const DynamicMapContent = dynamic(
  () => import('./MapContent'),
  { 
    ssr: false,
    loading: () => <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-lg"><Loader text="Loading map..." /></div>
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
        <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
          <Loader text="Loading map..." />
        </div>
      </div>
    )
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

      <div className="w-full rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border-2 border-gray-300 bg-white" style={{ height: '400px', minHeight: '400px' }}>
        <DynamicMapContent
          onLocationSelect={handleLocationSelect}
          initialLat={markerCoords.lat}
          initialLng={markerCoords.lng}
        />
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">📍</span>
          <p className="font-semibold text-blue-900">Selected Coordinates</p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-white bg-opacity-60 rounded p-2">
            <p className="text-gray-600 text-xs font-semibold">LATITUDE</p>
            <p className="text-gray-900 font-mono">{markerCoords.lat.toFixed(6)}</p>
          </div>
          <div className="bg-white bg-opacity-60 rounded p-2">
            <p className="text-gray-600 text-xs font-semibold">LONGITUDE</p>
            <p className="text-gray-900 font-mono">{markerCoords.lng.toFixed(6)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
          </div>
        </div>
      </div>
    </div>
  )
}
