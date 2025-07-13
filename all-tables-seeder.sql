-- ============================================
-- COMPREHENSIVE SEEDER FOR ALL TABLES
-- Klinik Taksim CMS Database
-- ============================================

-- ============================================
-- 1. PROMOS SEEDER
-- ============================================
INSERT INTO promos (
  title,
  description,
  image_url,
  start_date,
  end_date,
  status
) VALUES
(
  'Pemeriksaan Kesehatan Gratis',
  'Dapatkan pemeriksaan kesehatan lengkap gratis untuk 100 pasien pertama. Meliputi cek tekanan darah, gula darah, kolesterol, dan konsultasi dokter umum.',
  'https://via.placeholder.com/600x400/4F46E5/FFFFFF?text=Health+Checkup',
  '2024-01-01',
  '2024-12-31',
  'active'
),
(
  'Vaksinasi COVID-19 Booster',
  'Program vaksinasi booster COVID-19 gratis untuk seluruh keluarga. Vaksin tersedia Pfizer, Moderna, dan Sinovac. Daftar sekarang!',
  'https://via.placeholder.com/600x400/059669/FFFFFF?text=COVID+Vaccine',
  '2024-01-15',
  '2024-06-30',
  'active'
),
(
  'Konsultasi Gigi Anak Gratis',
  'Bulan kesehatan gigi anak! Konsultasi, pembersihan karang gigi, dan fluoride treatment gratis untuk anak usia 5-12 tahun.',
  'https://via.placeholder.com/600x400/DC2626/FFFFFF?text=Dental+Care',
  '2024-03-01',
  '2024-03-31',
  'active'
),
(
  'Program Diet Sehat',
  'Konsultasi nutrisi dengan ahli gizi, meal plan personal, dan follow-up selama 3 bulan. Dapatkan tubuh sehat ideal Anda!',
  'https://via.placeholder.com/600x400/7C3AED/FFFFFF?text=Healthy+Diet',
  '2024-02-01',
  '2024-05-31',
  'active'
),
(
  'Skrining Kanker Payudara',
  'Pemeriksaan mammografi dan USG payudara dengan harga spesial. Deteksi dini untuk kesehatan yang lebih baik.',
  'https://via.placeholder.com/600x400/EC4899/FFFFFF?text=Breast+Cancer+Screening',
  '2024-04-01',
  '2024-04-30',
  'active'
);

-- ============================================
-- 2. FACILITY PHOTOS SEEDER
-- ============================================
INSERT INTO facility_photos (
  image_url,
  title,
  description
) VALUES
(
  'https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Reception+Area',
  'Area Resepsionis',
  'Area penerimaan pasien yang nyaman dan modern dengan sistem antrian digital'
),
(
  'https://via.placeholder.com/800x600/059669/FFFFFF?text=Waiting+Room',
  'Ruang Tunggu',
  'Ruang tunggu yang luas dan nyaman dengan fasilitas AC, TV, dan WiFi gratis'
),
(
  'https://via.placeholder.com/800x600/DC2626/FFFFFF?text=Emergency+Room',
  'Ruang Gawat Darurat',
  'Unit gawat darurat dengan peralatan medis lengkap dan tim medis 24 jam'
),
(
  'https://via.placeholder.com/800x600/7C3AED/FFFFFF?text=Operating+Theater',
  'Ruang Operasi',
  'Ruang operasi steril dengan teknologi terkini dan sistem ventilasi khusus'
),
(
  'https://via.placeholder.com/800x600/EC4899/FFFFFF?text=Laboratory',
  'Laboratorium',
  'Laboratorium dengan peralatan canggih untuk pemeriksaan darah, urine, dan mikrobiologi'
),
(
  'https://via.placeholder.com/800x600/F59E0B/FFFFFF?text=Pharmacy',
  'Apotek',
  'Apotek dengan stok obat lengkap dan farmasis berpengalaman'
),
(
  'https://via.placeholder.com/800x600/10B981/FFFFFF?text=Radiology',
  'Radiologi',
  'Unit radiologi dengan CT Scan, MRI, dan X-Ray digital terbaru'
),
(
  'https://via.placeholder.com/800x600/8B5CF6/FFFFFF?text=ICU',
  'Intensive Care Unit',
  'ICU dengan monitoring 24 jam dan perawat spesialis intensif'
);

