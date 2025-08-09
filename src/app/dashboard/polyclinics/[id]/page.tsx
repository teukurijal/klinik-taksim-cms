'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import Link from 'next/link'
import { FiEdit, FiArrowLeft, FiUsers, FiMapPin, FiPhone, FiMail, FiClock, FiList } from 'react-icons/fi'
import { apiGet } from '@/utils/api'

interface WorkingHours {
  [key: string]: {
    start: string
    end: string
    available: boolean
  }
}

interface PolyClinic {
  id: string
  name: string
  description: string
  status: 'active' | 'inactive'
  head: string
  location?: string
  phone_number?: string
  email?: string
  working_hours?: WorkingHours | string | null
  capacity?: number
  services?: string[]
  created_at: string
  updated_at: string
}

const formatWorkingHours = (workingHours: WorkingHours | string | null) => {
  if (!workingHours) return []
  
  // Handle if working hours is a string (parse it)
  let parsedHours = workingHours
  if (typeof workingHours === 'string') {
    try {
      parsedHours = JSON.parse(workingHours)
    } catch {
      // If it's just a plain string, return empty array
      return []
    }
  }
  
  // Ensure we have an object
  if (typeof parsedHours !== 'object' || parsedHours === null) {
    return []
  }
  
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  
  return days.map((day, index) => {
    const daySchedule = parsedHours[day]
    
    // Check if day schedule exists and has the expected structure
    if (!daySchedule || 
        typeof daySchedule !== 'object' || 
        !daySchedule.available || 
        !daySchedule.start || 
        !daySchedule.end) {
      return null
    }
    
    return (
      <div key={day} className="flex justify-between py-1">
        <span className="font-medium">{dayNames[index]}:</span>
        <span>{daySchedule.start} - {daySchedule.end}</span>
      </div>
    )
  }).filter(Boolean)
}

export default function PolyClinicDetailPage() {
  const params = useParams()
  const [polyClinic, setPolyClinic] = useState<PolyClinic | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchPolyClinic = useCallback(async () => {
    try {
      const response = await apiGet(`/api/polyclinics/${params.id}`)
      const result = await response.json()

      if (response.ok) {
        setPolyClinic(result.data)
      } else {
        setError(result.error)
      }
    } catch {
      setError('Failed to fetch polyclinic details')
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    if (params.id) {
      fetchPolyClinic()
    }
  }, [params.id, fetchPolyClinic])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !polyClinic) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error || 'Poly clinic not found'}
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard/polyclinics"
              className="text-gray-500 hover:text-gray-700"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{polyClinic.name}</h1>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                polyClinic.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {polyClinic.status}
            </span>
          </div>
          <Link
            href={`/dashboard/polyclinics/${polyClinic.id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <FiEdit className="w-4 h-4 mr-2" />
            Edit
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Description</label>
                  <p className="mt-1 text-sm text-gray-900">{polyClinic.description}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <FiUsers className="w-4 h-4 text-gray-400" />
                  <label className="block text-sm font-medium text-gray-500">Head</label>
                </div>
                <p className="ml-6 text-sm text-gray-900">{polyClinic.head}</p>

                {polyClinic.location && (
                  <>
                    <div className="flex items-center space-x-2">
                      <FiMapPin className="w-4 h-4 text-gray-400" />
                      <label className="block text-sm font-medium text-gray-500">Location</label>
                    </div>
                    <p className="ml-6 text-sm text-gray-900">{polyClinic.location}</p>
                  </>
                )}

              </div>
            </div>
          </div>

          {polyClinic.services && polyClinic.services.length > 0 && (
            <div className="bg-white rounded-lg shadow mt-6">
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <FiList className="w-5 h-5 text-gray-400" />
                  <h2 className="text-lg font-semibold text-gray-900">Services</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {polyClinic.services.map((service, index) => (
                    <div
                      key={index}
                      className="bg-blue-50 text-blue-800 px-3 py-2 rounded-lg text-sm"
                    >
                      {service}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
              
              <div className="space-y-4">
                {polyClinic.phone_number && (
                  <div className="flex items-center space-x-3">
                    <FiPhone className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-sm text-gray-900">{polyClinic.phone_number}</p>
                    </div>
                  </div>
                )}

                {polyClinic.email && (
                  <div className="flex items-center space-x-3">
                    <FiMail className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-sm text-gray-900">{polyClinic.email}</p>
                    </div>
                  </div>
                )}

                {polyClinic.capacity && (
                  <div className="flex items-center space-x-3">
                    <FiUsers className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Capacity</p>
                      <p className="text-sm text-gray-900">{polyClinic.capacity} patients</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {polyClinic.working_hours && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiClock className="w-5 h-5 mr-2" />
                  Working Hours
                </h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  {formatWorkingHours(polyClinic.working_hours).length > 0 ? (
                    <div className="space-y-1">
                      {formatWorkingHours(polyClinic.working_hours)}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No working hours available</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">System Information</h2>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Created</p>
                  <p className="text-sm text-gray-900">
                    {new Date(polyClinic.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Updated</p>
                  <p className="text-sm text-gray-900">
                    {new Date(polyClinic.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}