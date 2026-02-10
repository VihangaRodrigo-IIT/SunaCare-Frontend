'use client'

import React from 'react'
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi'

interface ErrorMessageProps {
  message: string
  onClose?: () => void
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onClose,
}) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
      <FiAlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
      <div className="flex-1">
        <p className="text-red-800 text-sm">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-red-600 hover:text-red-800 flex-shrink-0"
        >
          ×
        </button>
      )}
    </div>
  )
}

interface SuccessMessageProps {
  message: string
  onClose?: () => void
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  message,
  onClose,
}) => {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
      <FiCheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
      <div className="flex-1">
        <p className="text-green-800 text-sm">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-green-600 hover:text-green-800 flex-shrink-0"
        >
          ×
        </button>
      )}
    </div>
  )
}
