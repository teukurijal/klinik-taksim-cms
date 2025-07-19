import { FAQ } from '../../../domain/entities/FAQ'
import { EntityId } from '../../../domain/value-objects/EntityId'
import { FAQRepository } from '../../../domain/repositories/FAQRepository'
import { ValidationError } from '../../../../shared/errors/DomainError'

export interface CreateFAQRequest {
  question: string
  answer: string
}

export class CreateFAQUseCase {
  constructor(private faqRepository: FAQRepository) {}

  async execute(request: CreateFAQRequest): Promise<FAQ> {
    try {
      const id = new EntityId(crypto.randomUUID())
      
      const faq = new FAQ(
        id,
        request.question,
        request.answer
      )

      return await this.faqRepository.save(faq)
    } catch (error) {
      if (error instanceof Error) {
        throw new ValidationError(error.message)
      }
      throw error
    }
  }
}