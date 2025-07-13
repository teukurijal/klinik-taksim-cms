import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    const seeders = [
      { name: 'Doctors', endpoint: '/api/seed/doctors' },
      { name: 'Promos', endpoint: '/api/seed/promos' },
      { name: 'Facilities', endpoint: '/api/seed/facilities' },
      { name: 'Testimonials', endpoint: '/api/seed/testimonials' },
      { name: 'FAQs', endpoint: '/api/seed/faqs' },
      { name: 'Partners', endpoint: '/api/seed/partners' }
    ]

    const results = []
    
    for (const seeder of seeders) {
      try {
        console.log(`Seeding ${seeder.name}...`)
        
        const response = await fetch(`${baseUrl}${seeder.endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        const result = await response.json()
        
        results.push({
          table: seeder.name,
          status: response.ok ? 'success' : 'failed',
          message: result.message || result.error,
          count: result.count || 0
        })
        
        console.log(`${seeder.name}: ${result.message}`)
        
      } catch (error) {
        console.error(`Error seeding ${seeder.name}:`, error)
        results.push({
          table: seeder.name,
          status: 'failed',
          message: `Failed to seed ${seeder.name}: ${error}`,
          count: 0
        })
      }
    }

    const totalSeeded = results.reduce((sum, result) => sum + (result.count || 0), 0)
    const successCount = results.filter(result => result.status === 'success').length
    const failedCount = results.filter(result => result.status === 'failed').length

    return NextResponse.json({
      message: 'Master seeding completed',
      summary: {
        total_tables: seeders.length,
        successful: successCount,
        failed: failedCount,
        total_records: totalSeeded
      },
      results
    }, { status: 200 })

  } catch (error) {
    console.error('Master seeding error:', error)
    return NextResponse.json({
      error: 'Failed to run master seeder',
      details: error
    }, { status: 500 })
  }
}