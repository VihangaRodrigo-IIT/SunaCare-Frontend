'use client'

import React from 'react'
import { FiCheck } from 'react-icons/fi'
import { SeverityLevel } from '@/types/report'

const SEVERITY_LEVELS: {
  value: SeverityLevel
  label: string
  description: string
  color: string
  bgColor: string
}[] = [
  {
    value: 'critical',
    label: 'Critical',
    description: 'Immediate danger to life',
    color: 'text-critical',
    bgColor: 'bg-red-50 border-critical',
  },
  {
    value: 'moderate',
    label: 'Moderate',
    description: 'Requires urgent attention',
    color: 'text-moderate',
    bgColor: 'bg-orange-50 border-moderate',
  },
  {
    value: 'minor',
    label: 'Minor',
    description: 'Non-urgent, can wait',
    color: 'text-minor',
    bgColor: 'bg-blue-50 border-minor',
  },
]

interface SeveritySelectorProps {
  selected: SeverityLevel | null
  onSelect: (severity: SeverityLevel) => void
}

export const SeveritySelector: React.FC<SeveritySelectorProps> = ({
  selected,
  onSelect,
}) => {
  return (
    <div className="space-y-3">
      {SEVERITY_LEVELS.map((level) => (
        <button
          key={level.value}
          onClick={() => onSelect(level.value)}
          className={`w-full p-4 rounded-lg border-2 text-left transition-all button-touch ${
            selected === level.value
              ? `${level.bgColor} border-2 border-current`
              : `bg-white border-gray-200 hover:border-gray-300`
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className={`font-semibold ${level.color}`}>{level.label}</h3>
              <p className="text-sm text-gray-600 mt-1">{level.description}</p>
            </div>
            {selected === level.value && (
              <div className={`bg-current rounded-full p-1 ${level.color}`}>
                <FiCheck className="text-white" size={16} />
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  )
}
