import { FacilityPhoto } from '../../../domain/entities/FacilityPhoto'
import { EntityId } from '../../../domain/value-objects/EntityId'
import { FacilityPhotoRepository } from '../../../domain/repositories/FacilityPhotoRepository'
import { ValidationError } from '../../../../shared/errors/DomainError'

export interface CreateFacilityPhotoRequest {
  imageUrl: string
  title?: string
  description?: string
}

export class CreateFacilityPhotoUseCase {
  constructor(private facilityPhotoRepository: FacilityPhotoRepository) {}

  async execute(request: CreateFacilityPhotoRequest): Promise<FacilityPhoto> {
    try {
      const id = new EntityId(crypto.randomUUID())
      
      const facilityPhoto = new FacilityPhoto(
        id,
        request.imageUrl,
        request.title,
        request.description
      )

      return await this.facilityPhotoRepository.save(facilityPhoto)
    } catch (error) {
      if (error instanceof Error) {
        throw new ValidationError(error.message)
      }
      throw error
    }
  }
}