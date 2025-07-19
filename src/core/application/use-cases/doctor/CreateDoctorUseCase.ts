import { Doctor, Gender, DoctorStatus, DoctorSchedule } from '../../../domain/entities/Doctor'
import { EntityId } from '../../../domain/value-objects/EntityId'
import { Email } from '../../../domain/value-objects/Email'
import { PhoneNumber } from '../../../domain/value-objects/PhoneNumber'
import { DoctorRepository } from '../../../domain/repositories/DoctorRepository'
import { ValidationError } from '../../../../shared/errors/DomainError'

export interface CreateDoctorRequest {
  full_name: string
  specialist: string
  photo_url?: string
  education?: string
  experience?: string
  schedule?: DoctorSchedule
  str_number?: string
  sip_number?: string
  phone_number?: string
  email?: string
  gender?: Gender
  years_of_practice?: number
  clinic_room?: string
}

export class CreateDoctorUseCase {
  constructor(private doctorRepository: DoctorRepository) {}

  async execute(request: CreateDoctorRequest): Promise<Doctor> {
    const id = new EntityId(crypto.randomUUID())
    
    let email: Email | undefined
    let phoneNumber: PhoneNumber | undefined

    try {
      if (request.email) {
        email = new Email(request.email)
      }
      
      if (request.phone_number) {
        phoneNumber = new PhoneNumber(request.phone_number)
      }

      const doctor = new Doctor(
        id,
        request.full_name,
        request.specialist,
        DoctorStatus.ACTIVE,
        request.photo_url,
        request.education,
        request.experience,
        request.schedule,
        request.str_number,
        request.sip_number,
        phoneNumber,
        email,
        request.gender,
        request.years_of_practice,
        request.clinic_room
      )

      return await this.doctorRepository.save(doctor)
    } catch (error) {
      if (error instanceof Error) {
        throw new ValidationError(error.message)
      }
      throw error
    }
  }
}