import { PolyClinic, PolyClinicStatus, WorkingHours } from '@/core/domain/entities/PolyClinic'
import { EntityId } from '@/core/domain/value-objects/EntityId'

export interface PolyClinicData {
  id: string
  name: string
  description: string
  status: 'active' | 'inactive'
  head: string
  location?: string
  phone_number?: string
  email?: string
  working_hours?: WorkingHours
  capacity?: number
  services?: string[]
  created_at: string
  updated_at: string
}

export class PolyClinicModel {
  static toDomain(data: PolyClinicData): PolyClinic {
    return new PolyClinic(
      new EntityId(data.id),
      data.name,
      data.description,
      data.status === 'active' ? PolyClinicStatus.ACTIVE : PolyClinicStatus.INACTIVE,
      data.head,
      data.location,
      data.phone_number,
      data.email,
      data.working_hours,
      data.capacity,
      data.services,
      new Date(data.created_at),
      new Date(data.updated_at)
    )
  }

  static fromDomain(polyClinic: PolyClinic): Omit<PolyClinicData, 'created_at' | 'updated_at'> {
    return {
      id: polyClinic.getId().getValue(),
      name: polyClinic.getName(),
      description: polyClinic.getDescription(),
      status: polyClinic.getStatus(),
      head: polyClinic.getHead(),
      location: polyClinic.getLocation(),
      phone_number: polyClinic.getPhoneNumber(),
      email: polyClinic.getEmail(),
      working_hours: polyClinic.getWorkingHours(),
      capacity: polyClinic.getCapacity(),
      services: polyClinic.getServices()
    }
  }
}