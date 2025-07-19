import { Testimonial } from '../entities/Testimonial'
import { EntityId } from '../value-objects/EntityId'

export interface TestimonialRepository {
  findById(id: EntityId): Promise<Testimonial | null>
  findAll(): Promise<Testimonial[]>
  findByPatientCategory(category: string): Promise<Testimonial[]>
  save(testimonial: Testimonial): Promise<Testimonial>
  update(id: EntityId, testimonial: Testimonial): Promise<Testimonial>
  delete(id: EntityId): Promise<void>
  exists(id: EntityId): Promise<boolean>
}