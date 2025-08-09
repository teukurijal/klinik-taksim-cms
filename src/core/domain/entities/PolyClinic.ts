import { EntityId } from '../value-objects/EntityId'

export enum PolyClinicStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export interface WorkingHours {
  [key: string]: {
    start: string
    end: string
    available: boolean
  }
}

export class PolyClinic {
  constructor(
    private readonly id: EntityId,
    private name: string,
    private description: string,
    private status: PolyClinicStatus = PolyClinicStatus.ACTIVE,
    private head: string,
    private location?: string,
    private phoneNumber?: string,
    private email?: string,
    private workingHours?: WorkingHours,
    private capacity?: number,
    private services?: string[],
    private createdAt: Date = new Date(),
    private updatedAt: Date = new Date()
  ) {
    if (!name || name.trim().length === 0) {
      throw new Error('PolyClinic name is required')
    }
    if (!description || description.trim().length === 0) {
      throw new Error('PolyClinic description is required')
    }
    if (!head || head.trim().length === 0) {
      throw new Error('PolyClinic head is required')
    }
  }

  getId(): EntityId {
    return this.id
  }

  getName(): string {
    return this.name
  }

  getDescription(): string {
    return this.description
  }

  getStatus(): PolyClinicStatus {
    return this.status
  }

  getHead(): string {
    return this.head
  }

  getLocation(): string | undefined {
    return this.location
  }

  getPhoneNumber(): string | undefined {
    return this.phoneNumber
  }

  getEmail(): string | undefined {
    return this.email
  }

  getWorkingHours(): WorkingHours | undefined {
    return this.workingHours
  }

  getCapacity(): number | undefined {
    return this.capacity
  }

  getServices(): string[] | undefined {
    return this.services
  }

  getCreatedAt(): Date {
    return this.createdAt
  }

  getUpdatedAt(): Date {
    return this.updatedAt
  }

  updateProfile(data: {
    name?: string
    description?: string
    head?: string
    location?: string
    phoneNumber?: string
    email?: string
    workingHours?: WorkingHours
    capacity?: number
    services?: string[]
  }): void {
    if (data.name !== undefined) {
      if (!data.name || data.name.trim().length === 0) {
        throw new Error('PolyClinic name is required')
      }
      this.name = data.name
    }
    
    if (data.description !== undefined) {
      if (!data.description || data.description.trim().length === 0) {
        throw new Error('PolyClinic description is required')
      }
      this.description = data.description
    }

    if (data.head !== undefined) {
      if (!data.head || data.head.trim().length === 0) {
        throw new Error('PolyClinic head is required')
      }
      this.head = data.head
    }

    if (data.location !== undefined) this.location = data.location
    if (data.phoneNumber !== undefined) this.phoneNumber = data.phoneNumber
    if (data.email !== undefined) this.email = data.email
    if (data.workingHours !== undefined) this.workingHours = data.workingHours
    if (data.capacity !== undefined) this.capacity = data.capacity
    if (data.services !== undefined) this.services = data.services

    this.updatedAt = new Date()
  }

  activate(): void {
    this.status = PolyClinicStatus.ACTIVE
    this.updatedAt = new Date()
  }

  deactivate(): void {
    this.status = PolyClinicStatus.INACTIVE
    this.updatedAt = new Date()
  }

  isActive(): boolean {
    return this.status === PolyClinicStatus.ACTIVE
  }

  addService(service: string): void {
    if (!this.services) {
      this.services = []
    }
    if (!this.services.includes(service)) {
      this.services.push(service)
      this.updatedAt = new Date()
    }
  }

  removeService(service: string): void {
    if (this.services) {
      this.services = this.services.filter(s => s !== service)
      this.updatedAt = new Date()
    }
  }

  updateWorkingHours(workingHours: WorkingHours): void {
    this.workingHours = workingHours
    this.updatedAt = new Date()
  }
}