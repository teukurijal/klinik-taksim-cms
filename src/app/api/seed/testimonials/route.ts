import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const testimonialsData = [
  {
    name: 'Siti Nurhaliza',
    photo_url: 'https://via.placeholder.com/150x150/4F46E5/FFFFFF?text=SN',
    testimonial_text: 'Pelayanan di Klinik Taksim sangat memuaskan. Dokter dan perawatnya ramah, fasilitas bersih dan modern. Pemeriksaan juga sangat teliti. Sangat direkomendasikan!',
    patient_category: 'Pasien Umum'
  },
  {
    name: 'Ahmad Wijaya',
    photo_url: 'https://via.placeholder.com/150x150/059669/FFFFFF?text=AW',
    testimonial_text: 'Sudah 3 tahun jadi pasien di sini. Dokter spesialis jantungnya sangat kompeten. Alhamdulillah kondisi jantung saya membaik berkat perawatan yang tepat.',
    patient_category: 'Pasien Jantung'
  },
  {
    name: 'Maria Christina',
    photo_url: 'https://via.placeholder.com/150x150/DC2626/FFFFFF?text=MC',
    testimonial_text: 'Melahirkan anak kedua di sini. Dokter kandungannya sangat berpengalaman, fasilitas kamar bersalin lengkap. Tim medisnya juga sangat supportif.',
    patient_category: 'Pasien Kebidanan'
  },
  {
    name: 'Budi Santoso',
    photo_url: 'https://via.placeholder.com/150x150/7C3AED/FFFFFF?text=BS',
    testimonial_text: 'Operasi mata katarak di sini berjalan lancar. Dokter mata sangat profesional, hasil operasi memuaskan. Sekarang penglihatan saya sudah normal kembali.',
    patient_category: 'Pasien Mata'
  },
  {
    name: 'Dewi Sartika',
    photo_url: 'https://via.placeholder.com/150x150/EC4899/FFFFFF?text=DS',
    testimonial_text: 'Terapi fisik untuk stroke suami saya sangat membantu. Fisioterapisnya sabar dan profesional. Alhamdulillah suami saya sudah bisa berjalan normal.',
    patient_category: 'Keluarga Pasien'
  },
  {
    name: 'Rizki Ramadhan',
    photo_url: 'https://via.placeholder.com/150x150/F59E0B/FFFFFF?text=RR',
    testimonial_text: 'Pemeriksaan kesehatan rutin di sini sangat lengkap. Medical check up dikerjakan dengan teliti, hasilnya juga dijelaskan dengan detail oleh dokter.',
    patient_category: 'Medical Check Up'
  },
  {
    name: 'Fatimah Zahra',
    photo_url: 'https://via.placeholder.com/150x150/10B981/FFFFFF?text=FZ',
    testimonial_text: 'Perawatan gigi anak saya di sini sangat baik. Dokter giginya sabar menghadapi anak-anak, suasana klinik juga child-friendly.',
    patient_category: 'Orang Tua Pasien'
  },
  {
    name: 'Andi Kurniawan',
    photo_url: 'https://via.placeholder.com/150x150/8B5CF6/FFFFFF?text=AK',
    testimonial_text: 'Layanan gawat darurat 24 jam sangat membantu. Ketika istri saya kecelakaan, langsung ditangani dengan cepat dan profesional.',
    patient_category: 'Pasien Emergency'
  }
]

export async function POST() {
  try {
    const { data: existingTestimonials, error: checkError } = await supabase
      .from('testimonials')
      .select('id')
      .limit(1)

    if (checkError) {
      return NextResponse.json({ error: 'Failed to check existing testimonials' }, { status: 500 })
    }

    if (existingTestimonials && existingTestimonials.length > 0) {
      return NextResponse.json({ 
        message: 'Testimonials already exist in database. Seeding skipped.',
        count: 0
      }, { status: 200 })
    }

    const { data, error } = await supabase
      .from('testimonials')
      .insert(testimonialsData)
      .select()

    if (error) {
      console.error('Seeding error:', error)
      return NextResponse.json({ error: 'Failed to seed testimonials' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Testimonials seeded successfully',
      count: data?.length || 0,
      data
    }, { status: 201 })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}