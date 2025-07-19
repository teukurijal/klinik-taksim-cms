import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Doctor } from '../../../core/domain/entities/Doctor'
import { EntityId } from '../../../core/domain/value-objects/EntityId'
import { DoctorRepository } from '../../../core/domain/repositories/DoctorRepository'
import { DoctorModel, DoctorRow } from '../models/DoctorModel'

export class SupabaseDoctorRepository implements DoctorRepository {
  private supabase: SupabaseClient

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  }

  async findById(id: EntityId): Promise<Doctor | null> {
    const { data, error } = await this.supabase
      .from('doctors')
      .select('*')
      .eq('id', id.getValue())
      .single()

    if (error || !data) {
      return null
    }

    return DoctorModel.toDomain(data as DoctorRow)
  }

  async findAll(): Promise<Doctor[]> {
    const { data, error } = await this.supabase
      .from('doctors')
      .select('*')
      .order('created_at', { ascending: false })

    if (error || !data) {
      return []
    }

    return data.map((row: DoctorRow) => DoctorModel.toDomain(row))
  }

  async findActiveOnly(): Promise<Doctor[]> {
    const { data, error } = await this.supabase
      .from('doctors')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error || !data) {
      return []
    }

    return data.map((row: DoctorRow) => DoctorModel.toDomain(row))
  }

  async findBySpecialist(specialist: string): Promise<Doctor[]> {
    const { data, error } = await this.supabase
      .from('doctors')
      .select('*')
      .eq('specialist', specialist)
      .order('created_at', { ascending: false })

    if (error || !data) {
      return []
    }

    return data.map((row: DoctorRow) => DoctorModel.toDomain(row))
  }

  async save(doctor: Doctor): Promise<Doctor> {
    const doctorData = DoctorModel.fromDomain(doctor)

    const { data, error } = await this.supabase
      .from('doctors')
      .insert(doctorData)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to save doctor: ${error.message}`)
    }

    return DoctorModel.toDomain(data as DoctorRow)
  }

  async update(id: EntityId, doctor: Doctor): Promise<Doctor> {
    const doctorData = DoctorModel.fromDomain(doctor)

    const { data, error } = await this.supabase
      .from('doctors')
      .update(doctorData)
      .eq('id', id.getValue())
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update doctor: ${error.message}`)
    }

    return DoctorModel.toDomain(data as DoctorRow)
  }

  async delete(id: EntityId): Promise<void> {
    const { error } = await this.supabase
      .from('doctors')
      .delete()
      .eq('id', id.getValue())

    if (error) {
      throw new Error(`Failed to delete doctor: ${error.message}`)
    }
  }

  async exists(id: EntityId): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('doctors')
      .select('id')
      .eq('id', id.getValue())
      .single()

    return !error && !!data
  }
}