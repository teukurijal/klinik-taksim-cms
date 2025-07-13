import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const doctorsData = [
  {
    full_name: 'Dr. Ahmad Prasetyo, Sp.JP',
    specialist: 'Cardiologist',
    education: 'Doctor of Medicine (MD) - University of Indonesia, Cardiology Specialist - National Cardiac Center',
    experience: 'Experienced cardiologist with expertise in interventional cardiology, echocardiography, and cardiac catheterization. Specializes in treating coronary artery disease, heart failure, and arrhythmias.',
    schedule: {
      monday: { start: '07:30', end: '16:30' },
      tuesday: { start: '07:30', end: '16:30' },
      wednesday: { start: '07:30', end: '16:30' },
      thursday: { start: '07:30', end: '16:30' },
      friday: { start: '07:30', end: '16:30' },
      saturday: { start: '08:00', end: '12:00' },
      sunday: null
    },
    str_number: 'STR-123456789',
    sip_number: 'SIP-987654321',
    phone_number: '+62-812-3456-7890',
    email: 'ahmad.prasetyo@taksimmedika.com',
    gender: 'male',
    years_of_practice: 15,
    clinic_room: 'Room 101',
    status: 'active'
  },
  {
    full_name: 'Dr. Sari Wijayanti, Sp.OG',
    specialist: 'Gynecologist & Obstetrician',
    education: 'Doctor of Medicine (MD) - Gadjah Mada University, Obstetrics & Gynecology Specialist - Dr. Sardjito Hospital',
    experience: 'Specialist in womens health, pregnancy care, and minimally invasive gynecological procedures. Expert in high-risk pregnancy management and reproductive health.',
    schedule: {
      monday: { start: '08:00', end: '17:00' },
      tuesday: { start: '08:00', end: '17:00' },
      wednesday: { start: '08:00', end: '17:00' },
      thursday: { start: '08:00', end: '17:00' },
      friday: { start: '08:00', end: '17:00' },
      saturday: { start: '08:00', end: '14:00' },
      sunday: { start: '09:00', end: '12:00' }
    },
    str_number: 'STR-234567890',
    sip_number: 'SIP-876543210',
    phone_number: '+62-813-4567-8901',
    email: 'sari.wijayanti@taksimmedika.com',
    gender: 'female',
    years_of_practice: 12,
    clinic_room: 'Room 102',
    status: 'active'
  },
  {
    full_name: 'Dr. Budi Santoso, Sp.A',
    specialist: 'Pediatrician',
    education: 'Doctor of Medicine (MD) - Airlangga University, Pediatrics Specialist - Dr. Soetomo Hospital',
    experience: 'Dedicated pediatrician with extensive experience in child development, vaccination programs, and pediatric emergency care. Specializes in neonatal care and childhood diseases.',
    schedule: {
      monday: { start: '07:00', end: '15:00' },
      tuesday: { start: '07:00', end: '15:00' },
      wednesday: { start: '07:00', end: '15:00' },
      thursday: { start: '07:00', end: '15:00' },
      friday: { start: '07:00', end: '15:00' },
      saturday: { start: '08:00', end: '12:00' },
      sunday: null
    },
    str_number: 'STR-345678901',
    sip_number: 'SIP-765432109',
    phone_number: '+62-814-5678-9012',
    email: 'budi.santoso@taksimmedika.com',
    gender: 'male',
    years_of_practice: 10,
    clinic_room: 'Room 103',
    status: 'active'
  },
  {
    full_name: 'Dr. Maya Kusuma, Sp.M',
    specialist: 'Ophthalmologist',
    education: 'Doctor of Medicine (MD) - Padjadjaran University, Ophthalmology Specialist - Cicendo Eye Hospital',
    experience: 'Eye specialist with expertise in cataract surgery, retinal diseases, and refractive surgery. Experienced in both medical and surgical treatment of eye conditions.',
    schedule: {
      monday: { start: '09:00', end: '18:00' },
      tuesday: { start: '09:00', end: '18:00' },
      wednesday: null,
      thursday: { start: '09:00', end: '18:00' },
      friday: { start: '09:00', end: '18:00' },
      saturday: { start: '09:00', end: '13:00' },
      sunday: null
    },
    str_number: 'STR-456789012',
    sip_number: 'SIP-654321098',
    phone_number: '+62-815-6789-0123',
    email: 'maya.kusuma@taksimmedika.com',
    gender: 'female',
    years_of_practice: 8,
    clinic_room: 'Room 104',
    status: 'active'
  },
  {
    full_name: 'Dr. Rizki Permana, Sp.OT',
    specialist: 'Orthopedic Surgeon',
    education: 'Doctor of Medicine (MD) - University of Indonesia, Orthopedic Surgery Specialist - Cipto Mangunkusumo Hospital',
    experience: 'Orthopedic surgeon specializing in trauma surgery, joint replacement, and sports medicine. Expert in minimally invasive orthopedic procedures.',
    schedule: {
      monday: { start: '06:30', end: '15:30' },
      tuesday: { start: '06:30', end: '15:30' },
      wednesday: { start: '06:30', end: '15:30' },
      thursday: { start: '06:30', end: '15:30' },
      friday: { start: '06:30', end: '15:30' },
      saturday: { start: '07:00', end: '11:00' },
      sunday: { start: '08:00', end: '12:00' }
    },
    str_number: 'STR-567890123',
    sip_number: 'SIP-543210987',
    phone_number: '+62-816-7890-1234',
    email: 'rizki.permana@taksimmedika.com',
    gender: 'male',
    years_of_practice: 14,
    clinic_room: 'Room 105',
    status: 'active'
  },
  {
    full_name: 'Dr. Indira Sari, Sp.KK',
    specialist: 'Dermatologist',
    education: 'Doctor of Medicine (MD) - Diponegoro University, Dermatology & Venereology Specialist - Dr. Kariadi Hospital',
    experience: 'Dermatologist with expertise in medical dermatology, cosmetic procedures, and dermatopathology. Specializes in acne treatment, anti-aging procedures, and skin cancer screening.',
    schedule: {
      monday: { start: '10:00', end: '19:00' },
      tuesday: { start: '10:00', end: '19:00' },
      wednesday: { start: '10:00', end: '19:00' },
      thursday: { start: '10:00', end: '19:00' },
      friday: { start: '10:00', end: '19:00' },
      saturday: { start: '09:00', end: '15:00' },
      sunday: null
    },
    str_number: 'STR-678901234',
    sip_number: 'SIP-432109876',
    phone_number: '+62-817-8901-2345',
    email: 'indira.sari@taksimmedika.com',
    gender: 'female',
    years_of_practice: 9,
    clinic_room: 'Room 106',
    status: 'active'
  },
  {
    full_name: 'Dr. Faisal Rahman, Sp.U',
    specialist: 'Urologist',
    education: 'Doctor of Medicine (MD) - Hasanuddin University, Urology Specialist - Wahidin Sudirohusodo Hospital',
    experience: 'Urologist with expertise in minimally invasive urological procedures, kidney stone treatment, and male reproductive health. Experienced in laparoscopic and robotic surgery.',
    schedule: {
      monday: { start: '08:00', end: '16:00' },
      tuesday: { start: '08:00', end: '16:00' },
      wednesday: { start: '08:00', end: '16:00' },
      thursday: null,
      friday: { start: '08:00', end: '16:00' },
      saturday: { start: '08:00', end: '12:00' },
      sunday: null
    },
    str_number: 'STR-789012345',
    sip_number: 'SIP-321098765',
    phone_number: '+62-818-9012-3456',
    email: 'faisal.rahman@taksimmedika.com',
    gender: 'male',
    years_of_practice: 11,
    clinic_room: 'Room 107',
    status: 'active'
  },
  {
    full_name: 'Dr. Dewi Hartono, Sp.S',
    specialist: 'Neurologist',
    education: 'Doctor of Medicine (MD) - University of Indonesia, Neurology Specialist - Cipto Mangunkusumo Hospital',
    experience: 'Neurologist specializing in stroke management, epilepsy treatment, and neurodegenerative diseases. Expert in neurophysiology and movement disorders.',
    schedule: {
      monday: { start: '07:00', end: '17:00' },
      tuesday: { start: '07:00', end: '17:00' },
      wednesday: { start: '07:00', end: '17:00' },
      thursday: { start: '07:00', end: '17:00' },
      friday: { start: '07:00', end: '17:00' },
      saturday: { start: '08:00', end: '13:00' },
      sunday: { start: '08:00', end: '12:00' }
    },
    str_number: 'STR-890123456',
    sip_number: 'SIP-210987654',
    phone_number: '+62-819-0123-4567',
    email: 'dewi.hartono@taksimmedika.com',
    gender: 'female',
    years_of_practice: 13,
    clinic_room: 'Room 108',
    status: 'active'
  },
  {
    full_name: 'Dr. Andi Surya, Sp.PD',
    specialist: 'Internal Medicine Specialist',
    education: 'Doctor of Medicine (MD) - Brawijaya University, Internal Medicine Specialist - Dr. Saiful Anwar Hospital',
    experience: 'Internal medicine specialist with expertise in diabetes management, hypertension, and preventive medicine. Experienced in comprehensive adult healthcare and chronic disease management.',
    schedule: {
      monday: { start: '06:00', end: '14:00' },
      tuesday: { start: '06:00', end: '14:00' },
      wednesday: { start: '06:00', end: '14:00' },
      thursday: { start: '06:00', end: '14:00' },
      friday: { start: '06:00', end: '14:00' },
      saturday: { start: '07:00', end: '11:00' },
      sunday: null
    },
    str_number: 'STR-901234567',
    sip_number: 'SIP-109876543',
    phone_number: '+62-820-1234-5678',
    email: 'andi.surya@taksimmedika.com',
    gender: 'male',
    years_of_practice: 16,
    clinic_room: 'Room 109',
    status: 'active'
  },
  {
    full_name: 'Dr. Ratna Melati, Sp.THT-KL',
    specialist: 'ENT Specialist',
    education: 'Doctor of Medicine (MD) - Sebelas Maret University, ENT Surgery Specialist - Dr. Moewardi Hospital',
    experience: 'ENT specialist with expertise in sinus surgery, hearing disorders, and head and neck surgery. Experienced in both medical and surgical treatment of ear, nose, and throat conditions.',
    schedule: {
      monday: { start: '08:30', end: '17:30' },
      tuesday: { start: '08:30', end: '17:30' },
      wednesday: { start: '08:30', end: '17:30' },
      thursday: { start: '08:30', end: '17:30' },
      friday: { start: '08:30', end: '17:30' },
      saturday: null,
      sunday: { start: '09:00', end: '13:00' }
    },
    str_number: 'STR-012345678',
    sip_number: 'SIP-098765432',
    phone_number: '+62-821-2345-6789',
    email: 'ratna.melati@taksimmedika.com',
    gender: 'female',
    years_of_practice: 7,
    clinic_room: 'Room 110',
    status: 'active'
  }
]

export async function POST() {
  try {
    // Check if doctors already exist to prevent duplicate seeding
    const { data: existingDoctors, error: checkError } = await supabase
      .from('doctors')
      .select('id')
      .limit(1)

    if (checkError) {
      return NextResponse.json({ error: 'Failed to check existing doctors' }, { status: 500 })
    }

    if (existingDoctors && existingDoctors.length > 0) {
      return NextResponse.json({ 
        message: 'Doctors already exist in database. Seeding skipped.',
        count: 0
      }, { status: 200 })
    }

    // Insert doctors data
    const { data, error } = await supabase
      .from('doctors')
      .insert(doctorsData)
      .select()

    if (error) {
      console.error('Seeding error:', error)
      return NextResponse.json({ error: 'Failed to seed doctors' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Doctors seeded successfully',
      count: data?.length || 0,
      data
    }, { status: 201 })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}