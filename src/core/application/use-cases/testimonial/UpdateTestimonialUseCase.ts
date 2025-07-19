import { Testimonial } from '../../../domain/entities/Testimonial'
import { EntityId } from '../../../domain/value-objects/EntityId'
import { TestimonialRepository } from '../../../domain/repositories/TestimonialRepository'
import { NotFoundError, ValidationError } from '../../../../shared/errors/DomainError'

export interface UpdateTestimonialRequest {
  name?: string
  testimonialText?: string
  photoUrl?: string
  patientCategory?: string
}

export class UpdateTestimonialUseCase {
  constructor(private testimonialRepository: TestimonialRepository) {}

  async execute(id: string, request: UpdateTestimonialRequest): Promise<Testimonial> {
    try {
      const testimonialId = new EntityId(id)
      const existingTestimonial = await this.testimonialRepository.findById(testimonialId)
      
      if (!existingTestimonial) {
        throw new NotFoundError('Testimonial', id)
      }

      existingTestimonial.updateDetails({
        name: request.name,
        testimonialText: request.testimonialText,
        photoUrl: request.photoUrl,
        patientCategory: request.patientCategory
      })

      return await this.testimonialRepository.update(testimonialId, existingTestimonial)
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