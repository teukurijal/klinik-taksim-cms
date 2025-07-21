import { ClinicSettings } from '../../../domain/entities/ClinicSettings'
import { EntityId } from '../../../domain/value-objects/EntityId'
import { Email } from '../../../domain/value-objects/Email'
import { PhoneNumber } from '../../../domain/value-objects/PhoneNumber'
import { ClinicSettingsRepository } from '../../../domain/repositories/ClinicSettingsRepository'
import { ValidationError } from '../../../../shared/errors/DomainError'

export interface CreateClinicSettingsRequest {
  clinicName?: string
  address?: string
  phone?: string
  email?: string
  maintenanceMode?: boolean
}

export class CreateClinicSettingsUseCase {
  constructor(private clinicSettingsRepository: ClinicSettingsRepository) {}

  async execute(request: CreateClinicSettingsRequest): Promise<ClinicSettings> {
    try {
      const id = new EntityId(crypto.randomUUID())
      
      const settings = new ClinicSettings(
        id,
        request.clinicName || 'Klinik Taksim Medika',
        request.address,
        request.phone ? new PhoneNumber(request.phone) : undefined,
        request.email ? new Email(request.email) : undefined,
        request.maintenanceMode || false
      )

      return await this.clinicSettingsRepository.save(settings)
    } catch (error) {
      if (error instanceof Error) {
        throw new ValidationError(error.message)
      }
      throw error
    }
  }
}