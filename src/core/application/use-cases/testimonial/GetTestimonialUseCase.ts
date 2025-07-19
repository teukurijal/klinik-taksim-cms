import { Testimonial } from '../../../domain/entities/Testimonial'
import { EntityId } from '../../../domain/value-objects/EntityId'
import { TestimonialRepository } from '../../../domain/repositories/TestimonialRepository'
import { NotFoundError } from '../../../../shared/errors/DomainError'

export class GetTestimonialUseCase {
  constructor(private testimonialRepository: TestimonialRepository) {}

  async execute(id: string): Promise<Testimonial> {
    const testimonialId = new EntityId(id)
    const testimonial = await this.testimonialRepository.findById(testimonialId)
    
    if (!testimonial) {
      throw new NotFoundError('Testimonial', id)
    }

    return testimonial
  }
}

export class GetAllTestimonialsUseCase {
  constructor(private testimonialRepository: TestimonialRepository) {}

  async execute(): Promise<Testimonial[]> {
    return await this.testimonialRepository.findAll()
  }
}

export class GetTestimonialsByCategoryUseCase {
  constructor(private testimonialRepository: TestimonialRepository) {}

  async execute(category: string): Promise<Testimonial[]> {
    return await this.testimonialRepository.findByPatientCategory(category)
  }
}