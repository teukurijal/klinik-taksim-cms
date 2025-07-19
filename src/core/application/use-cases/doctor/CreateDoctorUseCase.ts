import { Doctor, Gender, DoctorStatus, DoctorSchedule } from '../../../domain/entities/Doctor'
import { EntityId } from '../../../domain/value-objects/EntityId'
import { Email } from '../../../domain/value-objects/Email'
import { PhoneNumber } from '../../../domain/value-objects/PhoneNumber'
import { DoctorRepository } from '../../../domain/repositories/DoctorRepository'
import { ValidationError } from '../../../../shared/errors/DomainError'

export interface CreateDoctorRequest {
  fullName: string
  specialist: string
  photoUrl?: string
  education?: string
  experience?: string
  schedule?: DoctorSchedule
  strNumber?: string
  sipNumber?: string
  phoneNumber?: string
  email?: string
  gender?: Gender
  yearsOfPractice?: number
  clinicRoom?: string
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
      
      if (request.phoneNumber) {
        phoneNumber = new PhoneNumber(request.phoneNumber)
      }

      const doctor = new Doctor(
        id,
        request.fullName,
        request.specialist,
        DoctorStatus.ACTIVE,
        request.photoUrl,
        request.education,
        request.experience,
        request.schedule,
        request.strNumber,
        request.sipNumber,
        phoneNumber,
        email,
        request.gender,
        request.yearsOfPractice,
        request.clinicRoom
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