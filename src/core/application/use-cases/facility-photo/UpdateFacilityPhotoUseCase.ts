import { FacilityPhoto } from '../../../domain/entities/FacilityPhoto'
import { EntityId } from '../../../domain/value-objects/EntityId'
import { FacilityPhotoRepository } from '../../../domain/repositories/FacilityPhotoRepository'
import { NotFoundError, ValidationError } from '../../../../shared/errors/DomainError'

export interface UpdateFacilityPhotoRequest {
  imageUrl?: string
  title?: string
  description?: string
}

export class UpdateFacilityPhotoUseCase {
  constructor(private facilityPhotoRepository: FacilityPhotoRepository) {}

  async execute(id: string, request: UpdateFacilityPhotoRequest): Promise<FacilityPhoto> {
    try {
      const entityId = new EntityId(id)
      const facilityPhoto = await this.facilityPhotoRepository.findById(entityId)
      
      if (!facilityPhoto) {
        throw new NotFoundError('Facility photo', id)
      }

      facilityPhoto.updateDetails(request)
      
      return await this.facilityPhotoRepository.update(entityId, facilityPhoto)
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      if (error instanceof Error) {
        throw new ValidationError(error.message)
      }
      throw error
    }
  }
}