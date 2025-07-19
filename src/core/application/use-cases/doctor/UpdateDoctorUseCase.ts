import { Doctor, Gender, DoctorSchedule } from '../../../domain/entities/Doctor'
import { EntityId } from '../../../domain/value-objects/EntityId'
import { Email } from '../../../domain/value-objects/Email'
import { PhoneNumber } from '../../../domain/value-objects/PhoneNumber'
import { DoctorRepository } from '../../../domain/repositories/DoctorRepository'
import { NotFoundError, ValidationError } from '../../../../shared/errors/DomainError'

export interface UpdateDoctorRequest {
  full_name?: string
  specialist?: string
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

export class UpdateDoctorUseCase {
  constructor(private doctorRepository: DoctorRepository) {}

  async execute(id: string, request: UpdateDoctorRequest): Promise<Doctor> {
    const entityId = new EntityId(id)
    const doctor = await this.doctorRepository.findById(entityId)
    
    if (!doctor) {
      throw new NotFoundError('Doctor', id)
    }

    try {
      let email: Email | undefined
      let phoneNumber: PhoneNumber | undefined

      if (request.email) {
        email = new Email(request.email)
      }
      
      if (request.phone_number) {
        phoneNumber = new PhoneNumber(request.phone_number)
      }

      doctor.updateProfile({
        fullName: request.full_name,
        specialist: request.specialist,
        photoUrl: request.photo_url,
        education: request.education,
        experience: request.experience,
        strNumber: request.str_number,
        sipNumber: request.sip_number,
        phoneNumber,
        email,
        gender: request.gender,
        yearsOfPractice: request.years_of_practice,
        clinicRoom: request.clinic_room
      })

      if (request.schedule) {
        doctor.updateSchedule(request.schedule)
      }

      return await this.doctorRepository.update(entityId, doctor)
    } catch (error) {
      if (error instanceof Error) {
        throw new ValidationError(error.message)
      }
      throw error
    }
  }
}