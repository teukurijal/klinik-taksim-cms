'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { FiArrowLeft, FiEdit, FiCalendar, FiImage, FiActivity } from 'react-icons/fi'
import Link from 'next/link'
import Image from 'next/image'

interface Promo {
  id: string
  title: string
  description: string
  image_url: string
  start_date: string
  end_date: string
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export default function ViewPromoPage() {
  const params = useParams()
  const promoId = params.id as string
  
  const [promo, setPromo] = useState<Promo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchPromo = useCallback(async () => {
    try {
      const response = await fetch(`/api/promos/${promoId}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const result = await response.json()

      if (response.ok) {
        setPromo(result.data)
      } else {
        setError(result.error)
      }
    } catch {
      setError('Failed to fetch promo')
    } finally {
      setLoading(false)
    }
  }, [promoId])

  useEffect(() => {
    fetchPromo()
  }, [fetchPromo])

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full"
    switch (status) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800`
      case 'inactive':
        return `${baseClasses} bg-red-100 text-red-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  const isPromoActive = () => {
    if (!promo?.start_date || !promo?.end_date) return false
    const now = new Date()
    const start = new Date(promo.start_date)
    const end = new Date(promo.end_date)
    return now >= start && now <= end && promo.status === 'active'
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-6 mb-6">
              <div className="w-32 h-24 bg-gray-200 rounded-lg"></div>
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
            href="/dashboard/promos"
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to Promos
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Promo Details</h1>
        </div>

        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </DashboardLayout>
    )
  }

  if (!promo) {
    return (
      <DashboardLayout>
        <div className="mb-6">
          <Link
            href="/dashboard/promos"
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to Promos
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Promo Details</h1>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
          Promo not found
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Link
          href="/dashboard/promos"
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <FiArrowLeft className="w-4 h-4 mr-2" />
          Back to Promos
        </Link>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Promo Details</h1>
          <Link
            href={`/dashboard/promos/${promo.id}/edit`}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FiEdit className="w-4 h-4 mr-2" />
            Edit Promo
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6">
          {/* Header with image and basic info */}
          <div className="flex flex-col lg:flex-row items-start space-y-6 lg:space-y-0 lg:space-x-6 mb-8">
            {promo.image_url ? (
              <div className="flex-shrink-0">
                <Image
                  src={promo.image_url}
                  alt={promo.title}
                  width={200}
                  height={150}
                  className="w-48 h-36 object-cover rounded-lg"
                />
              </div>
            ) : (
              <div className="flex-shrink-0 w-48 h-36 bg-gray-100 rounded-lg flex items-center justify-center">
                <FiImage className="w-12 h-12 text-gray-400" />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">{promo.title}</h2>
                <span className={getStatusBadge(promo.status)}>
                  {promo.status}
                </span>
                {isPromoActive() && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    Currently Active
                  </span>
                )}
              </div>
              
              <p className="text-gray-600 text-lg leading-relaxed">
                {promo.description}
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <FiCalendar className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <div className="text-sm font-medium text-gray-700">Start Date</div>
                  <div className="text-gray-900">{formatDate(promo.start_date)}</div>
                </div>
              </div>

              <div className="flex items-center">
                <FiCalendar className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <div className="text-sm font-medium text-gray-700">End Date</div>
                  <div className="text-gray-900">{formatDate(promo.end_date)}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <FiActivity className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <div className="text-sm font-medium text-gray-700">Status</div>
                  <div className="text-gray-900 capitalize">{promo.status}</div>
                </div>
              </div>

              <div className="flex items-center">
                <FiCalendar className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <div className="text-sm font-medium text-gray-700">Created</div>
                  <div className="text-gray-900">{formatDate(promo.created_at)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Promo Period Status */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Promo Period</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              {(() => {
                if (!promo.start_date || !promo.end_date) {
                  return (
                    <div className="text-gray-600">
                      <FiCalendar className="w-5 h-5 inline mr-2" />
                      No specific dates set for this promo
                    </div>
                  )
                }

                const now = new Date()
                const start = new Date(promo.start_date)
                const end = new Date(promo.end_date)

                if (now < start) {
                  const daysUntilStart = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                  return (
                    <div className="text-blue-600">
                      <FiCalendar className="w-5 h-5 inline mr-2" />
                      Promo starts in {daysUntilStart} day(s)
                    </div>
                  )
                } else if (now > end) {
                  const daysAfterEnd = Math.ceil((now.getTime() - end.getTime()) / (1000 * 60 * 60 * 24))
                  return (
                    <div className="text-red-600">
                      <FiCalendar className="w-5 h-5 inline mr-2" />
                      Promo ended {daysAfterEnd} day(s) ago
                    </div>
                  )
                } else {
                  const daysUntilEnd = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                  return (
                    <div className="text-green-600">
                      <FiActivity className="w-5 h-5 inline mr-2" />
                      Promo is currently active ({daysUntilEnd} day(s) remaining)
                    </div>
                  )
                }
              })()}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}