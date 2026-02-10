'use client'

import React from 'react'
import { FiCheck } from 'react-icons/fi'
import { AnimalType } from '@/types/report'

const ANIMAL_TYPES: { value: AnimalType; label: string; emoji: string }[] = [
  { value: 'dog', label: 'Dog', emoji: '🐕' },
  { value: 'cat', label: 'Cat', emoji: '🐱' },
  { value: 'bird', label: 'Bird', emoji: '🦅' },
  { value: 'cattle', label: 'Cattle', emoji: '🐄' },
  { value: 'other', label: 'Other', emoji: '🦁' },
]

interface AnimalTypeSelectorProps {
  selected: AnimalType | null
  onSelect: (type: AnimalType) => void
}

export const AnimalTypeSelector: React.FC<AnimalTypeSelectorProps> = ({
  selected,
  onSelect,
}) => {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {ANIMAL_TYPES.map((animal) => (
        <button
          key={animal.value}
          onClick={() => onSelect(animal.value)}
          className={`relative p-4 rounded-lg border-2 transition-all button-touch ${
            selected === animal.value
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="text-3xl mb-2">{animal.emoji}</div>
          <div className="font-semibold text-sm text-gray-900">
            {animal.label}
          </div>
          {selected === animal.value && (
            <div className="absolute top-2 right-2 bg-primary-500 rounded-full p-1">
              <FiCheck className="text-white" size={16} />
            </div>
          )}
        </button>
      ))}
    </div>
  )
}
