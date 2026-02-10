'use client'

import React, { useState } from 'react'
import { FiMapPin } from 'react-icons/fi'

interface AddressSearchBarProps {
  value: string
  onChange: (address: string, lat: number, lng: number) => void
  error?: string
  placeholder?: string
}

export const AddressSearchBar: React.FC<AddressSearchBarProps> = ({
  value,
  onChange,
  error,
  placeholder = 'Search for location...',
}) => {
  const [isSearching, setIsSearching] = useState(false)
  const [suggestions, setSuggestions] = useState<Array<{ name: string; lat: number; lon: number }>>([])

  const handleSearchAddress = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([])
      return
    }

    setIsSearching(true)
    try {
      // Use Nominatim (OpenStreetMap) for geocoding - completely free
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
        {
          headers: {
            'User-Agent': 'OneTabAnimalReport/1.0'
          }
        }
      )
      const data = await response.json()
      setSuggestions(data.map((item: any) => ({
        name: item.display_name,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
      })))
    } catch (error) {
      console.error('Search error:', error)
      setSuggestions([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelectSuggestion = (suggestion: typeof suggestions[0]) => {
    onChange(suggestion.name, suggestion.lat, suggestion.lon)
    setSuggestions([])
  }

  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      return
    }

    setIsSearching(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        
        try {
          // Use Nominatim reverse geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                'User-Agent': 'OneTabAnimalReport/1.0'
              }
            }
          )
          const data = await response.json()
          onChange(data.display_name || `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`, latitude, longitude)
        } catch (error) {
          console.error('Reverse geocoding error:', error)
          onChange(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`, latitude, longitude)
        }
        setIsSearching(false)
      },
      (error) => {
        console.error('Geolocation error:', error)
        alert('Unable to get your location. Please try again.')
        setIsSearching(false)
      }
    )
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-900">
        Location
      </label>
      <div className="space-y-2">
        <div className="relative">
          <input
            type="text"
            value={value}
            placeholder={placeholder}
            onChange={(e) => handleSearchAddress(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg font-sans text-base transition-colors ${
              error
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 bg-white'
            }`}
          />
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10 max-h-48 overflow-y-auto">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b last:border-b-0 text-sm"
                >
                  {suggestion.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleUseCurrentLocation}
          disabled={isSearching}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-semibold transition-colors disabled:opacity-50 button-touch"
        >
          <FiMapPin size={20} />
          {isSearching ? 'Getting location...' : 'Use Current Location'}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
