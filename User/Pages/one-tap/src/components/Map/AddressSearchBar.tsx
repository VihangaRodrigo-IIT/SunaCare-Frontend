'use client'

import React, { useState, useEffect, useRef } from 'react'
import { FiMapPin, FiSearch, FiNavigation } from 'react-icons/fi'

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
  const [searchQuery, setSearchQuery] = useState(value)
  const [isSearching, setIsSearching] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const [suggestions, setSuggestions] = useState<Array<{ name: string; lat: number; lon: number }>>([])
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // Sync local search query when parent value changes (e.g. from map click)
  useEffect(() => {
    setSearchQuery(value)
  }, [value])

  const fetchSuggestions = async (query: string) => {
    if (!query.trim() || query.trim().length < 3) {
      setSuggestions([])
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=lk`,
        {
          headers: {
            'User-Agent': 'SunaCareApp/1.0'
          }
        }
      )
      const data = await response.json()
      setSuggestions(data.map((item: any) => ({
        name: item.display_name,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
      })))
    } catch (err) {
      console.error('Search error:', err)
      setSuggestions([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    // Debounce API calls - wait 400ms after user stops typing
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(query)
    }, 400)
  }

  const handleSelectSuggestion = (suggestion: typeof suggestions[0]) => {
    setSearchQuery(suggestion.name)
    onChange(suggestion.name, suggestion.lat, suggestion.lon)
    setSuggestions([])
  }

  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      return
    }

    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                'User-Agent': 'SunaCareApp/1.0'
              }
            }
          )
          const data = await response.json()
          const addr = data.display_name || `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`
          setSearchQuery(addr)
          onChange(addr, latitude, longitude)
        } catch (err) {
          console.error('Reverse geocoding error:', err)
          const addr = `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`
          setSearchQuery(addr)
          onChange(addr, latitude, longitude)
        }
        setIsLocating(false)
      },
      (err) => {
        console.error('Geolocation error:', err)
        alert('Unable to get your location. Please enable location access and try again.')
        setIsLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-900">
        Search Location
      </label>
      <div className="space-y-2">
        <div className="relative">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              placeholder={placeholder}
              onChange={handleSearchChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg font-sans text-base transition-colors ${
                error
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
              }`}
            />
            {isSearching && (
              <div className="absolute right-3 top-3.5">
                <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-50 max-h-48 overflow-y-auto">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="w-full text-left px-4 py-3 hover:bg-orange-50 border-b last:border-b-0 text-sm text-gray-700 hover:text-orange-900 transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <FiMapPin className="mt-0.5 text-orange-400 flex-shrink-0" size={16} />
                    <span>{suggestion.name}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded-lg font-semibold transition-colors disabled:opacity-50 button-touch"
        >
          <FiNavigation size={18} />
          {isLocating ? 'Getting location...' : 'Use Current Location'}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}