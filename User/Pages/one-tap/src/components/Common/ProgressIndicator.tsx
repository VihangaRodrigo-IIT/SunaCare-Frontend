'use client'

import React from 'react'

interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
  steps: string[]
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
  steps,
}) => {
  return (
    <div className="bg-white border-b border-gray-200 p-4">
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-semibold text-gray-900">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-gray-600">
            {Math.round((currentStep / totalSteps) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step labels */}
      <div className="flex justify-between gap-2">
        {steps.map((step, index) => (
          <div key={index} className="flex-1 text-center">
            <div
              className={`inline-flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-semibold transition-all ${
                index < currentStep
                  ? 'bg-primary-500 border-primary-500 text-white'
                  : index === currentStep - 1
                  ? 'bg-white border-primary-500 text-primary-500'
                  : 'bg-white border-gray-300 text-gray-500'
              }`}
            >
              {index < currentStep ? '✓' : index + 1}
            </div>
            <p className="text-xs text-gray-600 mt-1 truncate">{step}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
