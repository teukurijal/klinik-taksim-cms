import { Doctor, Gender, DoctorSchedule } from '../../../domain/entities/Doctor'
import { EntityId } from '../../../domain/value-objects/EntityId'
import { Email } from '../../../domain/value-objects/Email'
import { PhoneNumber } from '../../../domain/value-objects/PhoneNumber'
import { DoctorRepository } from '../../../domain/repositories/DoctorRepository'
import { NotFoundError, ValidationError } from '../../../../shared/errors/DomainError'

export interface UpdateDoctorRequest {
  fullName?: string
  specialist?: string
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
      
      if (request.phoneNumber) {
        phoneNumber = new PhoneNumber(request.phoneNumber)
      }

      doctor.updateProfile({
        ...request,
        email,
        phoneNumber
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