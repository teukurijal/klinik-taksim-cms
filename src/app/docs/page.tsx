'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    SwaggerUIBundle: {
      presets: {
        apis: unknown
        standalone: unknown
      }
      (config: {
        url: string
        dom_id: string
        deepLinking: boolean
        presets: unknown[]
        layout: string
      }): void
    }
  }
}

export default function SwaggerDocsPage() {
  useEffect(() => {
    // Load Swagger UI CSS and JS from CDN
    const loadSwaggerUI = async () => {
      // Load CSS
      const cssLink = document.createElement('link')
      cssLink.rel = 'stylesheet'
      cssLink.href = 'https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css'
      document.head.appendChild(cssLink)

      // Load JS
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js'
      script.onload = () => {
        // Initialize Swagger UI
        window.SwaggerUIBundle({
          url: '/api/swagger',
          dom_id: '#swagger-ui',
          deepLinking: true,
          presets: [
            window.SwaggerUIBundle.presets.apis,
            window.SwaggerUIBundle.presets.standalone
          ],
          layout: 'StandaloneLayout'
        })
      }
      document.head.appendChild(script)
    }

    loadSwaggerUI()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Klinik Taksim API Documentation
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Explore and test the public API endpoints for Klinik Taksim CMS
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Base URL:</strong> <code className="bg-blue-100 px-2 py-1 rounded">/api/public</code>
                </p>
                <p className="text-sm text-blue-700 mt-2">
                  All endpoints listed below are public and do not require authentication.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div id="swagger-ui"></div>
      </div>
    </div>
  )
}