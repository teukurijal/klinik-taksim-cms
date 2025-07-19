'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import Link from 'next/link'
import Image from 'next/image'
import { FiPlus, FiEdit, FiTrash2, FiEye } from 'react-icons/fi'
import { apiGet, apiDelete } from '@/utils/api'

interface Doctor {
  id: string
  full_name: string
  specialist: string
  status: 'active' | 'inactive'
  phone_number?: string
  email?: string
  photo_url?: string
  created_at: string
  schedule?: {
    [key: string]: { start: string; end: string } | null
  }
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const formatSchedule = (schedule?: { [key: string]: { start: string; end: string } | null }) => {
    if (!schedule) return 'No schedule set'
    
    const activeDays = Object.entries(schedule)
      .filter(([, times]) => times && times.start !== 'OFF')
      .map(([day, times]) => {
        const dayName = day.charAt(0).toUpperCase() + day.slice(1, 3)
        return times ? `${dayName} ${times.start}-${times.end}` : ''
      })
      .filter(Boolean)
    
    if (activeDays.length === 0) return 'No active days'
    if (activeDays.length > 3) return `${activeDays.slice(0, 2).join(', ')}, +${activeDays.length - 2} more`
    
    return activeDays.join(', ')
  }

  useEffect(() => {
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    try {
      const response = await apiGet('/api/doctors')
      const result = await response.json()

      if (response.ok) {
        setDoctors(result.data)
      } else {
        setError(result.error)
      }
    } catch {
      setError('Failed to fetch doctors')
    } finally {
      setLoading(false)
    }
  }

  const deleteDoctor = async (id: string) => {
    if (!confirm('Are you sure you want to delete this doctor?')) return

    try {
      const response = await apiDelete(`/api/doctors/${id}`)

      if (response.ok) {
        setDoctors(doctors.filter(doctor => doctor.id !== id))
      } else {
        const result = await response.json()
        setError(result.error)
      }
    } catch {
      setError('Failed to delete doctor')
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
          <h1 className="text-2xl font-bold text-gray-900">Doctor Management</h1>
          <Link
            href="/dashboard/doctors/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Add Doctor
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
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specialist
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Schedule
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
                {doctors.map((doctor) => (
                  <tr key={doctor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {doctor.photo_url ? (
                            <Image
                              className="h-10 w-10 rounded-full object-cover"
                              src={doctor.photo_url}
                              alt={doctor.full_name}
                              width={40}
                              height={40}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {doctor.full_name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {doctor.full_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{doctor.specialist}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {formatSchedule(doctor.schedule)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          doctor.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {doctor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          href={`/dashboard/doctors/${doctor.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FiEye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/dashboard/doctors/${doctor.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <FiEdit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => deleteDoctor(doctor.id)}
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

            {doctors.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500">No doctors found</div>
                <Link
                  href="/dashboard/doctors/create"
                  className="mt-2 text-blue-600 hover:text-blue-800"
                >
                  Add your first doctor
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}