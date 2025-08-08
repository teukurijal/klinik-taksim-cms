'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import Link from 'next/link'
import Image from 'next/image'
import { FiArrowLeft, FiEdit, FiCalendar, FiUser, FiTag } from 'react-icons/fi'
import { apiGet } from '@/utils/api'

interface Article {
  id: string
  title: string
  content: string
  status: 'draft' | 'published' | 'archived'
  slug?: string
  excerpt?: string
  image_url?: string
  author?: string
  tags?: string[]
  published_at?: string
  created_at: string
  updated_at: string
}

export default function ViewArticlePage() {
  const params = useParams()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  useEffect(() => {
    if (params.id) {
      fetchArticle(params.id as string)
    }
  }, [params.id])

  const fetchArticle = async (id: string) => {
    try {
      const response = await apiGet(`/api/articles/${id}`)
      const result = await response.json()

      if (response.ok) {
        setArticle(result.data)
      } else {
        setError(result.error)
      }
    } catch {
      setError('Failed to fetch article')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="space-y-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !article) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">{error || 'Article not found'}</div>
          <Link
            href="/dashboard/articles"
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Articles
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard/articles"
              className="text-gray-600 hover:text-gray-900"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">View Article</h1>
          </div>
          <Link
            href={`/dashboard/articles/${article.id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <FiEdit className="w-4 h-4 mr-2" />
            Edit Article
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          {/* Article Header */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <span
                className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${
                  article.status === 'published'
                    ? 'bg-green-100 text-green-800'
                    : article.status === 'draft'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {article.status}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>

            {article.slug && (
              <div className="text-sm text-gray-500 mb-4">
                Slug: /{article.slug}
              </div>
            )}

            {article.excerpt && (
              <div className="text-lg text-gray-600 mb-4">
                {article.excerpt}
              </div>
            )}

            {/* Article Meta */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              {article.author && (
                <div className="flex items-center">
                  <FiUser className="w-4 h-4 mr-1" />
                  {article.author}
                </div>
              )}
              <div className="flex items-center">
                <FiCalendar className="w-4 h-4 mr-1" />
                Created: {formatDate(article.created_at)}
              </div>
              {article.published_at && (
                <div className="flex items-center">
                  <FiCalendar className="w-4 h-4 mr-1" />
                  Published: {formatDate(article.published_at)}
                </div>
              )}
            </div>

            {article.tags && article.tags.length > 0 && (
              <div className="flex items-center mt-4">
                <FiTag className="w-4 h-4 mr-2 text-gray-400" />
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Featured Image */}
          {article.image_url && (
            <div className="mb-6">
              <Image
                src={article.image_url}
                alt={article.title}
                width={800}
                height={256}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {article.content}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}