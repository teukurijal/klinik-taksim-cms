import { FAQ } from '../entities/FAQ'
import { EntityId } from '../value-objects/EntityId'

export interface FAQRepository {
  findById(id: EntityId): Promise<FAQ | null>
  findAll(): Promise<FAQ[]>
  save(faq: FAQ): Promise<FAQ>
  update(id: EntityId, faq: FAQ): Promise<FAQ>
  delete(id: EntityId): Promise<void>
  exists(id: EntityId): Promise<boolean>
}