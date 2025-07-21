import { ClinicSettings } from '../../../domain/entities/ClinicSettings'
import { EntityId } from '../../../domain/value-objects/EntityId'
import { Email } from '../../../domain/value-objects/Email'
import { PhoneNumber } from '../../../domain/value-objects/PhoneNumber'
import { ClinicSettingsRepository } from '../../../domain/repositories/ClinicSettingsRepository'
import { NotFoundError, ValidationError } from '../../../../shared/errors/DomainError'

export interface UpdateClinicSettingsRequest {
  clinicName?: string
  address?: string
  phone?: string
  email?: string
  maintenanceMode?: boolean
}

export class UpdateClinicSettingsUseCase {
  constructor(private clinicSettingsRepository: ClinicSettingsRepository) {}

  async execute(id: string, request: UpdateClinicSettingsRequest): Promise<ClinicSettings> {
    try {
      const settingsId = new EntityId(id)
      const existingSettings = await this.clinicSettingsRepository.findById(settingsId)
      
      if (!existingSettings) {
        throw new NotFoundError('ClinicSettings', id)
      }

      const updateData: Partial<{
        clinicName: string;
        address: string;
        phone: PhoneNumber | undefined;
        email: Email | undefined;
      }> = {}
      
      if (request.clinicName !== undefined) {
        updateData.clinicName = request.clinicName
      }
      
      if (request.address !== undefined) {
        updateData.address = request.address
      }
      
      if (request.phone !== undefined) {
        updateData.phone = request.phone ? new PhoneNumber(request.phone) : undefined
      }
      
      if (request.email !== undefined) {
        updateData.email = request.email ? new Email(request.email) : undefined
      }

      existingSettings.updateDetails(updateData)

      if (request.maintenanceMode !== undefined) {
        if (request.maintenanceMode) {
          existingSettings.enableMaintenanceMode()
        } else {
          existingSettings.disableMaintenanceMode()
        }
      }

      return await this.clinicSettingsRepository.update(settingsId, existingSettings)
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      if (error instanceof Error) {
        throw new ValidationError(error.message)
      }
      throw error
    }
  }
}