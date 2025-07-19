import { FacilityPhoto } from '../../../domain/entities/FacilityPhoto'
import { EntityId } from '../../../domain/value-objects/EntityId'
import { FacilityPhotoRepository } from '../../../domain/repositories/FacilityPhotoRepository'
import { NotFoundError } from '../../../../shared/errors/DomainError'

export class GetFacilityPhotoUseCase {
  constructor(private facilityPhotoRepository: FacilityPhotoRepository) {}

  async execute(id: string): Promise<FacilityPhoto> {
    const entityId = new EntityId(id)
    const facilityPhoto = await this.facilityPhotoRepository.findById(entityId)
    
    if (!facilityPhoto) {
      throw new NotFoundError('Facility photo', id)
    }
    
    return facilityPhoto
  }
}

export class GetAllFacilityPhotosUseCase {
  constructor(private facilityPhotoRepository: FacilityPhotoRepository) {}

  async execute(): Promise<FacilityPhoto[]> {
    return await this.facilityPhotoRepository.findAll()
  }
}