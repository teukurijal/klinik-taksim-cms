import { FAQ } from '../../../domain/entities/FAQ'
import { EntityId } from '../../../domain/value-objects/EntityId'
import { FAQRepository } from '../../../domain/repositories/FAQRepository'
import { NotFoundError, ValidationError } from '../../../../shared/errors/DomainError'

export interface UpdateFAQRequest {
  question?: string
  answer?: string
}

export class UpdateFAQUseCase {
  constructor(private faqRepository: FAQRepository) {}

  async execute(id: string, request: UpdateFAQRequest): Promise<FAQ> {
    try {
      const faqId = new EntityId(id)
      const existingFAQ = await this.faqRepository.findById(faqId)
      
      if (!existingFAQ) {
        throw new NotFoundError('FAQ', id)
      }

      existingFAQ.updateDetails({
        question: request.question,
        answer: request.answer
      })

      return await this.faqRepository.update(faqId, existingFAQ)
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