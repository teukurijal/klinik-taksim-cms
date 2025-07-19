import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { FAQ } from '../../../core/domain/entities/FAQ'
import { FAQRepository } from '../../../core/domain/repositories/FAQRepository'
import { EntityId } from '../../../core/domain/value-objects/EntityId'
import { FAQModel } from '../models/FAQModel'
import { NotFoundError } from '../../../shared/errors/DomainError'

export class SupabaseFAQRepository implements FAQRepository {
  private supabase: SupabaseClient

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  }

  private modelToEntity(model: FAQModel): FAQ {
    return new FAQ(
      new EntityId(model.id),
      model.question,
      model.answer,
      new Date(model.created_at),
      new Date(model.updated_at)
    )
  }

  private entityToModel(faq: FAQ): Omit<FAQModel, 'id' | 'created_at' | 'updated_at'> {
    return {
      question: faq.getQuestion(),
      answer: faq.getAnswer(),
    }
  }

  async findById(id: EntityId): Promise<FAQ | null> {
    const { data, error } = await this.supabase
      .from('faqs')
      .select('*')
      .eq('id', id.getValue())
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw new Error(`Failed to fetch FAQ: ${error.message}`)
    }

    return this.modelToEntity(data)
  }

  async findAll(): Promise<FAQ[]> {
    const { data, error } = await this.supabase
      .from('faqs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch FAQs: ${error.message}`)
    }

    return data.map(model => this.modelToEntity(model))
  }

  async save(faq: FAQ): Promise<FAQ> {
    const modelData = {
      id: faq.getId().getValue(),
      ...this.entityToModel(faq),
      created_at: faq.getCreatedAt().toISOString(),
      updated_at: faq.getUpdatedAt().toISOString()
    }

    const { data, error } = await this.supabase
      .from('faqs')
      .insert(modelData)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to save FAQ: ${error.message}`)
    }

    return this.modelToEntity(data)
  }

  async update(id: EntityId, faq: FAQ): Promise<FAQ> {
    const modelData = {
      ...this.entityToModel(faq),
      updated_at: faq.getUpdatedAt().toISOString()
    }

    const { data, error } = await this.supabase
      .from('faqs')
      .update(modelData)
      .eq('id', id.getValue())
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundError('FAQ', id.getValue())
      }
      throw new Error(`Failed to update FAQ: ${error.message}`)
    }

    return this.modelToEntity(data)
  }

  async delete(id: EntityId): Promise<void> {
    const { error } = await this.supabase
      .from('faqs')
      .delete()
      .eq('id', id.getValue())

    if (error) {
      throw new Error(`Failed to delete FAQ: ${error.message}`)
    }
  }

  async exists(id: EntityId): Promise<boolean> {
    const faq = await this.findById(id)
    return faq !== null
  }
}