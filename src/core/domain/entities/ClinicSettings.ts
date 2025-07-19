import { EntityId } from '../value-objects/EntityId'
import { Email } from '../value-objects/Email'
import { PhoneNumber } from '../value-objects/PhoneNumber'

export class ClinicSettings {
  constructor(
    private readonly id: EntityId,
    private clinicName: string = 'Klinik Taksim Medika',
    private address?: string,
    private phone?: PhoneNumber,
    private email?: Email,
    private maintenanceMode: boolean = false,
    private createdAt: Date = new Date(),
    private updatedAt: Date = new Date()
  ) {
    if (!clinicName || clinicName.trim().length === 0) {
      throw new Error('Clinic name is required')
    }
  }

  getId(): EntityId {
    return this.id
  }

  getClinicName(): string {
    return this.clinicName
  }

  getAddress(): string | undefined {
    return this.address
  }

  getPhone(): PhoneNumber | undefined {
    return this.phone
  }

  getEmail(): Email | undefined {
    return this.email
  }

  isMaintenanceMode(): boolean {
    return this.maintenanceMode
  }

  getCreatedAt(): Date {
    return this.createdAt
  }

  getUpdatedAt(): Date {
    return this.updatedAt
  }

  updateDetails(data: {
    clinicName?: string
    address?: string
    phone?: PhoneNumber
    email?: Email
  }): void {
    if (data.clinicName !== undefined) {
      if (!data.clinicName || data.clinicName.trim().length === 0) {
        throw new Error('Clinic name is required')
      }
      this.clinicName = data.clinicName
    }

    if (data.address !== undefined) this.address = data.address
    if (data.phone !== undefined) this.phone = data.phone
    if (data.email !== undefined) this.email = data.email

    this.updatedAt = new Date()
  }

  enableMaintenanceMode(): void {
    this.maintenanceMode = true
    this.updatedAt = new Date()
  }

  disableMaintenanceMode(): void {
    this.maintenanceMode = false
    this.updatedAt = new Date()
  }
}