import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { FacilityPhoto } from '../../../core/domain/entities/FacilityPhoto'
import { EntityId } from '../../../core/domain/value-objects/EntityId'
import { FacilityPhotoRepository } from '../../../core/domain/repositories/FacilityPhotoRepository'
import { FacilityPhotoModel, FacilityPhotoRow } from '../models/FacilityPhotoModel'

export class SupabaseFacilityPhotoRepository implements FacilityPhotoRepository {
  private supabase: SupabaseClient

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  }

  async findById(id: EntityId): Promise<FacilityPhoto | null> {
    const { data, error } = await this.supabase
      .from('facility_photos')
      .select('*')
      .eq('id', id.getValue())
      .single()

    if (error || !data) {
      return null
    }

    return FacilityPhotoModel.toDomain(data as FacilityPhotoRow)
  }

  async findAll(): Promise<FacilityPhoto[]> {
    const { data, error } = await this.supabase
      .from('facility_photos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error || !data) {
      return []
    }

    return data.map((row: FacilityPhotoRow) => FacilityPhotoModel.toDomain(row))
  }

  async save(facilityPhoto: FacilityPhoto): Promise<FacilityPhoto> {
    const facilityPhotoData = FacilityPhotoModel.fromDomain(facilityPhoto)

    const { data, error } = await this.supabase
      .from('facility_photos')
      .insert([facilityPhotoData])
      .select()
      .single()

    if (error || !data) {
      throw new Error(`Failed to save facility photo: ${error?.message}`)
    }

    return FacilityPhotoModel.toDomain(data as FacilityPhotoRow)
  }

  async update(id: EntityId, facilityPhoto: FacilityPhoto): Promise<FacilityPhoto> {
    const facilityPhotoData = FacilityPhotoModel.fromDomain(facilityPhoto)

    const { data, error } = await this.supabase
      .from('facility_photos')
      .update(facilityPhotoData)
      .eq('id', id.getValue())
      .select()
      .single()

    if (error || !data) {
      throw new Error(`Failed to update facility photo: ${error?.message}`)
    }

    return FacilityPhotoModel.toDomain(data as FacilityPhotoRow)
  }

  async delete(id: EntityId): Promise<void> {
    const { error } = await this.supabase
      .from('facility_photos')
      .delete()
      .eq('id', id.getValue())

    if (error) {
      throw new Error(`Failed to delete facility photo: ${error.message}`)
    }
  }

  async exists(id: EntityId): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('facility_photos')
      .select('id')
      .eq('id', id.getValue())
      .single()

    return !error && !!data
  }
}