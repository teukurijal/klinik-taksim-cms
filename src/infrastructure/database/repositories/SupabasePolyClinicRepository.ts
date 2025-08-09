import { PolyClinicRepository } from '@/core/domain/repositories/PolyClinicRepository'
import { PolyClinic } from '@/core/domain/entities/PolyClinic'
import { EntityId } from '@/core/domain/value-objects/EntityId'
import { PolyClinicModel, PolyClinicData } from '../models/PolyClinicModel'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

export class SupabasePolyClinicRepository implements PolyClinicRepository {
  private supabase: SupabaseClient

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  }

  async findById(id: EntityId): Promise<PolyClinic | null> {
    const { data, error } = await this.supabase
      .from('polyclinics')
      .select('*')
      .eq('id', id.getValue())
      .single()

    if (error || !data) {
      return null
    }

    return PolyClinicModel.toDomain(data as PolyClinicData)
  }

  async findAll(): Promise<PolyClinic[]> {
    const { data, error } = await this.supabase
      .from('polyclinics')
      .select('*')
      .order('created_at', { ascending: false })

    if (error || !data) {
      return []
    }

    return data.map((item: PolyClinicData) => PolyClinicModel.toDomain(item))
  }

  async findByStatus(status: string): Promise<PolyClinic[]> {
    const { data, error } = await this.supabase
      .from('polyclinics')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error || !data) {
      return []
    }

    return data.map((item: PolyClinicData) => PolyClinicModel.toDomain(item))
  }

  async save(polyClinic: PolyClinic): Promise<PolyClinic> {
    const data = PolyClinicModel.fromDomain(polyClinic)
    
    const { data: savedData, error } = await this.supabase
      .from('polyclinics')
      .insert(data)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to save polyclinic: ${error.message}`)
    }

    return PolyClinicModel.toDomain(savedData as PolyClinicData)
  }

  async update(id: EntityId, polyClinic: PolyClinic): Promise<PolyClinic> {
    const data = PolyClinicModel.fromDomain(polyClinic)
    
    const { data: updatedData, error } = await this.supabase
      .from('polyclinics')
      .update(data)
      .eq('id', id.getValue())
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update polyclinic: ${error.message}`)
    }

    return PolyClinicModel.toDomain(updatedData as PolyClinicData)
  }

  async delete(id: EntityId): Promise<void> {
    const { error } = await this.supabase
      .from('polyclinics')
      .delete()
      .eq('id', id.getValue())

    if (error) {
      throw new Error(`Failed to delete polyclinic: ${error.message}`)
    }
  }

  async exists(id: EntityId): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('polyclinics')
      .select('id')
      .eq('id', id.getValue())
      .single()

    return !error && !!data
  }
}