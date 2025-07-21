import { ClinicSettings } from '../../../domain/entities/ClinicSettings'
import { EntityId } from '../../../domain/value-objects/EntityId'
import { ClinicSettingsRepository } from '../../../domain/repositories/ClinicSettingsRepository'
import { NotFoundError } from '../../../../shared/errors/DomainError'

export class GetClinicSettingsUseCase {
  constructor(private clinicSettingsRepository: ClinicSettingsRepository) {}

  async execute(id: string): Promise<ClinicSettings> {
    const settingsId = new EntityId(id)
    const settings = await this.clinicSettingsRepository.findById(settingsId)
    
    if (!settings) {
      throw new NotFoundError('ClinicSettings', id)
    }

    return settings
  }
}

export class GetCurrentClinicSettingsUseCase {
  constructor(private clinicSettingsRepository: ClinicSettingsRepository) {}

  async execute(): Promise<ClinicSettings | null> {
    return await this.clinicSettingsRepository.findCurrent()
  }
}