-- ============================================
-- 3. TESTIMONIALS SEEDER
-- ============================================
INSERT INTO testimonials (
  name,
  photo_url,
  testimonial_text,
  patient_category
) VALUES
(
  'Siti Nurhaliza',
  'https://via.placeholder.com/150x150/4F46E5/FFFFFF?text=SN',
  'Pelayanan di Klinik Taksim sangat memuaskan. Dokter dan perawatnya ramah, fasilitas bersih dan modern. Pemeriksaan juga sangat teliti. Sangat direkomendasikan!',
  'Pasien Umum'
),
(
  'Ahmad Wijaya',
  'https://via.placeholder.com/150x150/059669/FFFFFF?text=AW',
  'Sudah 3 tahun jadi pasien di sini. Dokter spesialis jantungnya sangat kompeten. Alhamdulillah kondisi jantung saya membaik berkat perawatan yang tepat.',
  'Pasien Jantung'
),
(
  'Maria Christina',
  'https://via.placeholder.com/150x150/DC2626/FFFFFF?text=MC',
  'Melahirkan anak kedua di sini. Dokter kandungannya sangat berpengalaman, fasilitas kamar bersalin lengkap. Tim medisnya juga sangat supportif.',
  'Pasien Kebidanan'
),
(
  'Budi Santoso',
  'https://via.placeholder.com/150x150/7C3AED/FFFFFF?text=BS',
  'Operasi mata katarak di sini berjalan lancar. Dokter mata sangat profesional, hasil operasi memuaskan. Sekarang penglihatan saya sudah normal kembali.',
  'Pasien Mata'
),
(
  'Dewi Sartika',
  'https://via.placeholder.com/150x150/EC4899/FFFFFF?text=DS',
  'Terapi fisik untuk stroke suami saya sangat membantu. Fisioterapisnya sabar dan profesional. Alhamdulillah suami saya sudah bisa berjalan normal.',
  'Keluarga Pasien'
),
(
  'Rizki Ramadhan',
  'https://via.placeholder.com/150x150/F59E0B/FFFFFF?text=RR',
  'Pemeriksaan kesehatan rutin di sini sangat lengkap. Medical check up dikerjakan dengan teliti, hasilnya juga dijelaskan dengan detail oleh dokter.',
  'Medical Check Up'
),
(
  'Fatimah Zahra',
  'https://via.placeholder.com/150x150/10B981/FFFFFF?text=FZ',
  'Perawatan gigi anak saya di sini sangat baik. Dokter giginya sabar menghadapi anak-anak, suasana klinik juga child-friendly.',
  'Orang Tua Pasien'
),
(
  'Andi Kurniawan',
  'https://via.placeholder.com/150x150/8B5CF6/FFFFFF?text=AK',
  'Layanan gawat darurat 24 jam sangat membantu. Ketika istri saya kecelakaan, langsung ditangani dengan cepat dan profesional.',
  'Pasien Emergency'
);

