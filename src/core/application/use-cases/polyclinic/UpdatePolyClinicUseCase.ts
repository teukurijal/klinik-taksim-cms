import { PolyClinicRepository } from '@/core/domain/repositories/PolyClinicRepository'
import { PolyClinic, WorkingHours } from '@/core/domain/entities/PolyClinic'
import { EntityId } from '@/core/domain/value-objects/EntityId'

export interface UpdatePolyClinicRequest {
  id: string
  name?: string
  description?: string
  head?: string
  location?: string
  phoneNumber?: string
  email?: string
  workingHours?: WorkingHours
  capacity?: number
  services?: string[]
}

export class UpdatePolyClinicUseCase {
  constructor(private readonly polyClinicRepository: PolyClinicRepository) {}

  async execute(request: UpdatePolyClinicRequest): Promise<PolyClinic | null> {
    const entityId = new EntityId(request.id)
    const polyClinic = await this.polyClinicRepository.findById(entityId)

    if (!polyClinic) {
      return null
    }

    polyClinic.updateProfile({
      name: request.name,
      description: request.description,
      head: request.head,
      location: request.location,
      phoneNumber: request.phoneNumber,
      email: request.email,
      workingHours: request.workingHours,
      capacity: request.capacity,
      services: request.services
    })

    return await this.polyClinicRepository.update(entityId, polyClinic)
  }
}