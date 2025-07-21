import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Testimonial } from '../../../core/domain/entities/Testimonial'
import { TestimonialRepository } from '../../../core/domain/repositories/TestimonialRepository'
import { EntityId } from '../../../core/domain/value-objects/EntityId'
import { TestimonialModel } from '../models/TestimonialModel'
import { NotFoundError } from '../../../shared/errors/DomainError'

export class SupabaseTestimonialRepository implements TestimonialRepository {
  private supabase: SupabaseClient

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  }

  private modelToEntity(model: TestimonialModel): Testimonial {
    return new Testimonial(
      new EntityId(model.id),
      model.name,
      model.testimonial_text,
      model.photo_url,
      model.patient_category,
      model.rate,
      new Date(model.created_at),
      new Date(model.updated_at)
    )
  }

  private entityToModel(testimonial: Testimonial): Omit<TestimonialModel, 'id' | 'created_at' | 'updated_at'> {
    return {
      name: testimonial.getName(),
      testimonial_text: testimonial.getTestimonialText(),
      photo_url: testimonial.getPhotoUrl(),
      patient_category: testimonial.getPatientCategory(),
      rate: testimonial.getRate(),
    }
  }

  async findById(id: EntityId): Promise<Testimonial | null> {
    const { data, error } = await this.supabase
      .from('testimonials')
      .select('*')
      .eq('id', id.getValue())
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw new Error(`Failed to fetch testimonial: ${error.message}`)
    }

    return this.modelToEntity(data)
  }

  async findAll(): Promise<Testimonial[]> {
    const { data, error } = await this.supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch testimonials: ${error.message}`)
    }

    return data.map(model => this.modelToEntity(model))
  }

  async findByPatientCategory(category: string): Promise<Testimonial[]> {
    const { data, error } = await this.supabase
      .from('testimonials')
      .select('*')
      .eq('patient_category', category)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch testimonials by category: ${error.message}`)
    }

    return data.map(model => this.modelToEntity(model))
  }

  async save(testimonial: Testimonial): Promise<Testimonial> {
    const modelData = {
      id: testimonial.getId().getValue(),
      ...this.entityToModel(testimonial),
      created_at: testimonial.getCreatedAt().toISOString(),
      updated_at: testimonial.getUpdatedAt().toISOString()
    }

    const { data, error } = await this.supabase
      .from('testimonials')
      .insert(modelData)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to save testimonial: ${error.message}`)
    }

    return this.modelToEntity(data)
  }

  async update(id: EntityId, testimonial: Testimonial): Promise<Testimonial> {
    const modelData = {
      ...this.entityToModel(testimonial),
      updated_at: testimonial.getUpdatedAt().toISOString()
    }

    const { data, error } = await this.supabase
      .from('testimonials')
      .update(modelData)
      .eq('id', id.getValue())
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundError('Testimonial', id.getValue())
      }
      throw new Error(`Failed to update testimonial: ${error.message}`)
    }

    return this.modelToEntity(data)
  }

  async delete(id: EntityId): Promise<void> {
    const { error } = await this.supabase
      .from('testimonials')
      .delete()
      .eq('id', id.getValue())

    if (error) {
      throw new Error(`Failed to delete testimonial: ${error.message}`)
    }
  }

  async exists(id: EntityId): Promise<boolean> {
    const testimonial = await this.findById(id)
    return testimonial !== null
  }
}