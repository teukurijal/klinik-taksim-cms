'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { FiUpload, FiTrash2, FiEdit, FiExternalLink, FiImage } from 'react-icons/fi'
import Image from 'next/image'

interface Partner {
  id: string
  name?: string
  image_url: string
  link?: string
  created_at: string
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    link: '',
    image_url: ''
  })

  useEffect(() => {
    fetchPartners()
  }, [])

  const fetchPartners = async () => {
    try {
      const response = await fetch('/api/partners')
      const result = await response.json()

      if (response.ok) {
        setPartners(result.data)
      } else {
        setError(result.error)
      }
    } catch {
      setError('Failed to fetch partners')
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
      formDataUpload.append('folder', 'partners')

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      })

      const uploadResult = await uploadResponse.json()

      if (uploadResponse.ok) {
        const response = await fetch('/api/partners', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image_url: uploadResult.data.url,
            name: file.name.split('.')[0],
          }),
        })

        const result = await response.json()

        if (response.ok) {
          setPartners([result.data[0], ...partners])
        } else {
          setError(result.error)
        }
      } else {
        setError(uploadResult.error)
      }
    } catch {
      setError('Failed to upload partner logo')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch(`/api/partners/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        setPartners(partners.map(p => p.id === editingId ? result.data[0] : p))
        resetForm()
      } else {
        setError(result.error)
      }
    } catch {
      setError('Failed to update partner')
    }
  }

  const deletePartner = async (id: string) => {
    if (!confirm('Are you sure you want to delete this partner?')) return

    try {
      const response = await fetch(`/api/partners/${id}`, { method: 'DELETE' })
      if (response.ok) {
        setPartners(partners.filter(p => p.id !== id))
      } else {
        const result = await response.json()
        setError(result.error)
      }
    } catch {
      setError('Failed to delete partner')
    }
  }

  const resetForm = () => {
    setFormData({ name: '', link: '', image_url: '' })
    setShowForm(false)
    setEditingId(null)
  }

  const editPartner = (partner: Partner) => {
    setFormData({
      name: partner.name || '',
      link: partner.link || '',
      image_url: partner.image_url
    })
    setEditingId(partner.id)
    setShowForm(true)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-4">
                <div className="h-20 bg-gray-200 rounded"></div>
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
        <h1 className="text-2xl font-bold text-gray-900">Partner Management</h1>
        <p className="text-gray-600 mt-2">Manage your clinic partners and their logos</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-lg shadow mb-6">
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Partner Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter partner name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://partner-website.com"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={resetForm} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Update Partner
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-6">
        <div className="max-w-lg">
          <label className="flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
            <span className="flex items-center space-x-2">
              <FiUpload className="w-6 h-6 text-gray-600" />
              <span className="font-medium text-gray-600">
                {uploading ? 'Uploading...' : 'Upload partner logo'}
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

      {partners.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <FiImage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <div className="text-gray-500 mb-4">No partners found</div>
          <p className="text-sm text-gray-400">Upload your first partner logo above</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {partners.map((partner) => (
            <div key={partner.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="relative group">
                <div className="p-4">
                  <Image
                    src={partner.image_url}
                    alt={partner.name || 'Partner logo'}
                    width={200}
                    height={80}
                    className="w-full h-20 object-contain"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded-lg">
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                    <button
                      onClick={() => editPartner(partner)}
                      className="bg-blue-600 text-white p-1 rounded hover:bg-blue-700"
                      title="Edit partner"
                    >
                      <FiEdit className="w-3 h-3" />
                    </button>
                    {partner.link && (
                      <a
                        href={partner.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 text-white p-1 rounded hover:bg-green-700"
                        title="Visit website"
                      >
                        <FiExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <button
                      onClick={() => deletePartner(partner.id)}
                      className="bg-red-600 text-white p-1 rounded hover:bg-red-700"
                      title="Delete partner"
                    >
                      <FiTrash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
              
              {partner.name && (
                <div className="px-3 pb-3">
                  <p className="text-xs text-gray-900 font-medium text-center truncate">
                    {partner.name}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}