'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { FiSave, FiX } from 'react-icons/fi'
import { apiPost } from '@/utils/api'
import Link from 'next/link'

export default function CreatePolyClinicPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    head: '',
    location: '',
    phone_number: '',
    email: '',
    working_hours: {
      monday: { start: '', end: '', available: true },
      tuesday: { start: '', end: '', available: true },
      wednesday: { start: '', end: '', available: true },
      thursday: { start: '', end: '', available: true },
      friday: { start: '', end: '', available: true },
      saturday: { start: '', end: '', available: true },
      sunday: { start: '', end: '', available: true }
    },
    capacity: '',
    services: ['']
  })

  const handleServiceChange = (index: number, value: string) => {
    const newServices = [...formData.services]
    newServices[index] = value
    setFormData({ ...formData, services: newServices })
  }

  const handleWorkingHoursChange = (day: string, field: 'start' | 'end' | 'available', value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      working_hours: {
        ...prev.working_hours,
        [day]: {
          ...prev.working_hours[day as keyof typeof prev.working_hours],
          [field]: value
        }
      }
    }))
  }

  const toggleDayAvailability = (day: string) => {
    setFormData(prev => ({
      ...prev,
      working_hours: {
        ...prev.working_hours,
        [day]: prev.working_hours[day as keyof typeof prev.working_hours].available
          ? { start: '', end: '', available: false }
          : { start: '08:00', end: '17:00', available: true }
      }
    }))
  }

  const addService = () => {
    setFormData({ ...formData, services: [...formData.services, ''] })
  }

  const removeService = (index: number) => {
    const newServices = formData.services.filter((_, i) => i !== index)
    setFormData({ ...formData, services: newServices })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const workingHoursData = Object.fromEntries(
        Object.entries(formData.working_hours).map(([day, hours]) => [
          day,
          hours.available ? {
            start: hours.start,
            end: hours.end,
            available: true
          } : {
            start: '',
            end: '',
            available: false
          }
        ])
      )

      const submitData = {
        ...formData,
        working_hours: workingHoursData,
        services: formData.services.filter(service => service.trim() !== ''),
        capacity: formData.capacity ? parseInt(formData.capacity) : undefined
      }

      const response = await apiPost('/api/polyclinics', submitData)

      if (response.ok) {
        router.push('/dashboard/polyclinics')
      } else {
        const result = await response.json()
        setError(result.error)
      }
    } catch {
      setError('Failed to create polyclinic')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Create New Poly Clinic</h1>
          <Link
            href="/dashboard/polyclinics"
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center"
          >
            <FiX className="w-4 h-4 mr-2" />
            Cancel
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter polyclinic name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Head *
              </label>
              <input
                type="text"
                required
                value={formData.head}
                onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter head of polyclinic"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter polyclinic description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter location"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacity
              </label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter patient capacity"
                min="0"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Working Hours
              </label>
              <div className="space-y-3 max-h-80 overflow-y-auto border border-gray-200 rounded-lg p-4">
                {Object.entries(formData.working_hours).map(([day, hours]) => (
                  <div key={day} className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-3 border border-gray-100 rounded-lg">
                    <div className="w-24 text-sm font-medium text-gray-700 capitalize flex-shrink-0">
                      {day}
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={hours.available}
                        onChange={() => toggleDayAvailability(day)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-600">Available</span>
                    </div>
                    {hours.available && (
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-2">
                          <label className="text-sm text-gray-600 w-10">Start:</label>
                          <input
                            type="time"
                            value={hours.start}
                            onChange={(e) => handleWorkingHoursChange(day, 'start', e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <label className="text-sm text-gray-600 w-10">End:</label>
                          <input
                            type="time"
                            value={hours.end}
                            onChange={(e) => handleWorkingHoursChange(day, 'end', e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>



            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Services
              </label>
              <div className="space-y-2">
                {formData.services.map((service, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={service}
                      onChange={(e) => handleServiceChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter service name"
                    />
                    {formData.services.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeService(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addService}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  + Add Service
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-8">
            <Link
              href="/dashboard/polyclinics"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              <FiSave className="w-4 h-4 mr-2" />
              {loading ? 'Creating...' : 'Create Poly Clinic'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}