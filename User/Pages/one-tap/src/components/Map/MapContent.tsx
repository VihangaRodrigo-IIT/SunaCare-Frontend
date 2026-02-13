'use client'

import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'

// Fix Leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Sri Lanka bounds
const SRI_LANKA_CENTER = [7.8731, 80.7718] as [number, number]
const SRI_LANKA_BOUNDS = [
  [5.9, 79.6],
  [9.8, 81.9]
] as [[number, number], [number, number]]

interface MapContentProps {
  onLocationSelect: (address: string, lat: number, lng: number) => void
  initialLat: number
  initialLng: number
}

// Handles map click events
const MapClickHandler = ({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

// Sets max bounds on mount
const MapBoundsHandler = () => {
  const map = useMap()

  useEffect(() => {
    map.setMaxBounds(SRI_LANKA_BOUNDS)
  }, [map])

  return null
}

// Pans the map view when coordinates change (e.g. from search or current location)
const MapRecenter = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap()

  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], 15, { duration: 1.2 })
    }
  }, [lat, lng, map])

  return null
}

export default function MapContent({
  onLocationSelect,
  initialLat,
  initialLng,
}: MapContentProps) {
  const [markerPos, setMarkerPos] = useState<{ lat: number; lng: number }>({
    lat: initialLat || 7.8731,
    lng: initialLng || 80.7718,
  })

  // Update marker when initial coordinates change (from search or current location)
  useEffect(() => {
    if (initialLat && initialLng) {
      setMarkerPos({ lat: initialLat, lng: initialLng })
    }
  }, [initialLat, initialLng])

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        {
          headers: {
            'User-Agent': 'SunaCareApp/1.0'
          }
        }
      )
      const data = await response.json()
      onLocationSelect(
        data.display_name || `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`,
        lat,
        lng
      )
    } catch (error) {
      console.error('Reverse geocoding error:', error)
      onLocationSelect(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`, lat, lng)
    }
  }

  const handleMapClick = (lat: number, lng: number) => {
    // Constrain to Sri Lanka bounds
    if (lat < 5.9 || lat > 9.8 || lng < 79.6 || lng > 81.9) {
      return // Silently ignore out-of-bounds clicks instead of alert
    }
    setMarkerPos({ lat, lng })
    reverseGeocode(lat, lng)
  }

  const handleMarkerDragEnd = (newLat: number, newLng: number) => {
    handleMapClick(newLat, newLng)
  }

  return (
    <MapContainer
      center={SRI_LANKA_CENTER}
      zoom={8}
      minZoom={7}
      maxZoom={18}
      style={{ width: '100%', height: '100%' }}
      preferCanvas={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        maxNativeZoom={19}
      />
      <MapBoundsHandler />
      <MapClickHandler onMapClick={handleMapClick} />
      <MapRecenter lat={markerPos.lat} lng={markerPos.lng} />
      <Marker
        position={[markerPos.lat, markerPos.lng]}
        draggable={true}
        eventHandlers={{
          dragend: (e) => {
            const latlng = e.target.getLatLng()
            handleMarkerDragEnd(latlng.lat, latlng.lng)
          },
        }}
      >
        <Popup>
          <div className="text-xs font-semibold">
            <p>📍 Selected Location</p>
            <p>Lat: {markerPos.lat.toFixed(4)}</p>
            <p>Lng: {markerPos.lng.toFixed(4)}</p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  )
}