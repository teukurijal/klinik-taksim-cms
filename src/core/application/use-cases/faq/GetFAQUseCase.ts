import { FAQ } from '../../../domain/entities/FAQ'
import { EntityId } from '../../../domain/value-objects/EntityId'
import { FAQRepository } from '../../../domain/repositories/FAQRepository'
import { NotFoundError } from '../../../../shared/errors/DomainError'

export class GetFAQUseCase {
  constructor(private faqRepository: FAQRepository) {}

  async execute(id: string): Promise<FAQ> {
    const faqId = new EntityId(id)
    const faq = await this.faqRepository.findById(faqId)
    
    if (!faq) {
      throw new NotFoundError('FAQ', id)
    }

    return faq
  }
}

export class GetAllFAQsUseCase {
  constructor(private faqRepository: FAQRepository) {}

  async execute(): Promise<FAQ[]> {
    return await this.faqRepository.findAll()
  }
}