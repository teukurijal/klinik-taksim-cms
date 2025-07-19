'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { FiUpload, FiArrowLeft } from 'react-icons/fi'
import Link from 'next/link'
import Image from 'next/image'

export default function EditFacilityPage() {
  const router = useRouter()
  const params = useParams()
  const facilityId = params.id as string

  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [error, setError] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)

  const [formData, setFormData] = useState({
    image_url: '',
    title: '',
    description: ''
  })

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
        const facility = result.data
        setFormData({
          image_url: facility.image_url || '',
          title: facility.title || '',
          description: facility.description || ''
        })
      } else {
        setError(result.error)
      }
    } catch {
      setError('Failed to fetch facility')
    } finally {
      setFetchLoading(false)
    }
  }, [facilityId])

  useEffect(() => {
    fetchFacility()
  }, [fetchFacility])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)
      formDataUpload.append('folder', 'facilities')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      })

      const result = await response.json()

      if (response.ok) {
        setFormData(prev => ({ ...prev, image_url: result.data.url }))
      } else {
        setError(result.error)
      }
    } catch {
      setError('Failed to upload image')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!formData.image_url) {
      setError('Please upload an image')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`/api/facilities/${facilityId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        router.push('/dashboard/facilities')
      } else {
        setError(result.error)
      }
    } catch {
      setError('Failed to update facility photo')
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i}>
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
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
        <h1 className="text-2xl font-bold text-gray-900">Edit Facility Photo</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow mb-8">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facility Image *
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {formData.image_url ? (
                  <div className="mb-4">
                    <Image
                      src={formData.image_url}
                      alt="Facility image"
                      width={200}
                      height={150}
                      className="max-h-36 mx-auto rounded-lg object-cover"
                    />
                  </div>
                ) : (
                  <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                )}
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                    <span>{uploadingImage ? 'Uploading...' : 'Upload a new image'}</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter photo title (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter photo description (optional)"
            />
          </div>

          <div className="border-t border-gray-200 pt-6 mt-8">
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
              <Link
                href="/dashboard/facilities"
                className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading || uploadingImage || !formData.image_url}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Photo'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}