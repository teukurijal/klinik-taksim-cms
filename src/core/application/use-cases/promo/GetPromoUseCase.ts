import { Promo } from '../../../domain/entities/Promo'
import { EntityId } from '../../../domain/value-objects/EntityId'
import { PromoRepository } from '../../../domain/repositories/PromoRepository'
import { NotFoundError } from '../../../../shared/errors/DomainError'

export class GetPromoUseCase {
  constructor(private promoRepository: PromoRepository) {}

  async execute(id: string): Promise<Promo> {
    const entityId = new EntityId(id)
    const promo = await this.promoRepository.findById(entityId)
    
    if (!promo) {
      throw new NotFoundError('Promo', id)
    }
    
    return promo
  }
}

export class GetAllPromosUseCase {
  constructor(private promoRepository: PromoRepository) {}

  async execute(): Promise<Promo[]> {
    return await this.promoRepository.findAll()
  }
}

export class GetActivePromosUseCase {
  constructor(private promoRepository: PromoRepository) {}

  async execute(): Promise<Promo[]> {
    return await this.promoRepository.findActiveOnly()
  }
}

export class GetCurrentlyActivePromosUseCase {
  constructor(private promoRepository: PromoRepository) {}

  async execute(): Promise<Promo[]> {
    return await this.promoRepository.findCurrentlyActive()
  }
}