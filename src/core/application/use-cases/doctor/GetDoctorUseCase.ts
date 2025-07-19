import { Doctor } from '../../../domain/entities/Doctor'
import { EntityId } from '../../../domain/value-objects/EntityId'
import { DoctorRepository } from '../../../domain/repositories/DoctorRepository'
import { NotFoundError } from '../../../../shared/errors/DomainError'

export class GetDoctorUseCase {
  constructor(private doctorRepository: DoctorRepository) {}

  async execute(id: string): Promise<Doctor> {
    const entityId = new EntityId(id)
    const doctor = await this.doctorRepository.findById(entityId)
    
    if (!doctor) {
      throw new NotFoundError('Doctor', id)
    }
    
    return doctor
  }
}