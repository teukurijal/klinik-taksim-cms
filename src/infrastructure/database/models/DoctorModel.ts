import { Doctor, Gender, DoctorStatus, DoctorSchedule } from '../../../core/domain/entities/Doctor'
import { EntityId } from '../../../core/domain/value-objects/EntityId'
import { Email } from '../../../core/domain/value-objects/Email'
import { PhoneNumber } from '../../../core/domain/value-objects/PhoneNumber'

export interface DoctorRow {
  id: string
  full_name: string
  photo_url?: string
  specialist: string
  education?: string
  experience?: string
  schedule?: unknown
  str_number?: string
  sip_number?: string
  status: string
  phone_number?: string
  email?: string
  gender?: string
  years_of_practice?: number
  clinic_room?: string
  created_at: string
  updated_at: string
}

export class DoctorModel {
  static toDomain(row: DoctorRow): Doctor {
    const email = row.email ? new Email(row.email) : undefined
    const phoneNumber = row.phone_number ? new PhoneNumber(row.phone_number) : undefined

    return new Doctor(
      new EntityId(row.id),
      row.full_name,
      row.specialist,
      row.status as DoctorStatus,
      row.photo_url,
      row.education,
      row.experience,
      row.schedule as DoctorSchedule,
      row.str_number,
      row.sip_number,
      phoneNumber,
      email,
      row.gender as Gender,
      row.years_of_practice,
      row.clinic_room,
      new Date(row.created_at),
      new Date(row.updated_at)
    )
  }

  static fromDomain(doctor: Doctor): Omit<DoctorRow, 'created_at' | 'updated_at'> {
    return {
      id: doctor.getId().getValue(),
      full_name: doctor.getFullName(),
      photo_url: doctor.getPhotoUrl(),
      specialist: doctor.getSpecialist(),
      education: doctor.getEducation(),
      experience: doctor.getExperience(),
      schedule: doctor.getSchedule(),
      str_number: doctor.getStrNumber(),
      sip_number: doctor.getSipNumber(),
      status: doctor.getStatus(),
      phone_number: doctor.getPhoneNumber()?.getValue(),
      email: doctor.getEmail()?.getValue(),
      gender: doctor.getGender(),
      years_of_practice: doctor.getYearsOfPractice(),
      clinic_room: doctor.getClinicRoom()
    }
  }
}