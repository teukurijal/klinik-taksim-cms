import { Partner } from '../../../domain/entities/Partner'
import { EntityId } from '../../../domain/value-objects/EntityId'
import { PartnerRepository } from '../../../domain/repositories/PartnerRepository'
import { NotFoundError, ValidationError } from '../../../../shared/errors/DomainError'

export interface UpdatePartnerRequest {
  imageUrl?: string
  name?: string
  link?: string
}

export class UpdatePartnerUseCase {
  constructor(private partnerRepository: PartnerRepository) {}

  async execute(id: string, request: UpdatePartnerRequest): Promise<Partner> {
    try {
      const partnerId = new EntityId(id)
      const existingPartner = await this.partnerRepository.findById(partnerId)
      
      if (!existingPartner) {
        throw new NotFoundError('Partner', id)
      }

      existingPartner.updateDetails({
        imageUrl: request.imageUrl,
        name: request.name,
        link: request.link
      })

      return await this.partnerRepository.update(partnerId, existingPartner)
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      if (error instanceof Error) {
        throw new ValidationError(error.message)
      }
      throw error
    }
  }
}