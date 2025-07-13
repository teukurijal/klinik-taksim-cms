'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { FiUpload, FiTrash2, FiImage } from 'react-icons/fi'

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
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchFacilities()
  }, [])

  const fetchFacilities = async () => {
    try {
      const response = await fetch('/api/facilities')
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)
      formDataUpload.append('folder', 'facilities')

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      })

      const uploadResult = await uploadResponse.json()

      if (uploadResponse.ok) {
        const response = await fetch('/api/facilities', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image_url: uploadResult.data.url,
            title: file.name.split('.')[0],
          }),
        })

        const result = await response.json()

        if (response.ok) {
          setFacilities([result.data[0], ...facilities])
        } else {
          setError(result.error)
        }
      } else {
        setError(uploadResult.error)
      }
    } catch {
      setError('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const deleteFacility = async (id: string) => {
    if (!confirm('Are you sure you want to delete this facility photo?')) return

    try {
      const response = await fetch(`/api/facilities/${id}`, {
        method: 'DELETE',
      })

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
        <h1 className="text-2xl font-bold text-gray-900">Facility Photos</h1>
        <p className="text-gray-600 mt-2">Manage your clinic facility images</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="mb-6">
        <div className="max-w-lg">
          <label className="flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
            <span className="flex items-center space-x-2">
              <FiUpload className="w-6 h-6 text-gray-600" />
              <span className="font-medium text-gray-600">
                {uploading ? 'Uploading...' : 'Drop files to upload, or browse'}
              </span>
            </span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {facilities.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <FiImage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <div className="text-gray-500 mb-4">No facility photos found</div>
          <p className="text-sm text-gray-400">Upload your first facility photo above</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {facilities.map((facility) => (
            <div key={facility.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="relative group">
                <img
                  src={facility.image_url}
                  alt={facility.title || 'Facility photo'}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded-t-lg">
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => deleteFacility(facility.id)}
                      className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                      title="Delete photo"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
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
                <p className="text-xs text-gray-400">
                  {new Date(facility.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}