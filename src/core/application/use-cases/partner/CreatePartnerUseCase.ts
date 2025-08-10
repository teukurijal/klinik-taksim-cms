import { Partner } from '../../../domain/entities/Partner'
import { EntityId } from '../../../domain/value-objects/EntityId'
import { PartnerRepository } from '../../../domain/repositories/PartnerRepository'
import { ValidationError } from '../../../../shared/errors/DomainError'

export interface CreatePartnerRequest {
  imageUrl: string
  name?: string
  link?: string
}

export class CreatePartnerUseCase {
  constructor(private partnerRepository: PartnerRepository) {}

  async execute(request: CreatePartnerRequest): Promise<Partner> {
    try {
      const id = new EntityId(crypto.randomUUID())
      
      const partner = new Partner(
        id,
        request.imageUrl,
        request.name,
        request.link
      )

      return await this.partnerRepository.save(partner)
    } catch (error) {
      if (error instanceof Error) {
        throw new ValidationError(error.message)
      }
      throw error
    }
  }
}