import { PolyClinic } from '../entities/PolyClinic'
import { EntityId } from '../value-objects/EntityId'

export interface PolyClinicRepository {
  findById(id: EntityId): Promise<PolyClinic | null>
  findAll(): Promise<PolyClinic[]>
  findByStatus(status: string): Promise<PolyClinic[]>
  save(polyClinic: PolyClinic): Promise<PolyClinic>
  update(id: EntityId, polyClinic: PolyClinic): Promise<PolyClinic>
  delete(id: EntityId): Promise<void>
  exists(id: EntityId): Promise<boolean>
}