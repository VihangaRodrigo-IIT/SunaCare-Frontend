'use client'

import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

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

const MapClickHandler = ({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

const MapBoundsHandler = () => {
  const map = useMap()
  
  useEffect(() => {
    // Add small delay to ensure map is fully loaded
    setTimeout(() => {
      map.setMaxBounds(SRI_LANKA_BOUNDS)
      map.fitBounds(SRI_LANKA_BOUNDS, { padding: [50, 50] })
      map.invalidateSize()
    }, 100)
  }, [map])

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
  const [mapKey, setMapKey] = useState(0)

  // Update marker when initial coordinates change
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
            'User-Agent': 'OneTabAnimalReport/1.0'
          }
        }
      )
      const data = await response.json()
      onLocationSelect(data.display_name || `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`, lat, lng)
    } catch (error) {
      console.error('Reverse geocoding error:', error)
      onLocationSelect(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`, lat, lng)
    }
  }

  const handleMapClick = (lat: number, lng: number) => {
    // Constrain to Sri Lanka bounds
    if (lat < 5.9 || lat > 9.8 || lng < 79.6 || lng > 81.9) {
      alert('Please select a location within Sri Lanka')
      return
    }
    setMarkerPos({ lat, lng })
    reverseGeocode(lat, lng)
  }

  const handleMarkerDragEnd = (newLat: number, newLng: number) => {
    handleMapClick(newLat, newLng)
  }

  return (
    <div className="w-full h-full" key={mapKey}>
      <MapContainer
        key={`map-${mapKey}`}
        center={SRI_LANKA_CENTER}
        zoom={10}
        minZoom={8}
        maxZoom={18}
        style={{ width: '100%', height: '100%' }}
        className="leaflet-container"
        preferCanvas={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          maxNativeZoom={19}
        />
        <MapBoundsHandler />
        <MapClickHandler onMapClick={handleMapClick} />
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
            <div className="text-xs font-semibold whitespace-nowrap">
              <p>📍 Selected Location</p>
              <p>Lat: {markerPos.lat.toFixed(4)}</p>
              <p>Lng: {markerPos.lng.toFixed(4)}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  )
}
