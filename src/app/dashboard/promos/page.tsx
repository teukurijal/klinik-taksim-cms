'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import Link from 'next/link'
import { FiPlus, FiEdit, FiTrash2, FiEye, FiCalendar } from 'react-icons/fi'

interface Promo {
  id: string
  title: string
  description: string
  image_url?: string
  start_date: string
  end_date: string
  status: 'active' | 'inactive'
  created_at: string
}

export default function PromosPage() {
  const [promos, setPromos] = useState<Promo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPromos()
  }, [])

  const fetchPromos = async () => {
    try {
      const response = await fetch('/api/promos', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const result = await response.json()

      if (response.ok) {
        setPromos(result.data)
      } else {
        setError(result.error)
      }
    } catch {
      setError('Failed to fetch promos')
    } finally {
      setLoading(false)
    }
  }

  const deletePromo = async (id: string) => {
    if (!confirm('Are you sure you want to delete this promo?')) return

    try {
      const response = await fetch(`/api/promos/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setPromos(promos.filter(promo => promo.id !== id))
      } else {
        const result = await response.json()
        setError(result.error)
      }
    } catch {
      setError('Failed to delete promo')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date()
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
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
          <h1 className="text-2xl font-bold text-gray-900">Promo Management</h1>
          <Link
            href="/dashboard/promos/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Add Promo
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {promos.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="text-gray-500 mb-4">No promos found</div>
          <Link
            href="/dashboard/promos/create"
            className="text-blue-600 hover:text-blue-800"
          >
            Create your first promo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promos.map((promo) => (
            <div key={promo.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              {promo.image_url && (
                <div className="w-full h-48 overflow-hidden rounded-t-lg">
                  <img
                    src={promo.image_url}
                    alt={promo.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {promo.title}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ml-2 ${
                      promo.status === 'active'
                        ? isExpired(promo.end_date)
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {promo.status === 'active' 
                      ? isExpired(promo.end_date) 
                        ? 'Expired' 
                        : 'Active'
                      : 'Inactive'
                    }
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {promo.description}
                </p>
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <FiCalendar className="w-4 h-4 mr-1" />
                  <span>
                    {formatDate(promo.start_date)} - {formatDate(promo.end_date)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Link
                      href={`/dashboard/promos/${promo.id}`}
                      className="text-blue-600 hover:text-blue-900 p-1"
                      title="View"
                    >
                      <FiEye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/dashboard/promos/${promo.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900 p-1"
                      title="Edit"
                    >
                      <FiEdit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => deletePromo(promo.id)}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="Delete"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <span className="text-xs text-gray-400">
                    {formatDate(promo.created_at)}
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