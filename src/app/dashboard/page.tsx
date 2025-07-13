'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { supabase } from '@/lib/supabase'
import { FiUsers, FiTag, FiCamera, FiMessageSquare, FiHelpCircle, FiImage } from 'react-icons/fi'

interface Stats {
  doctors: number
  promos: number
  facilities: number
  testimonials: number
  faqs: number
  partners: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    doctors: 0,
    promos: 0,
    facilities: 0,
    testimonials: 0,
    faqs: 0,
    partners: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [
        doctorsResult,
        promosResult,
        facilitiesResult,
        testimonialsResult,
        faqsResult,
        partnersResult,
      ] = await Promise.all([
        supabase.from('doctors').select('id', { count: 'exact', head: true }),
        supabase.from('promos').select('id', { count: 'exact', head: true }),
        supabase.from('facility_photos').select('id', { count: 'exact', head: true }),
        supabase.from('testimonials').select('id', { count: 'exact', head: true }),
        supabase.from('faqs').select('id', { count: 'exact', head: true }),
        supabase.from('partners').select('id', { count: 'exact', head: true }),
      ])

      setStats({
        doctors: doctorsResult.count || 0,
        promos: promosResult.count || 0,
        facilities: facilitiesResult.count || 0,
        testimonials: testimonialsResult.count || 0,
        faqs: faqsResult.count || 0,
        partners: partnersResult.count || 0,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      name: 'Doctors',
      value: stats.doctors,
      icon: FiUsers,
      color: 'bg-blue-500',
      href: '/dashboard/doctors',
    },
    {
      name: 'Promos',
      value: stats.promos,
      icon: FiTag,
      color: 'bg-green-500',
      href: '/dashboard/promos',
    },
    {
      name: 'Facilities',
      value: stats.facilities,
      icon: FiCamera,
      color: 'bg-purple-500',
      href: '/dashboard/facilities',
    },
    {
      name: 'Testimonials',
      value: stats.testimonials,
      icon: FiMessageSquare,
      color: 'bg-yellow-500',
      href: '/dashboard/testimonials',
    },
    {
      name: 'FAQs',
      value: stats.faqs,
      icon: FiHelpCircle,
      color: 'bg-red-500',
      href: '/dashboard/faqs',
    },
    {
      name: 'Partners',
      value: stats.partners,
      icon: FiImage,
      color: 'bg-indigo-500',
      href: '/dashboard/partners',
    },
  ]

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-2 text-gray-600">
          Welcome to Klinik Taksim Medika content management system
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((card) => {
            const Icon = card.icon
            return (
              <div
                key={card.name}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg ${card.color}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{card.name}</p>
                      <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <h3 className="font-medium text-gray-900">Add New Doctor</h3>
            <p className="text-sm text-gray-600 mt-1">Create a new doctor profile</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <h3 className="font-medium text-gray-900">Create Promo</h3>
            <p className="text-sm text-gray-600 mt-1">Add a new promotional content</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <h3 className="font-medium text-gray-900">Upload Facility Photo</h3>
            <p className="text-sm text-gray-600 mt-1">Add new facility images</p>
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}