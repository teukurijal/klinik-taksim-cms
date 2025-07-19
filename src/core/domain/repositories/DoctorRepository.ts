import { Doctor } from '../entities/Doctor'
import { EntityId } from '../value-objects/EntityId'

export interface DoctorRepository {
  findById(id: EntityId): Promise<Doctor | null>
  findAll(): Promise<Doctor[]>
  findActiveOnly(): Promise<Doctor[]>
  findBySpecialist(specialist: string): Promise<Doctor[]>
  save(doctor: Doctor): Promise<Doctor>
  update(id: EntityId, doctor: Doctor): Promise<Doctor>
  delete(id: EntityId): Promise<void>
  exists(id: EntityId): Promise<boolean>
}