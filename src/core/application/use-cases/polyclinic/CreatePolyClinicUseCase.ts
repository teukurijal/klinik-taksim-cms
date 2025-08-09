import { PolyClinicRepository } from '@/core/domain/repositories/PolyClinicRepository'
import { PolyClinic, PolyClinicStatus, WorkingHours } from '@/core/domain/entities/PolyClinic'
import { EntityId } from '@/core/domain/value-objects/EntityId'

export interface CreatePolyClinicRequest {
  name: string
  description: string
  head: string
  location?: string
  phoneNumber?: string
  email?: string
  workingHours?: WorkingHours
  capacity?: number
  services?: string[]
}

export class CreatePolyClinicUseCase {
  constructor(private polyClinicRepository: PolyClinicRepository) {}

  async execute(request: CreatePolyClinicRequest): Promise<PolyClinic> {
    const polyClinic = new PolyClinic(
      new EntityId(crypto.randomUUID()),
      request.name,
      request.description,
      PolyClinicStatus.ACTIVE,
      request.head,
      request.location,
      request.phoneNumber,
      request.email,
      request.workingHours,
      request.capacity,
      request.services
    )

    return await this.polyClinicRepository.save(polyClinic)
  }
}