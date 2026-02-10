'use client'

import React from 'react'
import { PulseLoader } from 'react-spinners'

interface LoaderProps {
  size?: number
  color?: string
  message?: string
}

export const Loader: React.FC<LoaderProps> = ({
  size = 15,
  color = '#FF6B35',
  message = 'Loading...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <PulseLoader color={color} size={size} />
      {message && <p className="mt-4 text-gray-600">{message}</p>}
    </div>
  )
}
