import { EntityId } from '../../../domain/value-objects/EntityId'
import { DoctorRepository } from '../../../domain/repositories/DoctorRepository'
import { NotFoundError } from '../../../../shared/errors/DomainError'

export class DeleteDoctorUseCase {
  constructor(private doctorRepository: DoctorRepository) {}

  async execute(id: string): Promise<void> {
    const entityId = new EntityId(id)
    
    const exists = await this.doctorRepository.exists(entityId)
    if (!exists) {
      throw new NotFoundError('Doctor', id)
    }
    
    await this.doctorRepository.delete(entityId)
  }
}