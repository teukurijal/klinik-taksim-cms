'use client'

import { useEffect, useState, useRef } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { StarRating } from '@/components/ui/star-rating'
import { FiPlus, FiEdit, FiTrash2, FiUser } from 'react-icons/fi'

interface Testimonial {
  id: string
  name: string
  photo_url?: string
  testimonial_text: string
  patient_category?: string
  rate: number
  created_at: string
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState({
    name: '',
    testimonial_text: '',
    patient_category: '',
    photo_url: '',
    rate: 5
  })

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials')
      const result = await response.json()

      if (response.ok) {
        setTestimonials(result.data)
      } else {
        setError(result.error)
      }
    } catch {
      setError('Failed to fetch testimonials')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const url = editingId ? `/api/testimonials/${editingId}` : '/api/testimonials'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        resetForm()
        await fetchTestimonials()
      } else {
        setError(result.error)
      }
    } catch {
      setError('Failed to save testimonial')
    }
  }

  const deleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return

    try {
      const response = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' })
      if (response.ok) {
        setTestimonials(testimonials.filter(t => t.id !== id))
      } else {
        const result = await response.json()
        setError(result.error)
      }
    } catch {
      setError('Failed to delete testimonial')
    }
  }

  const resetForm = () => {
    setFormData({ name: '', testimonial_text: '', patient_category: '', photo_url: '', rate: 5 })
    setShowForm(false)
    setEditingId(null)
  }

  const editTestimonial = (testimonial: Testimonial) => {
    setFormData({
      name: testimonial?.name,
      testimonial_text: testimonial?.testimonial_text,
      patient_category: testimonial?.patient_category || '',
      photo_url: testimonial?.photo_url || '',
      rate: testimonial?.rate || 5
    })
    setEditingId(testimonial?.id)
    setShowForm(true)
    
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
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
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Add Testimonial
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {showForm && (
        <div ref={formRef} className="bg-white rounded-lg shadow mb-6">
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Patient Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Patient Category (optional)"
                value={formData.patient_category}
                onChange={(e) => setFormData({ ...formData, patient_category: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <textarea
              placeholder="Testimonial text *"
              value={formData.testimonial_text}
              onChange={(e) => setFormData({ ...formData, testimonial_text: e.target.value })}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Rating</label>
              <StarRating 
                value={formData.rate} 
                onChange={(rating) => setFormData({ ...formData, rate: rating })}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={resetForm} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                {editingId ? 'Update' : 'Add'} Testimonial
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {testimonials.map((testimonial, idx) => (
          <div key={idx.toString()} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <FiUser className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{testimonial?.name}</h3>
                  {testimonial?.patient_category && (
                    <p className="text-sm text-blue-600 mb-2">{testimonial?.patient_category}</p>
                  )}
                  <p className="text-gray-700 leading-relaxed mb-3">{testimonial?.testimonial_text}</p>
                  <div className="flex items-center justify-between">
                    <StarRating value={testimonial?.rate || 5} readonly size="sm" />
                    <p className="text-xs text-gray-400">
                      {new Date(testimonial?.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => editTestimonial(testimonial)} className="text-indigo-600 hover:text-indigo-900 p-1">
                  <FiEdit className="w-4 h-4" />
                </button>
                <button onClick={() => deleteTestimonial(testimonial?.id)} className="text-red-600 hover:text-red-900 p-1">
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {testimonials.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="text-gray-500">No testimonials found</div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}