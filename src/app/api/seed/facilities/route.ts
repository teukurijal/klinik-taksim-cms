import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const facilitiesData = [
  {
    image_url: 'https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Reception+Area',
    title: 'Area Resepsionis',
    description: 'Area penerimaan pasien yang nyaman dan modern dengan sistem antrian digital'
  },
  {
    image_url: 'https://via.placeholder.com/800x600/059669/FFFFFF?text=Waiting+Room',
    title: 'Ruang Tunggu',
    description: 'Ruang tunggu yang luas dan nyaman dengan fasilitas AC, TV, dan WiFi gratis'
  },
  {
    image_url: 'https://via.placeholder.com/800x600/DC2626/FFFFFF?text=Emergency+Room',
    title: 'Ruang Gawat Darurat',
    description: 'Unit gawat darurat dengan peralatan medis lengkap dan tim medis 24 jam'
  },
  {
    image_url: 'https://via.placeholder.com/800x600/7C3AED/FFFFFF?text=Operating+Theater',
    title: 'Ruang Operasi',
    description: 'Ruang operasi steril dengan teknologi terkini dan sistem ventilasi khusus'
  },
  {
    image_url: 'https://via.placeholder.com/800x600/EC4899/FFFFFF?text=Laboratory',
    title: 'Laboratorium',
    description: 'Laboratorium dengan peralatan canggih untuk pemeriksaan darah, urine, dan mikrobiologi'
  },
  {
    image_url: 'https://via.placeholder.com/800x600/F59E0B/FFFFFF?text=Pharmacy',
    title: 'Apotek',
    description: 'Apotek dengan stok obat lengkap dan farmasis berpengalaman'
  },
  {
    image_url: 'https://via.placeholder.com/800x600/10B981/FFFFFF?text=Radiology',
    title: 'Radiologi',
    description: 'Unit radiologi dengan CT Scan, MRI, dan X-Ray digital terbaru'
  },
  {
    image_url: 'https://via.placeholder.com/800x600/8B5CF6/FFFFFF?text=ICU',
    title: 'Intensive Care Unit',
    description: 'ICU dengan monitoring 24 jam dan perawat spesialis intensif'
  }
]

export async function POST() {
  try {
    const { data: existingFacilities, error: checkError } = await supabase
      .from('facility_photos')
      .select('id')
      .limit(1)

    if (checkError) {
      return NextResponse.json({ error: 'Failed to check existing facilities' }, { status: 500 })
    }

    if (existingFacilities && existingFacilities.length > 0) {
      return NextResponse.json({ 
        message: 'Facility photos already exist in database. Seeding skipped.',
        count: 0
      }, { status: 200 })
    }

    const { data, error } = await supabase
      .from('facility_photos')
      .insert(facilitiesData)
      .select()

    if (error) {
      console.error('Seeding error:', error)
      return NextResponse.json({ error: 'Failed to seed facility photos' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Facility photos seeded successfully',
      count: data?.length || 0,
      data
    }, { status: 201 })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}