import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const promosData = [
  {
    title: 'Pemeriksaan Kesehatan Gratis',
    description: 'Dapatkan pemeriksaan kesehatan lengkap gratis untuk 100 pasien pertama. Meliputi cek tekanan darah, gula darah, kolesterol, dan konsultasi dokter umum. Program berlaku untuk semua usia dengan syarat dan ketentuan yang berlaku.',
    image_url: 'https://via.placeholder.com/600x400/4F46E5/FFFFFF?text=Health+Checkup',
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    status: 'active'
  },
  {
    title: 'Vaksinasi COVID-19 Booster',
    description: 'Program vaksinasi booster COVID-19 gratis untuk seluruh keluarga. Vaksin tersedia Pfizer, Moderna, dan Sinovac. Daftar sekarang melalui WhatsApp atau datang langsung ke klinik. Syarat: membawa KTP dan kartu vaksinasi sebelumnya.',
    image_url: 'https://via.placeholder.com/600x400/059669/FFFFFF?text=COVID+Vaccine',
    start_date: '2024-01-15',
    end_date: '2024-06-30',
    status: 'active'
  },
  {
    title: 'Imunisasi Lengkap Anak',
    description: 'Paket imunisasi lengkap untuk bayi dan anak-anak sesuai jadwal IDAI. Meliputi BCG, DPT, Polio, Campak, MMR, dan Hepatitis B. Gratis konsultasi dokter anak dan kartu imunisasi.',
    image_url: 'https://via.placeholder.com/600x400/34D399/FFFFFF?text=Child+Immunization',
    start_date: '2024-02-01',
    end_date: '2024-12-31',
    status: 'active'
  },
  {
    title: 'Konsultasi Gigi Anak Gratis',
    description: 'Bulan kesehatan gigi anak! Konsultasi, pembersihan karang gigi, dan fluoride treatment gratis untuk anak usia 5-12 tahun. Termasuk edukasi menyikat gigi yang benar dan pemberian sikat gigi gratis.',
    image_url: 'https://via.placeholder.com/600x400/DC2626/FFFFFF?text=Dental+Care',
    start_date: '2024-03-01',
    end_date: '2024-03-31',
    status: 'active'
  },
  {
    title: 'Paket Perawatan Gigi Dewasa',
    description: 'Scaling, polishing, dan konsultasi dokter gigi dengan harga spesial. Diskon 50% untuk pemeriksaan lanjutan. Berlaku untuk pembersihan karang gigi dan pemeriksaan gigi berlubang.',
    image_url: 'https://via.placeholder.com/600x400/F59E0B/FFFFFF?text=Adult+Dental',
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    status: 'active'
  },
  {
    title: 'Program Diet Sehat',
    description: 'Konsultasi nutrisi dengan ahli gizi bersertifikat, meal plan personal, dan follow-up selama 3 bulan. Dapatkan tubuh sehat ideal Anda dengan panduan ahli. Termasuk pemeriksaan komposisi tubuh dan resep menu harian.',
    image_url: 'https://via.placeholder.com/600x400/7C3AED/FFFFFF?text=Healthy+Diet',
    start_date: '2024-02-01',
    end_date: '2024-05-31',
    status: 'active'
  },
  {
    title: 'Program Quit Smoking',
    description: 'Konseling dan terapi berhenti merokok dengan pendekatan medis dan psikologis. Sesi konseling mingguan selama 2 bulan plus obat-obatan pendukung. Tingkat keberhasilan 85%.',
    image_url: 'https://via.placeholder.com/600x400/EF4444/FFFFFF?text=Quit+Smoking',
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    status: 'active'
  },
  {
    title: 'Skrining Kanker Payudara',
    description: 'Pemeriksaan mammografi dan USG payudara dengan harga spesial. Deteksi dini untuk kesehatan yang lebih baik. Dilakukan oleh dokter spesialis radiologi berpengalaman dengan peralatan digital terkini.',
    image_url: 'https://via.placeholder.com/600x400/EC4899/FFFFFF?text=Breast+Cancer+Screening',
    start_date: '2024-04-01',
    end_date: '2024-04-30',
    status: 'active'
  },
  {
    title: 'Skrining Kanker Serviks',
    description: 'Pemeriksaan Pap Smear dan IVA test untuk deteksi dini kanker serviks. Harga spesial untuk wanita usia 25-65 tahun. Termasuk konsultasi dokter spesialis kandungan dan hasil dalam 3 hari.',
    image_url: 'https://via.placeholder.com/600x400/8B5CF6/FFFFFF?text=Cervical+Cancer',
    start_date: '2024-05-01',
    end_date: '2024-05-31',
    status: 'active'
  },
  {
    title: 'Pemeriksaan Jantung Lengkap',
    description: 'Paket pemeriksaan jantung meliputi EKG, Echo, Treadmill Test, dan konsultasi kardiolog. Diskon 30% untuk pemeriksaan lanjutan. Cocok untuk usia 40+ atau yang memiliki riwayat keluarga penyakit jantung.',
    image_url: 'https://via.placeholder.com/600x400/3B82F6/FFFFFF?text=Heart+Checkup',
    start_date: '2024-06-01',
    end_date: '2024-06-30',
    status: 'active'
  },
  {
    title: 'Program Edukasi Diabetes',
    description: 'Kelas edukasi diabetes gratis untuk penderita dan keluarga. Meliputi pengaturan pola makan, olahraga, monitoring gula darah, dan pencegahan komplikasi. Sertifikat kehadiran dan buku panduan gratis.',
    image_url: 'https://via.placeholder.com/600x400/10B981/FFFFFF?text=Diabetes+Education',
    start_date: '2024-03-15',
    end_date: '2024-12-31',
    status: 'active'
  },
  {
    title: 'Pemeriksaan Mata Gratis',
    description: 'Pemeriksaan visus, tekanan mata, dan retina untuk deteksi dini katarak, glaukoma, dan diabetes retinopati. Gratis untuk pensiunan dan lansia usia 60+. Kacamata baca diskon 50%.',
    image_url: 'https://via.placeholder.com/600x400/06B6D4/FFFFFF?text=Eye+Checkup',
    start_date: '2024-07-01',
    end_date: '2024-07-31',
    status: 'active'
  },
  {
    title: 'Paket Kesehatan Lansia',
    description: 'Medical check up khusus lansia meliputi pemeriksaan jantung, diabetes, osteoporosis, dan fungsi kognitif. Harga spesial untuk usia 60+ dengan kartu identitas. Termasuk konsultasi geriatri.',
    image_url: 'https://via.placeholder.com/600x400/F97316/FFFFFF?text=Senior+Health',
    start_date: '2024-08-01',
    end_date: '2024-08-31',
    status: 'active'
  },
  {
    title: 'Konsultasi Kesehatan Mental',
    description: 'Konsultasi psikolog dan psikiater dengan harga terjangkau. Untuk masalah stress, anxiety, depresi, dan gangguan mental lainnya. Sesi pertama diskon 50%, privasi terjamin 100%.',
    image_url: 'https://via.placeholder.com/600x400/8B5CF6/FFFFFF?text=Mental+Health',
    start_date: '2024-09-01',
    end_date: '2024-09-30',
    status: 'active'
  },
  {
    title: 'Promo Ramadan Sehat',
    description: 'Paket pemeriksaan kesehatan khusus bulan Ramadan. Cek gula darah, tekanan darah, dan konsultasi pola makan saat puasa. Jadwal pemeriksaan disesuaikan dengan waktu berbuka puasa.',
    image_url: 'https://via.placeholder.com/600x400/059669/FFFFFF?text=Ramadan+Health',
    start_date: '2024-03-10',
    end_date: '2024-04-10',
    status: 'active'
  }
]

export async function POST() {
  try {
    const { data: existingPromos, error: checkError } = await supabase
      .from('promos')
      .select('id')
      .limit(1)

    if (checkError) {
      return NextResponse.json({ error: 'Failed to check existing promos' }, { status: 500 })
    }

    if (existingPromos && existingPromos.length > 0) {
      return NextResponse.json({ 
        message: 'Promos already exist in database. Seeding skipped.',
        count: 0
      }, { status: 200 })
    }

    const { data, error } = await supabase
      .from('promos')
      .insert(promosData)
      .select()

    if (error) {
      console.error('Seeding error:', error)
      return NextResponse.json({ error: 'Failed to seed promos' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Promos seeded successfully',
      count: data?.length || 0,
      data
    }, { status: 201 })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}