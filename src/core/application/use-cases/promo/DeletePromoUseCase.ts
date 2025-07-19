import { EntityId } from '../../../domain/value-objects/EntityId'
import { PromoRepository } from '../../../domain/repositories/PromoRepository'
import { NotFoundError } from '../../../../shared/errors/DomainError'

export class DeletePromoUseCase {
  constructor(private promoRepository: PromoRepository) {}

  async execute(id: string): Promise<void> {
    const entityId = new EntityId(id)
    
    const exists = await this.promoRepository.exists(entityId)
    if (!exists) {
      throw new NotFoundError('Promo', id)
    }
    
    await this.promoRepository.delete(entityId)
  }
}