'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiCheckCircle, FiArrowRight } from 'react-icons/fi'

export default function SuccessPage() {
  const router = useRouter()
  const [ticketId, setTicketId] = useState<string | null>(null)

  useEffect(() => {
    const storedTicketId = sessionStorage.getItem('reportTicketId')
    if (storedTicketId) {
      setTicketId(storedTicketId)
    }
  }, [])

  const handleViewReport = () => {
    if (ticketId) {
      router.push(`/reports/${ticketId}`)
    }
  }

  const handleGoHome = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-green-100 rounded-full p-4">
            <FiCheckCircle className="text-success text-6xl" />
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Report Submitted!
          </h1>
          <p className="text-gray-600">
            Thank you for reporting the animal emergency. Our team will respond as quickly as possible.
          </p>
        </div>

        {ticketId && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Your Ticket ID:</p>
            <p className="text-lg font-mono font-bold text-gray-900 break-all">
              {ticketId}
            </p>
            <p className="text-xs text-gray-600 mt-2">
              Save this ID to track your report
            </p>
          </div>
        )}

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-blue-900">
            We will send you updates via SMS and email about the status of your report.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleViewReport}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 active:bg-primary-700 transition-colors button-touch"
          >
            View Report Status
            <FiArrowRight size={20} />
          </button>
          <button
            onClick={handleGoHome}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-900 rounded-lg font-semibold hover:bg-gray-200 active:bg-gray-300 transition-colors button-touch"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}
