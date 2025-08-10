import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Partner } from '../../../core/domain/entities/Partner'
import { EntityId } from '../../../core/domain/value-objects/EntityId'
import { PartnerRepository } from '../../../core/domain/repositories/PartnerRepository'
import { PartnerModel, PartnerRow } from '../models/PartnerModel'

export class SupabasePartnerRepository implements PartnerRepository {
  private supabase: SupabaseClient

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  }

  async findById(id: EntityId): Promise<Partner | null> {
    const { data, error } = await this.supabase
      .from('partners')
      .select('*')
      .eq('id', id.getValue())
      .single()

    if (error || !data) {
      return null
    }

    return PartnerModel.toDomain(data as PartnerRow)
  }

  async findAll(): Promise<Partner[]> {
    const { data, error } = await this.supabase
      .from('partners')
      .select('*')
      .order('created_at', { ascending: false })

    if (error || !data) {
      return []
    }

    return data.map((row: PartnerRow) => PartnerModel.toDomain(row))
  }

  async save(partner: Partner): Promise<Partner> {
    const partnerData = PartnerModel.fromDomain(partner)

    const { data, error } = await this.supabase
      .from('partners')
      .insert([partnerData])
      .select()
      .single()

    if (error || !data) {
      throw new Error(`Failed to save partner: ${error?.message}`)
    }

    return PartnerModel.toDomain(data as PartnerRow)
  }

  async update(id: EntityId, partner: Partner): Promise<Partner> {
    const partnerData = PartnerModel.fromDomain(partner)

    const { data, error } = await this.supabase
      .from('partners')
      .update(partnerData)
      .eq('id', id.getValue())
      .select()
      .single()

    if (error || !data) {
      throw new Error(`Failed to update partner: ${error?.message}`)
    }

    return PartnerModel.toDomain(data as PartnerRow)
  }

  async delete(id: EntityId): Promise<void> {
    const { error } = await this.supabase
      .from('partners')
      .delete()
      .eq('id', id.getValue())

    if (error) {
      throw new Error(`Failed to delete partner: ${error.message}`)
    }
  }

  async exists(id: EntityId): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('partners')
      .select('id')
      .eq('id', id.getValue())
      .single()

    return !error && !!data
  }
}