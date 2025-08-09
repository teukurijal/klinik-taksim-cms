import { PolyClinicRepository } from '@/core/domain/repositories/PolyClinicRepository'
import { PolyClinic } from '@/core/domain/entities/PolyClinic'

export class GetAllPolyClinicsUseCase {
  constructor(private readonly polyClinicRepository: PolyClinicRepository) {}

  async execute(activeOnly: boolean = false): Promise<PolyClinic[]> {
    if (activeOnly) {
      return await this.polyClinicRepository.findByStatus('active')
    }
    return await this.polyClinicRepository.findAll()
  }
}