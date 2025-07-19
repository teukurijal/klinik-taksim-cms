import { FacilityPhoto } from '../../../core/domain/entities/FacilityPhoto'
import { EntityId } from '../../../core/domain/value-objects/EntityId'

export interface FacilityPhotoRow {
  id: string
  image_url: string
  title?: string
  description?: string
  created_at: string
  updated_at: string
}

export class FacilityPhotoModel {
  static toDomain(row: FacilityPhotoRow): FacilityPhoto {
    return new FacilityPhoto(
      new EntityId(row.id),
      row.image_url,
      row.title,
      row.description,
      new Date(row.created_at),
      new Date(row.updated_at)
    )
  }

  static fromDomain(facilityPhoto: FacilityPhoto): Omit<FacilityPhotoRow, 'id' | 'created_at' | 'updated_at'> {
    return {
      image_url: facilityPhoto.getImageUrl(),
      title: facilityPhoto.getTitle(),
      description: facilityPhoto.getDescription()
    }
  }
}