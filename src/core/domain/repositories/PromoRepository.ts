import { Promo } from '../entities/Promo'
import { EntityId } from '../value-objects/EntityId'

export interface PromoRepository {
  findById(id: EntityId): Promise<Promo | null>
  findAll(): Promise<Promo[]>
  findActiveOnly(): Promise<Promo[]>
  findCurrentlyActive(): Promise<Promo[]>
  save(promo: Promo): Promise<Promo>
  update(id: EntityId, promo: Promo): Promise<Promo>
  delete(id: EntityId): Promise<void>
  exists(id: EntityId): Promise<boolean>
}