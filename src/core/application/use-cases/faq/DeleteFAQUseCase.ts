import { EntityId } from '../../../domain/value-objects/EntityId'
import { FAQRepository } from '../../../domain/repositories/FAQRepository'
import { NotFoundError } from '../../../../shared/errors/DomainError'

export class DeleteFAQUseCase {
  constructor(private faqRepository: FAQRepository) {}

  async execute(id: string): Promise<void> {
    const faqId = new EntityId(id)
    
    const exists = await this.faqRepository.exists(faqId)
    if (!exists) {
      throw new NotFoundError('FAQ', id)
    }

    await this.faqRepository.delete(faqId)
  }
}