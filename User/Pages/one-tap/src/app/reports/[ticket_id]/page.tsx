'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Loader } from '@/components/Common/Loader'
import { ErrorMessage } from '@/components/Common/ErrorMessage'
import { FiArrowLeft, FiCalendar, FiMapPin, FiAlertTriangle } from 'react-icons/fi'
import Link from 'next/link'

interface Report {
  id: string
  ticketId: string
  animal: {
    type: string
    description: string
    photos: string[]
  }
  severity: string
  status: 'pending' | 'confirmed' | 'in-progress' | 'resolved'
  location: {
    address: string
    latitude: number
    longitude: number
  }
  createdAt: string
  lastUpdate: string
  rescuerAssigned?: string
  notes?: string
}

const SEVERITY_COLORS = {
  critical: 'bg-red-100 text-red-800 border-red-300',
  moderate: 'bg-orange-100 text-orange-800 border-orange-300',
  minor: 'bg-blue-100 text-blue-800 border-blue-300',
}

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  'in-progress': 'bg-orange-100 text-orange-800',
  resolved: 'bg-green-100 text-green-800',
}

export default function ReportStatusPage() {
  const params = useParams()
  const ticketId = params.ticket_id as string
  const [report, setReport] = useState<Report | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadReport = async () => {
      try {
        setIsLoading(true)

        // In a real app, fetch from API
        // const response = await apiClient.getReport(ticketId)
        // setReport(response.data)

        // Mock data
        const mockReport: Report = {
          id: '1',
          ticketId,
          animal: {
            type: 'dog',
            description: 'Brown and white puppy, appears injured',
            photos: [],
          },
          severity: 'critical',
          status: 'confirmed',
          location: {
            address: '123 Main Street, City, Country',
            latitude: 6.9271,
            longitude: 80.7789,
          },
          createdAt: new Date().toISOString(),
          lastUpdate: new Date().toISOString(),
          rescuerAssigned: 'John - Animal Rescue Team',
          notes: 'Team dispatched, ETA 15 minutes',
        }

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setReport(mockReport)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load report'
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadReport()
  }, [ticketId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-white border-b border-gray-200 p-4">
          <Link href="/" className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600">
            <FiArrowLeft size={20} />
            Back
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <Loader message="Loading report..." />
        </div>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-white border-b border-gray-200 p-4">
          <Link href="/" className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600">
            <FiArrowLeft size={20} />
            Back
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <ErrorMessage message={error || 'Report not found'} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600">
            <FiArrowLeft size={20} />
            Back
          </Link>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${STATUS_COLORS[report.status]}`}>
            {report.status.charAt(0).toUpperCase() + report.status.slice(1).replace('-', ' ')}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Ticket ID */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Ticket ID:</p>
          <p className="text-2xl font-mono font-bold text-gray-900 break-all">
            {report.ticketId}
          </p>
        </div>

        {/* Status Timeline */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-4">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <FiAlertTriangle size={20} />
            Status Update
          </h2>

          <div className="space-y-3">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-100 text-green-600 font-bold">
                  ✓
                </div>
              </div>
              <div className="pt-1">
                <p className="font-semibold text-gray-900">Report Received</p>
                <p className="text-sm text-gray-600">
                  {new Date(report.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {['pending', 'confirmed', 'in-progress', 'resolved'].indexOf(
              report.status
            ) >= 1 && (
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-100 text-green-600 font-bold">
                    ✓
                  </div>
                </div>
                <div className="pt-1">
                  <p className="font-semibold text-gray-900">Report Confirmed</p>
                  <p className="text-sm text-gray-600">
                    {new Date(report.lastUpdate).toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {['in-progress', 'resolved'].indexOf(report.status) >= 0 && (
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600 font-bold">
                    {report.status === 'resolved' ? '✓' : '→'}
                  </div>
                </div>
                <div className="pt-1">
                  <p className="font-semibold text-gray-900">Rescue in Progress</p>
                  <p className="text-sm text-gray-600">
                    Rescuer: {report.rescuerAssigned || 'Being assigned'}
                  </p>
                  {report.notes && (
                    <p className="text-sm text-gray-600 mt-2">{report.notes}</p>
                  )}
                </div>
              </div>
            )}

            {report.status === 'resolved' && (
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-100 text-green-600 font-bold">
                    ✓
                  </div>
                </div>
                <div className="pt-1">
                  <p className="font-semibold text-gray-900">Animal Rescued</p>
                  <p className="text-sm text-gray-600">
                    Thank you for your report!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Animal Details */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-4">
          <h2 className="font-bold text-gray-900">Animal Details</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase">Type</p>
              <p className="text-gray-900 capitalize">{report.animal.type}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase">Severity</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  SEVERITY_COLORS[report.severity as keyof typeof SEVERITY_COLORS]
                }`}
              >
                {report.severity.charAt(0).toUpperCase() +
                  report.severity.slice(1)}
              </span>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-600 uppercase mb-2">
              Description
            </p>
            <p className="text-gray-900">{report.animal.description}</p>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-4">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <FiMapPin size={20} />
            Location
          </h2>
          <p className="text-gray-900">{report.location.address}</p>
          <p className="text-sm text-gray-600">
            {report.location.latitude.toFixed(4)},{' '}
            {report.location.longitude.toFixed(4)}
          </p>
        </div>

        {/* Contact Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="font-bold text-blue-900 mb-3">Need Help?</h2>
          <p className="text-blue-900 text-sm mb-3">
            If the situation changes or there's an update, contact us:
          </p>
          <p className="font-bold text-blue-900">
            Emergency Hotline: 1-800-ANIMAL-1
          </p>
        </div>
      </main>
    </div>
  )
}
