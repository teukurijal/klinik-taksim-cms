'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { FiTrash2, FiImage, FiPlus, FiEdit, FiEye } from 'react-icons/fi'
import Image from 'next/image'
import Link from 'next/link'
import { apiGet, apiDelete } from '@/utils/api'

interface FacilityPhoto {
  id: string
  image_url: string
  title?: string
  description?: string
  created_at: string
}

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<FacilityPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchFacilities()
  }, [])

  const fetchFacilities = async () => {
    try {
      const response = await apiGet('/api/facilities')
      const result = await response.json()

      if (response.ok) {
        setFacilities(result.data)
      } else {
        setError(result.error)
      }
    } catch {
      setError('Failed to fetch facilities')
    } finally {
      setLoading(false)
    }
  }


  const deleteFacility = async (id: string) => {
    if (!confirm('Are you sure you want to delete this facility photo?')) return

    try {
      const response = await apiDelete(`/api/facilities/${id}`)

      if (response.ok) {
        setFacilities(facilities.filter(facility => facility.id !== id))
      } else {
        const result = await response.json()
        setError(result.error)
      }
    } catch {
      setError('Failed to delete facility photo')
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Facility Photos</h1>
            <p className="text-gray-600 mt-2">Manage your clinic facility images</p>
          </div>
          <Link
            href="/dashboard/facilities/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Add Photo
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {facilities.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <FiImage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <div className="text-gray-500 mb-4">No facility photos found</div>
          <p className="text-sm text-gray-400">Click &quot;Add Photo&quot; to upload your first facility photo</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {facilities.map((facility) => (
            <div key={facility.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <Image
                src={facility.image_url}
                alt={facility.title || 'Facility photo'}
                width={400}
                height={192}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              
              <div className="p-4">
                {facility.title && (
                  <h3 className="text-sm font-medium text-gray-900 mb-1">
                    {facility.title}
                  </h3>
                )}
                {facility.description && (
                  <p className="text-xs text-gray-500 mb-2">
                    {facility.description}
                  </p>
                )}
                
                <div className="flex justify-between items-center mt-3">
                  <div className="flex space-x-2">
                    <Link
                      href={`/dashboard/facilities/${facility.id}`}
                      className="text-blue-600 hover:text-blue-900 p-1"
                      title="View photo"
                    >
                      <FiEye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/dashboard/facilities/${facility.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900 p-1"
                      title="Edit photo"
                    >
                      <FiEdit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => deleteFacility(facility.id)}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="Delete photo"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <span className="text-xs text-gray-400">
                    {new Date(facility.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}