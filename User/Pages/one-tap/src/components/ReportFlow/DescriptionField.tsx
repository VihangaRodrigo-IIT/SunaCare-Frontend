'use client'

import React from 'react'

interface DescriptionFieldProps {
  value: string
  onChange: (value: string) => void
  error?: string
  placeholder?: string
  maxLength?: number
}

export const DescriptionField: React.FC<DescriptionFieldProps> = ({
  value,
  onChange,
  error,
  placeholder = 'Describe what you see and what help is needed...',
  maxLength = 1000,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-900">
        Description
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={5}
        className={`w-full px-4 py-3 border rounded-lg font-sans text-base transition-colors ${
          error
            ? 'border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500'
            : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500'
        }`}
      />
      <div className="flex items-center justify-between">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <p className="text-xs text-gray-600 ml-auto">
          {value.length} / {maxLength}
        </p>
      </div>
    </div>
  )
}
