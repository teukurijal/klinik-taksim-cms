import { Partner } from '../../../domain/entities/Partner'
import { EntityId } from '../../../domain/value-objects/EntityId'
import { PartnerRepository } from '../../../domain/repositories/PartnerRepository'
import { NotFoundError } from '../../../../shared/errors/DomainError'

export class GetPartnerUseCase {
  constructor(private partnerRepository: PartnerRepository) {}

  async execute(id: string): Promise<Partner> {
    const partnerId = new EntityId(id)
    const partner = await this.partnerRepository.findById(partnerId)
    
    if (!partner) {
      throw new NotFoundError('Partner', id)
    }

    return partner
  }
}

export class GetAllPartnersUseCase {
  constructor(private partnerRepository: PartnerRepository) {}

  async execute(): Promise<Partner[]> {
    return await this.partnerRepository.findAll()
  }
}