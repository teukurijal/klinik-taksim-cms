import { PolyClinicRepository } from '@/core/domain/repositories/PolyClinicRepository'
import { PolyClinic } from '@/core/domain/entities/PolyClinic'
import { EntityId } from '@/core/domain/value-objects/EntityId'

export class GetPolyClinicUseCase {
  constructor(private readonly polyClinicRepository: PolyClinicRepository) {}

  async execute(id: string): Promise<PolyClinic | null> {
    const entityId = new EntityId(id)
    return await this.polyClinicRepository.findById(entityId)
  }
}