-- ============================================
-- 4. FAQs SEEDER
-- ============================================
INSERT INTO faqs (
  question,
  answer
) VALUES
(
  'Apa saja jam operasional Klinik Taksim Medika?',
  'Klinik Taksim Medika buka setiap hari Senin-Sabtu pukul 08.00-20.00 WIB, dan Minggu pukul 08.00-16.00 WIB. Untuk layanan gawat darurat, kami melayani 24 jam setiap hari.'
),
(
  'Apakah Klinik Taksim Medika menerima BPJS Kesehatan?',
  'Ya, kami menerima BPJS Kesehatan untuk berbagai layanan. Pastikan Anda membawa kartu BPJS yang masih aktif dan kartu identitas saat berkunjung.'
),
(
  'Bagaimana cara membuat janji temu dengan dokter?',
  'Anda dapat membuat janji temu melalui telepon di +62-21-1234567, WhatsApp, atau datang langsung ke klinik. Kami juga memiliki sistem booking online di website resmi kami.'
),
(
  'Apakah tersedia layanan rawat inap?',
  'Ya, kami memiliki fasilitas rawat inap dengan berbagai kelas kamar. Tersedia kamar VIP, kelas I, II, dan III dengan fasilitas yang berbeda sesuai kebutuhan.'
),
(
  'Apa saja spesialisasi dokter yang tersedia?',
  'Kami memiliki dokter spesialis dalam berbagai bidang seperti Jantung, Penyakit Dalam, Kebidanan & Kandungan, Anak, Mata, Bedah, Saraf, THT, Kulit & Kelamin, dan Gigi.'
),
(
  'Apakah ada layanan ambulans?',
  'Ya, kami menyediakan layanan ambulans 24 jam untuk keadaan darurat. Hubungi nomor emergency kami untuk bantuan cepat.'
),
(
  'Bagaimana cara mendapatkan hasil laboratorium?',
  'Hasil laboratorium biasanya dapat diambil 1-3 hari kerja setelah pengambilan sampel. Anda akan dihubungi ketika hasil sudah siap, atau dapat dicek melalui aplikasi mobile kami.'
),
(
  'Apakah ada program medical check up?',
  'Ya, kami memiliki berbagai paket medical check up mulai dari basic hingga executive. Paket dapat disesuaikan dengan kebutuhan dan usia Anda.'
),
(
  'Bagaimana kebijakan pembayaran di klinik?',
  'Kami menerima pembayaran tunai, kartu debit/kredit, transfer bank, dan BPJS. Untuk tindakan tertentu, mungkin diperlukan uang muka sebelum perawatan.'
),
(
  'Apakah ada fasilitas parkir?',
  'Ya, kami menyediakan area parkir yang luas dan aman untuk mobil dan motor. Parkir gratis untuk semua pasien dan pengunjung.'
);

-- ============================================
-- 5. PARTNERS SEEDER
-- ============================================
INSERT INTO partners (
  name,
  image_url,
  link
) VALUES
(
  'BPJS Kesehatan',
  'https://via.placeholder.com/200x100/4F46E5/FFFFFF?text=BPJS',
  'https://bpjs-kesehatan.go.id'
),
(
  'Allianz Insurance',
  'https://via.placeholder.com/200x100/059669/FFFFFF?text=Allianz',
  'https://allianz.co.id'
),
(
  'AXA Mandiri',
  'https://via.placeholder.com/200x100/DC2626/FFFFFF?text=AXA',
  'https://axa-mandiri.co.id'
),
(
  'Prudential Indonesia',
  'https://via.placeholder.com/200x100/7C3AED/FFFFFF?text=Prudential',
  'https://prudential.co.id'
),
(
  'Great Eastern',
  'https://via.placeholder.com/200x100/EC4899/FFFFFF?text=Great+Eastern',
  'https://greateastern.co.id'
),
(
  'Siloam Hospitals',
  'https://via.placeholder.com/200x100/F59E0B/FFFFFF?text=Siloam',
  'https://siloamhospitals.com'
),
(
  'Kimia Farma',
  'https://via.placeholder.com/200x100/10B981/FFFFFF?text=Kimia+Farma',
  'https://kimiafarma.co.id'
),
(
  'Biofarma',
  'https://via.placeholder.com/200x100/8B5CF6/FFFFFF?text=Biofarma',
  'https://biofarma.co.id'
),
(
  'RS Universitas Indonesia',
  'https://via.placeholder.com/200x100/6366F1/FFFFFF?text=RSUI',
  'https://rscm.ui.ac.id'
),
(
  'Mayapada Healthcare',
  'https://via.placeholder.com/200x100/EF4444/FFFFFF?text=Mayapada',
  'https://mayapadahealthcare.com'
);

-- ============================================
-- 6. UPDATE CLINIC SETTINGS
-- ============================================
UPDATE clinic_settings SET
  clinic_name = 'Klinik Taksim Medika',
  address = 'Jl. Taksim Raya No. 123, Menteng, Jakarta Pusat 10310',
  phone = '+62-21-1234567',
  email = 'info@taksimmedika.com',
  maintenance_mode = FALSE;

-- ============================================
-- SEEDER COMPLETED
-- ============================================