import { EntityId } from '../../../domain/value-objects/EntityId'
import { TestimonialRepository } from '../../../domain/repositories/TestimonialRepository'
import { NotFoundError } from '../../../../shared/errors/DomainError'

export class DeleteTestimonialUseCase {
  constructor(private testimonialRepository: TestimonialRepository) {}

  async execute(id: string): Promise<void> {
    const testimonialId = new EntityId(id)
    
    const exists = await this.testimonialRepository.exists(testimonialId)
    if (!exists) {
      throw new NotFoundError('Testimonial', id)
    }

    await this.testimonialRepository.delete(testimonialId)
  }
}