import { Promo } from '../../../domain/entities/Promo'
import { EntityId } from '../../../domain/value-objects/EntityId'
import { PromoRepository } from '../../../domain/repositories/PromoRepository'
import { NotFoundError, ValidationError } from '../../../../shared/errors/DomainError'

export interface UpdatePromoRequest {
  title?: string
  description?: string
  imageUrl?: string
  startDate?: Date
  endDate?: Date
}

export class UpdatePromoUseCase {
  constructor(private promoRepository: PromoRepository) {}

  async execute(id: string, request: UpdatePromoRequest): Promise<Promo> {
    const entityId = new EntityId(id)
    const promo = await this.promoRepository.findById(entityId)
    
    if (!promo) {
      throw new NotFoundError('Promo', id)
    }

    try {
      promo.updateDetails(request)
      return await this.promoRepository.update(entityId, promo)
    } catch (error) {
      if (error instanceof Error) {
        throw new ValidationError(error.message)
      }
      throw error
    }
  }
}