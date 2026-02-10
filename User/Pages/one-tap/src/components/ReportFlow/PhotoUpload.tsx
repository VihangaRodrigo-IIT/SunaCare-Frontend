'use client'

import React, { useRef } from 'react'
import { FiUpload, FiX } from 'react-icons/fi'

interface PhotoUploadProps {
  photos: string[]
  onAdd: (url: string) => void
  onRemove: (index: number) => void
  isLoading?: boolean
  maxPhotos?: number
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  photos,
  onAdd,
  onRemove,
  isLoading = false,
  maxPhotos = 5,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    // In a real app, upload to server and get URL
    const reader = new FileReader()
    reader.onloadend = () => {
      const url = reader.result as string
      onAdd(url)
    }
    reader.readAsDataURL(file)

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      {photos.length < maxPhotos && (
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary-500 hover:bg-primary-50 transition-colors disabled:opacity-50 button-touch"
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <FiUpload
              className="text-gray-400 group-hover:text-primary-500"
              size={24}
            />
            <p className="font-semibold text-gray-900">
              {isLoading ? 'Uploading...' : 'Add Photo'}
            </p>
            <p className="text-sm text-gray-600">
              {photos.length} of {maxPhotos} photos
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isLoading}
          />
        </button>
      )}

      {/* Photo preview grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((photo, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img
                src={photo}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => onRemove(index)}
                className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors button-touch"
              >
                <FiX size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
