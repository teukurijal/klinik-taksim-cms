import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const partnersData = [
  {
    name: 'BPJS Kesehatan',
    image_url: 'https://via.placeholder.com/200x100/4F46E5/FFFFFF?text=BPJS',
    link: 'https://bpjs-kesehatan.go.id'
  },
  {
    name: 'Allianz Insurance',
    image_url: 'https://via.placeholder.com/200x100/059669/FFFFFF?text=Allianz',
    link: 'https://allianz.co.id'
  },
  {
    name: 'AXA Mandiri',
    image_url: 'https://via.placeholder.com/200x100/DC2626/FFFFFF?text=AXA',
    link: 'https://axa-mandiri.co.id'
  },
  {
    name: 'Prudential Indonesia',
    image_url: 'https://via.placeholder.com/200x100/7C3AED/FFFFFF?text=Prudential',
    link: 'https://prudential.co.id'
  },
  {
    name: 'Great Eastern',
    image_url: 'https://via.placeholder.com/200x100/EC4899/FFFFFF?text=Great+Eastern',
    link: 'https://greateastern.co.id'
  },
  {
    name: 'Siloam Hospitals',
    image_url: 'https://via.placeholder.com/200x100/F59E0B/FFFFFF?text=Siloam',
    link: 'https://siloamhospitals.com'
  },
  {
    name: 'Kimia Farma',
    image_url: 'https://via.placeholder.com/200x100/10B981/FFFFFF?text=Kimia+Farma',
    link: 'https://kimiafarma.co.id'
  },
  {
    name: 'Biofarma',
    image_url: 'https://via.placeholder.com/200x100/8B5CF6/FFFFFF?text=Biofarma',
    link: 'https://biofarma.co.id'
  },
  {
    name: 'RS Universitas Indonesia',
    image_url: 'https://via.placeholder.com/200x100/6366F1/FFFFFF?text=RSUI',
    link: 'https://rscm.ui.ac.id'
  },
  {
    name: 'Mayapada Healthcare',
    image_url: 'https://via.placeholder.com/200x100/EF4444/FFFFFF?text=Mayapada',
    link: 'https://mayapadahealthcare.com'
  }
]

export async function POST() {
  try {
    const { data: existingPartners, error: checkError } = await supabase
      .from('partners')
      .select('id')
      .limit(1)

    if (checkError) {
      return NextResponse.json({ error: 'Failed to check existing partners' }, { status: 500 })
    }

    if (existingPartners && existingPartners.length > 0) {
      return NextResponse.json({ 
        message: 'Partners already exist in database. Seeding skipped.',
        count: 0
      }, { status: 200 })
    }

    const { data, error } = await supabase
      .from('partners')
      .insert(partnersData)
      .select()

    if (error) {
      console.error('Seeding error:', error)
      return NextResponse.json({ error: 'Failed to seed partners' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Partners seeded successfully',
      count: data?.length || 0,
      data
    }, { status: 201 })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}