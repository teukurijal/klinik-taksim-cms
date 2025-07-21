import { NextRequest, NextResponse } from 'next/server'
import { GetClinicSettingsUseCase, GetCurrentClinicSettingsUseCase } from '../../core/application/use-cases/clinic-settings/GetClinicSettingsUseCase'
import { UpdateClinicSettingsUseCase } from '../../core/application/use-cases/clinic-settings/UpdateClinicSettingsUseCase'
import { CreateClinicSettingsUseCase } from '../../core/application/use-cases/clinic-settings/CreateClinicSettingsUseCase'
import { ClinicSettingsRepository } from '../../core/domain/repositories/ClinicSettingsRepository'
import { ClinicSettings } from '../../core/domain/entities/ClinicSettings'
import { DomainError } from '../../shared/errors/DomainError'

export class ClinicSettingsController {
  constructor(private clinicSettingsRepository: ClinicSettingsRepository) {}

  async create(request: NextRequest): Promise<NextResponse> {
    try {
      const body = await request.json()
      
      const useCase = new CreateClinicSettingsUseCase(this.clinicSettingsRepository)
      const settings = await useCase.execute({
        clinicName: body.clinic_name,
        address: body.address,
        phone: body.phone,
        email: body.email,
        maintenanceMode: body.maintenance_mode
      })
      
      return NextResponse.json({ 
        data: this.settingsToResponse(settings),
        success: true 
      }, { status: 201 })
    } catch (error) {
      return this.handleError(error)
    }
  }

  async getCurrent(): Promise<NextResponse> {
    try {
      console.log('Getting current settings...')
      const useCase = new GetCurrentClinicSettingsUseCase(this.clinicSettingsRepository)
      const settings = await useCase.execute()
      
      console.log('Current settings result:', settings ? 'Found settings' : 'No settings found')
      
      return NextResponse.json({ 
        data: settings ? this.settingsToResponse(settings) : null,
        success: true 
      })
    } catch (error) {
      console.error('Error in getCurrent:', error)
      return this.handleError(error)
    }
  }

  async getById(id: string): Promise<NextResponse> {
    try {
      const useCase = new GetClinicSettingsUseCase(this.clinicSettingsRepository)
      const settings = await useCase.execute(id)
      
      return NextResponse.json({ 
        data: this.settingsToResponse(settings),
        success: true 
      })
    } catch (error) {
      return this.handleError(error)
    }
  }

  async update(id: string, request: NextRequest): Promise<NextResponse> {
    try {
      const body = await request.json()

      const useCase = new UpdateClinicSettingsUseCase(this.clinicSettingsRepository)
      const settings = await useCase.execute(id, {
        clinicName: body.clinic_name,
        address: body.address,
        phone: body.phone,
        email: body.email,
        maintenanceMode: body.maintenance_mode
      })
      
      return NextResponse.json({ 
        data: this.settingsToResponse(settings),
        success: true 
      })
    } catch (error) {
      return this.handleError(error)
    }
  }

  async updateCurrent(request: NextRequest): Promise<NextResponse> {
    try {
      console.log('UpdateCurrent: Starting update process...')
      
      // Get the current settings first
      const getCurrentUseCase = new GetCurrentClinicSettingsUseCase(this.clinicSettingsRepository)
      const currentSettings = await getCurrentUseCase.execute()
      
      if (!currentSettings) {
        console.log('UpdateCurrent: No settings found')
        return NextResponse.json({ 
          error: 'Settings not found',
          success: false 
        }, { status: 404 })
      }

      console.log('UpdateCurrent: Found current settings, updating...')
      const body = await request.json()

      const useCase = new UpdateClinicSettingsUseCase(this.clinicSettingsRepository)
      const settings = await useCase.execute(currentSettings.getId().getValue(), {
        clinicName: body.clinic_name,
        address: body.address,
        phone: body.phone,
        email: body.email,
        maintenanceMode: body.maintenance_mode
      })
      
      console.log('UpdateCurrent: Update completed successfully')
      return NextResponse.json({ 
        data: this.settingsToResponse(settings),
        success: true 
      })
    } catch (error) {
      console.error('UpdateCurrent error:', error)
      return this.handleError(error)
    }
  }

  private settingsToResponse(settings: ClinicSettings) {
    const response = {
      id: settings.getId().getValue(),
      clinic_name: settings.getClinicName(),
      address: settings.getAddress(),
      phone: settings.getPhone()?.getValue(),
      email: settings.getEmail()?.getValue(),
      maintenance_mode: settings.isMaintenanceMode(),
      created_at: settings.getCreatedAt().toISOString(),
      updated_at: settings.getUpdatedAt().toISOString()
    }
    
    console.log('Settings response format:', response)
    return response
  }

  private handleError(error: unknown): NextResponse {
    console.error('Clinic settings controller error:', error)
    
    if (error instanceof DomainError) {
      const status = error.code === 'NOT_FOUND' ? 404 : 
                    error.code === 'VALIDATION_ERROR' ? 400 : 
                    error.code === 'CONFLICT' ? 409 : 500

      return NextResponse.json({ 
        error: error.message,
        code: error.code,
        success: false 
      }, { status })
    }

    return NextResponse.json({ 
      error: 'Internal server error',
      success: false 
    }, { status: 500 })
  }
}