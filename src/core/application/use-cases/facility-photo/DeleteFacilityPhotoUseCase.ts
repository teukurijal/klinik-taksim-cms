import { EntityId } from '../../../domain/value-objects/EntityId'
import { FacilityPhotoRepository } from '../../../domain/repositories/FacilityPhotoRepository'
import { NotFoundError } from '../../../../shared/errors/DomainError'

export class DeleteFacilityPhotoUseCase {
  constructor(private facilityPhotoRepository: FacilityPhotoRepository) {}

  async execute(id: string): Promise<void> {
    const entityId = new EntityId(id)
    
    const exists = await this.facilityPhotoRepository.exists(entityId)
    if (!exists) {
      throw new NotFoundError('Facility photo', id)
    }
    
    await this.facilityPhotoRepository.delete(entityId)
  }
}