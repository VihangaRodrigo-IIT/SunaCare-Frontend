'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { FiAlertTriangle } from 'react-icons/fi'

export const ReportButton: React.FC = () => {
  const router = useRouter()

  const handleStartReport = () => {
    router.push('/report/start')
  }

  return (
    <button
      onClick={handleStartReport}
      className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 active:bg-primary-700 transition-colors button-touch"
    >
      <FiAlertTriangle size={20} />
      Report Animal Emergency
    </button>
  )
}
