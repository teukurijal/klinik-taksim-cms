import { Testimonial } from '../../../domain/entities/Testimonial'
import { EntityId } from '../../../domain/value-objects/EntityId'
import { TestimonialRepository } from '../../../domain/repositories/TestimonialRepository'
import { ValidationError } from '../../../../shared/errors/DomainError'

export interface CreateTestimonialRequest {
  name: string
  testimonialText: string
  photoUrl?: string
  patientCategory?: string
  rate?: number
}

export class CreateTestimonialUseCase {
  constructor(private testimonialRepository: TestimonialRepository) {}

  async execute(request: CreateTestimonialRequest): Promise<Testimonial> {
    try {
      const id = new EntityId(crypto.randomUUID())
      
      const testimonial = new Testimonial(
        id,
        request.name,
        request.testimonialText,
        request.photoUrl,
        request.patientCategory,
        request.rate || 5
      )

      return await this.testimonialRepository.save(testimonial)
    } catch (error) {
      if (error instanceof Error) {
        throw new ValidationError(error.message)
      }
      throw error
    }
  }
}