import { FacilityPhoto } from '../entities/FacilityPhoto'
import { EntityId } from '../value-objects/EntityId'

export interface FacilityPhotoRepository {
  findById(id: EntityId): Promise<FacilityPhoto | null>
  findAll(): Promise<FacilityPhoto[]>
  save(facilityPhoto: FacilityPhoto): Promise<FacilityPhoto>
  update(id: EntityId, facilityPhoto: FacilityPhoto): Promise<FacilityPhoto>
  delete(id: EntityId): Promise<void>
  exists(id: EntityId): Promise<boolean>
}