import { Partner } from '../entities/Partner'
import { EntityId } from '../value-objects/EntityId'

export interface PartnerRepository {
  findById(id: EntityId): Promise<Partner | null>
  findAll(): Promise<Partner[]>
  save(partner: Partner): Promise<Partner>
  update(id: EntityId, partner: Partner): Promise<Partner>
  delete(id: EntityId): Promise<void>
  exists(id: EntityId): Promise<boolean>
}