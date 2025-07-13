import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const faqsData = [
  {
    question: 'Apa saja jam operasional Klinik Taksim Medika?',
    answer: 'Klinik Taksim Medika buka setiap hari Senin-Sabtu pukul 08.00-20.00 WIB, dan Minggu pukul 08.00-16.00 WIB. Untuk layanan gawat darurat, kami melayani 24 jam setiap hari.'
  },
  {
    question: 'Apakah Klinik Taksim Medika menerima BPJS Kesehatan?',
    answer: 'Ya, kami menerima BPJS Kesehatan untuk berbagai layanan. Pastikan Anda membawa kartu BPJS yang masih aktif dan kartu identitas saat berkunjung.'
  },
  {
    question: 'Bagaimana cara membuat janji temu dengan dokter?',
    answer: 'Anda dapat membuat janji temu melalui telepon di +62-21-1234567, WhatsApp, atau datang langsung ke klinik. Kami juga memiliki sistem booking online di website resmi kami.'
  },
  {
    question: 'Apakah tersedia layanan rawat inap?',
    answer: 'Ya, kami memiliki fasilitas rawat inap dengan berbagai kelas kamar. Tersedia kamar VIP, kelas I, II, dan III dengan fasilitas yang berbeda sesuai kebutuhan.'
  },
  {
    question: 'Apa saja spesialisasi dokter yang tersedia?',
    answer: 'Kami memiliki dokter spesialis dalam berbagai bidang seperti Jantung, Penyakit Dalam, Kebidanan & Kandungan, Anak, Mata, Bedah, Saraf, THT, Kulit & Kelamin, dan Gigi.'
  },
  {
    question: 'Apakah ada layanan ambulans?',
    answer: 'Ya, kami menyediakan layanan ambulans 24 jam untuk keadaan darurat. Hubungi nomor emergency kami untuk bantuan cepat.'
  },
  {
    question: 'Bagaimana cara mendapatkan hasil laboratorium?',
    answer: 'Hasil laboratorium biasanya dapat diambil 1-3 hari kerja setelah pengambilan sampel. Anda akan dihubungi ketika hasil sudah siap, atau dapat dicek melalui aplikasi mobile kami.'
  },
  {
    question: 'Apakah ada program medical check up?',
    answer: 'Ya, kami memiliki berbagai paket medical check up mulai dari basic hingga executive. Paket dapat disesuaikan dengan kebutuhan dan usia Anda.'
  },
  {
    question: 'Bagaimana kebijakan pembayaran di klinik?',
    answer: 'Kami menerima pembayaran tunai, kartu debit/kredit, transfer bank, dan BPJS. Untuk tindakan tertentu, mungkin diperlukan uang muka sebelum perawatan.'
  },
  {
    question: 'Apakah ada fasilitas parkir?',
    answer: 'Ya, kami menyediakan area parkir yang luas dan aman untuk mobil dan motor. Parkir gratis untuk semua pasien dan pengunjung.'
  }
]

export async function POST() {
  try {
    const { data: existingFaqs, error: checkError } = await supabase
      .from('faqs')
      .select('id')
      .limit(1)

    if (checkError) {
      return NextResponse.json({ error: 'Failed to check existing FAQs' }, { status: 500 })
    }

    if (existingFaqs && existingFaqs.length > 0) {
      return NextResponse.json({ 
        message: 'FAQs already exist in database. Seeding skipped.',
        count: 0
      }, { status: 200 })
    }

    const { data, error } = await supabase
      .from('faqs')
      .insert(faqsData)
      .select()

    if (error) {
      console.error('Seeding error:', error)
      return NextResponse.json({ error: 'Failed to seed FAQs' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'FAQs seeded successfully',
      count: data?.length || 0,
      data
    }, { status: 201 })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}