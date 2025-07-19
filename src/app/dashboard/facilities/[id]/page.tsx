'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { FiArrowLeft, FiEdit, FiCalendar, FiImage, FiType, FiFileText } from 'react-icons/fi'
import Link from 'next/link'
import Image from 'next/image'

interface FacilityPhoto {
  id: string
  image_url: string
  title?: string
  description?: string
  created_at: string
  updated_at: string
}

export default function ViewFacilityPage() {
  const params = useParams()
  const facilityId = params.id as string
  
  const [facility, setFacility] = useState<FacilityPhoto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchFacility = useCallback(async () => {
    try {
      const response = await fetch(`/api/facilities/${facilityId}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const result = await response.json()

      if (response.ok) {
        setFacility(result.data)
      } else {
        setError(result.error)
      }
    } catch {
      setError('Failed to fetch facility')
    } finally {
      setLoading(false)
    }
  }, [facilityId])

  useEffect(() => {
    fetchFacility()
  }, [fetchFacility])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-6 mb-6">
              <div className="w-48 h-36 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i}>
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="mb-6">
          <Link
            href="/dashboard/facilities"
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to Facilities
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Facility Photo Details</h1>
        </div>

        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </DashboardLayout>
    )
  }

  if (!facility) {
    return (
      <DashboardLayout>
        <div className="mb-6">
          <Link
            href="/dashboard/facilities"
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to Facilities
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Facility Photo Details</h1>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
          Facility photo not found
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Link
          href="/dashboard/facilities"
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <FiArrowLeft className="w-4 h-4 mr-2" />
          Back to Facilities
        </Link>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Facility Photo Details</h1>
          <Link
            href={`/dashboard/facilities/${facility.id}/edit`}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FiEdit className="w-4 h-4 mr-2" />
            Edit Photo
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6">
          {/* Main Image Display */}
          <div className="flex flex-col lg:flex-row items-start space-y-6 lg:space-y-0 lg:space-x-8 mb-8">
            <div className="flex-shrink-0">
              <div className="w-full lg:w-96 h-72 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={facility.image_url}
                  alt={facility.title || 'Facility photo'}
                  width={384}
                  height={288}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {facility.title || 'Untitled Facility Photo'}
                </h2>
                
                {facility.description && (
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {facility.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <FiType className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <div className="text-sm font-medium text-gray-700">Title</div>
                  <div className="text-gray-900">{facility.title || 'No title'}</div>
                </div>
              </div>

              <div className="flex items-start">
                <FiFileText className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-700">Description</div>
                  <div className="text-gray-900">
                    {facility.description || 'No description'}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <FiCalendar className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <div className="text-sm font-medium text-gray-700">Created</div>
                  <div className="text-gray-900">{formatDate(facility.created_at)}</div>
                </div>
              </div>

              <div className="flex items-center">
                <FiCalendar className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <div className="text-sm font-medium text-gray-700">Last Updated</div>
                  <div className="text-gray-900">{formatDate(facility.updated_at)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Image Information */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Image Information</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center">
                <FiImage className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <div className="text-sm text-gray-600">Image URL</div>
                  <div className="text-xs text-gray-500 break-all font-mono">
                    {facility.image_url}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}