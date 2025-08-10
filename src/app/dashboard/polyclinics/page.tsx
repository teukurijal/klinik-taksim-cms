'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import Link from 'next/link'
import { FiPlus, FiEdit, FiTrash2, FiEye, FiUsers } from 'react-icons/fi'
import { apiGet, apiDelete } from '@/utils/api'

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
}

const formatWorkingHours = (workingHours?: WorkingHours | string | null) => {
  if (!workingHours) return 'Not specified'
  
  // Handle if working hours is a string (parse it)
  let parsedHours: WorkingHours | null = null
  if (typeof workingHours === 'string') {
    try {
      parsedHours = JSON.parse(workingHours)
    } catch {
      return 'Not specified'
    }
  } else if (typeof workingHours === 'object' && workingHours !== null) {
    parsedHours = workingHours
  }
  
  if (!parsedHours || typeof parsedHours !== 'object') {
    return 'Not specified'
  }
  
  const availableDays = Object.entries(parsedHours)
    .filter(([, hours]) => hours && hours.available && hours.start && hours.end)
    .map(([day, hours]) => `${day.charAt(0).toUpperCase() + day.slice(1)}: ${hours.start}-${hours.end}`)
  
  if (availableDays.length === 0) return 'Not specified'
  if (availableDays.length <= 2) return availableDays.join(', ')
  
  return `${availableDays.length} days configured`
}

export default function PolyClinicsPage() {
  const [polyClinics, setPolyClinics] = useState<PolyClinic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPolyClinics()
  }, [])

  const fetchPolyClinics = async () => {
    try {
      const response = await apiGet('/api/polyclinics')
      const result = await response.json()

      if (response.ok) {
        setPolyClinics(result.data)
      } else {
        setError(result.error)
      }
    } catch {
      setError('Failed to fetch polyclinics')
    } finally {
      setLoading(false)
    }
  }

  const deletePolyClinic = async (id: string) => {
    if (!confirm('Are you sure you want to delete this polyclinic?')) return

    try {
      const response = await apiDelete(`/api/polyclinics/${id}`)

      if (response.ok) {
        setPolyClinics(polyClinics.filter(pc => pc.id !== id))
      } else {
        const result = await response.json()
        setError(result.error)
      }
    } catch {
      setError('Failed to delete polyclinic')
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Poly Clinic Management</h1>
          <Link
            href="/dashboard/polyclinics/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Add Poly Clinic
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Poly Clinic
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Working Hours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {polyClinics.map((polyClinic) => (
                  <tr key={polyClinic.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <FiUsers className="w-5 h-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {polyClinic.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {polyClinic.description.length > 50 
                              ? `${polyClinic.description.substring(0, 50)}...` 
                              : polyClinic.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs">
                        <div title={formatWorkingHours(polyClinic.working_hours)}>
                          {formatWorkingHours(polyClinic.working_hours)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          polyClinic.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {polyClinic.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          href={`/dashboard/polyclinics/${polyClinic.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FiEye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/dashboard/polyclinics/${polyClinic.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <FiEdit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => deletePolyClinic(polyClinic.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {polyClinics.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500">No polyclinics found</div>
                <Link
                  href="/dashboard/polyclinics/create"
                  className="mt-2 text-blue-600 hover:text-blue-800"
                >
                  Add your first polyclinic
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}