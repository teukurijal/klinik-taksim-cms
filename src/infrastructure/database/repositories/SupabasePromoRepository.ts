import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Promo } from '../../../core/domain/entities/Promo'
import { EntityId } from '../../../core/domain/value-objects/EntityId'
import { PromoRepository } from '../../../core/domain/repositories/PromoRepository'
import { PromoModel, PromoRow } from '../models/PromoModel'

export class SupabasePromoRepository implements PromoRepository {
  private supabase: SupabaseClient

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  }

  async findById(id: EntityId): Promise<Promo | null> {
    const { data, error } = await this.supabase
      .from('promos')
      .select('*')
      .eq('id', id.getValue())
      .single()

    if (error || !data) {
      return null
    }

    return PromoModel.toDomain(data as PromoRow)
  }

  async findAll(): Promise<Promo[]> {
    const { data, error } = await this.supabase
      .from('promos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error || !data) {
      return []
    }

    return data.map((row: PromoRow) => PromoModel.toDomain(row))
  }

  async findActiveOnly(): Promise<Promo[]> {
    const { data, error } = await this.supabase
      .from('promos')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error || !data) {
      return []
    }

    return data.map((row: PromoRow) => PromoModel.toDomain(row))
  }

  async findCurrentlyActive(): Promise<Promo[]> {
    const now = new Date().toISOString()
    
    const { data, error } = await this.supabase
      .from('promos')
      .select('*')
      .eq('status', 'active')
      .or(`start_date.is.null,start_date.lte.${now}`)
      .or(`end_date.is.null,end_date.gte.${now}`)
      .order('created_at', { ascending: false })

    if (error || !data) {
      return []
    }

    return data.map((row: PromoRow) => PromoModel.toDomain(row))
  }

  async save(promo: Promo): Promise<Promo> {
    const promoData = PromoModel.fromDomain(promo)

    const { data, error } = await this.supabase
      .from('promos')
      .insert(promoData)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to save promo: ${error.message}`)
    }

    return PromoModel.toDomain(data as PromoRow)
  }

  async update(id: EntityId, promo: Promo): Promise<Promo> {
    const promoData = PromoModel.fromDomain(promo)

    const { data, error } = await this.supabase
      .from('promos')
      .update(promoData)
      .eq('id', id.getValue())
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update promo: ${error.message}`)
    }

    return PromoModel.toDomain(data as PromoRow)
  }

  async delete(id: EntityId): Promise<void> {
    const { error } = await this.supabase
      .from('promos')
      .delete()
      .eq('id', id.getValue())

    if (error) {
      throw new Error(`Failed to delete promo: ${error.message}`)
    }
  }

  async exists(id: EntityId): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('promos')
      .select('id')
      .eq('id', id.getValue())
      .single()

    return !error && !!data
  }
}