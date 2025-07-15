'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { FiArrowLeft, FiEdit, FiPhone, FiMail, FiMapPin, FiUser, FiCalendar } from 'react-icons/fi'
import Link from 'next/link'

interface Doctor {
  id: string
  full_name: string
  specialist: string
  education: string
  experience: string
  schedule: { [key: string]: { start: string; end: string } | null }
  str_number: string
  sip_number: string
  phone_number: string
  email: string
  gender: 'male' | 'female'
  years_of_practice: number
  clinic_room: string
  status: 'active' | 'inactive'
  photo_url: string
  created_at: string
}

export default function ViewDoctorPage() {
  const params = useParams()
  const doctorId = params.id as string
  
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDoctor()
  }, [doctorId])

  const fetchDoctor = async () => {
    try {
      const response = await fetch(`/api/doctors/${doctorId}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const result = await response.json()

      if (response.ok) {
        setDoctor(result.data)
      } else {
        setError(result.error)
      }
    } catch {
      setError('Failed to fetch doctor')
    } finally {
      setLoading(false)
    }
  }

  const formatSchedule = (schedule: { [key: string]: { start: string; end: string } | null }) => {
    if (!schedule) return 'No schedule set'
    
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    
    return days.map((day, index) => {
      const daySchedule = schedule[day]
      if (!daySchedule || daySchedule.start === 'OFF' || !daySchedule.start) {
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-6 mb-6">
              <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i}>
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !doctor) {
    return (
      <DashboardLayout>
        <div className="mb-6">
          <Link
            href="/dashboard/doctors"
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to Doctors
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Doctor Details</h1>
        </div>

        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error || 'Doctor not found'}
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Link
          href="/dashboard/doctors"
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <FiArrowLeft className="w-4 h-4 mr-2" />
          Back to Doctors
        </Link>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Doctor Details</h1>
          <Link
            href={`/dashboard/doctors/${doctor.id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <FiEdit className="w-4 h-4 mr-2" />
            Edit Doctor
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex items-center space-x-6 mb-8">
            <div className="flex-shrink-0">
              {doctor.photo_url ? (
                <img
                  className="w-20 h-20 rounded-full object-cover"
                  src={doctor.photo_url}
                  alt={doctor.full_name}
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
                  <FiUser className="w-8 h-8 text-gray-600" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{doctor.full_name}</h2>
              <p className="text-lg text-gray-600 mb-2">{doctor.specialist}</p>
              <div className="flex items-center space-x-4">
                <span
                  className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    doctor.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {doctor.status.charAt(0).toUpperCase() + doctor.status.slice(1)}
                </span>
                {doctor.years_of_practice && (
                  <span className="text-sm text-gray-500">
                    {doctor.years_of_practice} years of practice
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  {doctor.phone_number && (
                    <div className="flex items-center">
                      <FiPhone className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-gray-700">{doctor.phone_number}</span>
                    </div>
                  )}
                  {doctor.email && (
                    <div className="flex items-center">
                      <FiMail className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-gray-700">{doctor.email}</span>
                    </div>
                  )}
                  {doctor.clinic_room && (
                    <div className="flex items-center">
                      <FiMapPin className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-gray-700">{doctor.clinic_room}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <FiUser className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-gray-700 capitalize">{doctor.gender}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
                <div className="space-y-3">
                  {doctor.str_number && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">STR Number:</span>
                      <p className="text-gray-700">{doctor.str_number}</p>
                    </div>
                  )}
                  {doctor.sip_number && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">SIP Number:</span>
                      <p className="text-gray-700">{doctor.sip_number}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiCalendar className="w-5 h-5 mr-2" />
                  Weekly Schedule
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  {formatSchedule(doctor.schedule).length > 0 ? (
                    <div className="space-y-1">
                      {formatSchedule(doctor.schedule)}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No schedule available</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {doctor.education && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Education</h3>
              <p className="text-gray-700 leading-relaxed">{doctor.education}</p>
            </div>
          )}

          {doctor.experience && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Experience</h3>
              <p className="text-gray-700 leading-relaxed">{doctor.experience}</p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Created: {new Date(doctor.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}