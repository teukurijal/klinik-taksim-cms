'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { FiPlus, FiEdit, FiTrash2, FiHelpCircle } from 'react-icons/fi'

interface FAQ {
  id: string
  question: string
  answer: string
  created_at: string
}

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    question: '',
    answer: ''
  })

  useEffect(() => {
    fetchFAQs()
  }, [])

  const fetchFAQs = async () => {
    try {
      const response = await fetch('/api/faqs')
      const result = await response.json()

      if (response.ok) {
        setFaqs(result.data)
      } else {
        setError(result.error)
      }
    } catch {
      setError('Failed to fetch FAQs')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const url = editingId ? `/api/faqs/${editingId}` : '/api/faqs'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        if (editingId) {
          setFaqs(faqs.map(f => f.id === editingId ? result.data[0] : f))
        } else {
          setFaqs([result.data[0], ...faqs])
        }
        resetForm()
      } else {
        setError(result.error)
      }
    } catch {
      setError('Failed to save FAQ')
    }
  }

  const deleteFAQ = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return

    try {
      const response = await fetch(`/api/faqs/${id}`, { method: 'DELETE' })
      if (response.ok) {
        setFaqs(faqs.filter(f => f.id !== id))
      } else {
        const result = await response.json()
        setError(result.error)
      }
    } catch {
      setError('Failed to delete FAQ')
    }
  }

  const resetForm = () => {
    setFormData({ question: '', answer: '' })
    setShowForm(false)
    setEditingId(null)
  }

  const editFAQ = (faq: FAQ) => {
    setFormData({
      question: faq.question,
      answer: faq.answer
    })
    setEditingId(faq.id)
    setShowForm(true)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
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
          <h1 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Add FAQ
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-lg shadow mb-6">
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Question *</label>
              <input
                type="text"
                value={formData.question}
                onChange={(e) => setFormData({...formData, question: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the question"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Answer *</label>
              <textarea
                value={formData.answer}
                onChange={(e) => setFormData({...formData, answer: e.target.value})}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the answer"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={resetForm} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                {editingId ? 'Update' : 'Add'} FAQ
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={faq.id} className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FiHelpCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {index + 1}. {faq?.question}
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      {faq.answer}
                    </p>
                    <p className="text-xs text-gray-400">
                      Created on {new Date(faq.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button 
                    onClick={() => editFAQ(faq)} 
                    className="text-indigo-600 hover:text-indigo-900 p-1"
                    title="Edit FAQ"
                  >
                    <FiEdit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => deleteFAQ(faq.id)} 
                    className="text-red-600 hover:text-red-900 p-1"
                    title="Delete FAQ"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {faqs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <FiHelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <div className="text-gray-500">No FAQs found</div>
            <p className="text-sm text-gray-400 mt-2">Add your first FAQ to get started</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}