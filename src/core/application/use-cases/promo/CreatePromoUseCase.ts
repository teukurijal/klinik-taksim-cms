import { Promo, PromoStatus } from '../../../domain/entities/Promo'
import { EntityId } from '../../../domain/value-objects/EntityId'
import { PromoRepository } from '../../../domain/repositories/PromoRepository'
import { ValidationError } from '../../../../shared/errors/DomainError'

export interface CreatePromoRequest {
  title: string
  description: string
  imageUrl?: string
  startDate?: Date
  endDate?: Date
}

export class CreatePromoUseCase {
  constructor(private promoRepository: PromoRepository) {}

  async execute(request: CreatePromoRequest): Promise<Promo> {
    try {
      const id = new EntityId(crypto.randomUUID())
      
      const promo = new Promo(
        id,
        request.title,
        request.description,
        PromoStatus.ACTIVE,
        request.imageUrl,
        request.startDate,
        request.endDate
      )

      return await this.promoRepository.save(promo)
    } catch (error) {
      if (error instanceof Error) {
        throw new ValidationError(error.message)
      }
      throw error
    }
  }
}