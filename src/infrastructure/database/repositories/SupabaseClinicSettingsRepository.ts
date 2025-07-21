import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { ClinicSettings } from '../../../core/domain/entities/ClinicSettings'
import { ClinicSettingsRepository } from '../../../core/domain/repositories/ClinicSettingsRepository'
import { EntityId } from '../../../core/domain/value-objects/EntityId'
import { Email } from '../../../core/domain/value-objects/Email'
import { PhoneNumber } from '../../../core/domain/value-objects/PhoneNumber'
import { ClinicSettingsModel } from '../models/ClinicSettingsModel'
import { NotFoundError } from '../../../shared/errors/DomainError'

export class SupabaseClinicSettingsRepository implements ClinicSettingsRepository {
  private supabase: SupabaseClient

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  }

  private modelToEntity(model: ClinicSettingsModel): ClinicSettings {
    try {
      console.log('Converting model to entity:', {
        id: model.id,
        clinic_name: model.clinic_name,
        phone: model.phone,
        email: model.email,
        maintenance_mode: model.maintenance_mode
      })

      const entity = new ClinicSettings(
        new EntityId(model.id),
        model.clinic_name,
        model.address,
        model.phone ? new PhoneNumber(model.phone) : undefined,
        model.email ? new Email(model.email) : undefined,
        model.maintenance_mode,
        new Date(model.created_at),
        new Date(model.updated_at)
      )

      console.log('Entity created successfully')
      return entity
    } catch (error) {
      console.error('Error converting model to entity:', error)
      throw error
    }
  }

  private entityToModel(settings: ClinicSettings): Omit<ClinicSettingsModel, 'id' | 'created_at' | 'updated_at'> {
    return {
      clinic_name: settings.getClinicName(),
      address: settings.getAddress(),
      phone: settings.getPhone()?.getValue(),
      email: settings.getEmail()?.getValue(),
      maintenance_mode: settings.isMaintenanceMode(),
    }
  }

  async findById(id: EntityId): Promise<ClinicSettings | null> {
    const { data, error } = await this.supabase
      .from('clinic_settings')
      .select('*')
      .eq('id', id.getValue())
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw new Error(`Failed to fetch clinic settings: ${error.message}`)
    }

    return this.modelToEntity(data)
  }

  async findCurrent(): Promise<ClinicSettings | null> {
    console.log('Repository: Finding current clinic settings...')
    
    const { data, error } = await this.supabase
      .from('clinic_settings')
      .select('*')
      .limit(1)
      .single()

    console.log('Repository result:', { data: data ? 'Found' : 'None', error: error?.message })

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('No clinic settings found (PGRST116)')
        return null
      }
      console.error('Database error:', error)
      throw new Error(`Failed to fetch current clinic settings: ${error.message}`)
    }

    const entity = this.modelToEntity(data)
    console.log('Converted to entity successfully')
    return entity
  }

  async save(settings: ClinicSettings): Promise<ClinicSettings> {
    const modelData = {
      id: settings.getId().getValue(),
      ...this.entityToModel(settings),
      created_at: settings.getCreatedAt().toISOString(),
      updated_at: settings.getUpdatedAt().toISOString()
    }

    const { data, error } = await this.supabase
      .from('clinic_settings')
      .insert(modelData)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to save clinic settings: ${error.message}`)
    }

    return this.modelToEntity(data)
  }

  async update(id: EntityId, settings: ClinicSettings): Promise<ClinicSettings> {
    const modelData = {
      ...this.entityToModel(settings),
      updated_at: settings.getUpdatedAt().toISOString()
    }

    const { data, error } = await this.supabase
      .from('clinic_settings')
      .update(modelData)
      .eq('id', id.getValue())
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundError('ClinicSettings', id.getValue())
      }
      throw new Error(`Failed to update clinic settings: ${error.message}`)
    }

    return this.modelToEntity(data)
  }
}