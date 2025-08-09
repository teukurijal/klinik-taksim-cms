import { PolyClinicRepository } from '@/core/domain/repositories/PolyClinicRepository'
import { EntityId } from '@/core/domain/value-objects/EntityId'

export class DeletePolyClinicUseCase {
  constructor(private readonly polyClinicRepository: PolyClinicRepository) {}

  async execute(id: string): Promise<void> {
    const entityId = new EntityId(id)
    await this.polyClinicRepository.delete(entityId)
  }
}