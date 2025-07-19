import { ClinicSettings } from '../entities/ClinicSettings'
import { EntityId } from '../value-objects/EntityId'

export interface ClinicSettingsRepository {
  findById(id: EntityId): Promise<ClinicSettings | null>
  findCurrent(): Promise<ClinicSettings | null>
  save(settings: ClinicSettings): Promise<ClinicSettings>
  update(id: EntityId, settings: ClinicSettings): Promise<ClinicSettings>
}