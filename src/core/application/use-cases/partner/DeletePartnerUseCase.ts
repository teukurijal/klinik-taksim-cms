import { EntityId } from '../../../domain/value-objects/EntityId'
import { PartnerRepository } from '../../../domain/repositories/PartnerRepository'
import { NotFoundError } from '../../../../shared/errors/DomainError'

export class DeletePartnerUseCase {
  constructor(private partnerRepository: PartnerRepository) {}

  async execute(id: string): Promise<void> {
    const partnerId = new EntityId(id)
    const exists = await this.partnerRepository.exists(partnerId)
    
    if (!exists) {
      throw new NotFoundError('Partner', id)
    }

    await this.partnerRepository.delete(partnerId)
  }
}