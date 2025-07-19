import { EntityId } from '../value-objects/EntityId'

export enum PromoStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export class Promo {
  constructor(
    private readonly id: EntityId,
    private title: string,
    private description: string,
    private status: PromoStatus = PromoStatus.ACTIVE,
    private imageUrl?: string,
    private startDate?: Date,
    private endDate?: Date,
    private createdAt: Date = new Date(),
    private updatedAt: Date = new Date()
  ) {
    if (!title || title.trim().length === 0) {
      throw new Error('Promo title is required')
    }
    if (!description || description.trim().length === 0) {
      throw new Error('Promo description is required')
    }
    if (startDate && endDate && startDate > endDate) {
      throw new Error('Start date cannot be after end date')
    }
  }

  getId(): EntityId {
    return this.id
  }

  getTitle(): string {
    return this.title
  }

  getDescription(): string {
    return this.description
  }

  getStatus(): PromoStatus {
    return this.status
  }

  getImageUrl(): string | undefined {
    return this.imageUrl
  }

  getStartDate(): Date | undefined {
    return this.startDate
  }

  getEndDate(): Date | undefined {
    return this.endDate
  }

  getCreatedAt(): Date {
    return this.createdAt
  }

  getUpdatedAt(): Date {
    return this.updatedAt
  }

  updateDetails(data: {
    title?: string
    description?: string
    imageUrl?: string
    startDate?: Date
    endDate?: Date
  }): void {
    if (data.title !== undefined) {
      if (!data.title || data.title.trim().length === 0) {
        throw new Error('Promo title is required')
      }
      this.title = data.title
    }

    if (data.description !== undefined) {
      if (!data.description || data.description.trim().length === 0) {
        throw new Error('Promo description is required')
      }
      this.description = data.description
    }

    if (data.imageUrl !== undefined) this.imageUrl = data.imageUrl
    if (data.startDate !== undefined) this.startDate = data.startDate
    if (data.endDate !== undefined) this.endDate = data.endDate

    if (this.startDate && this.endDate && this.startDate > this.endDate) {
      throw new Error('Start date cannot be after end date')
    }

    this.updatedAt = new Date()
  }

  activate(): void {
    this.status = PromoStatus.ACTIVE
    this.updatedAt = new Date()
  }

  deactivate(): void {
    this.status = PromoStatus.INACTIVE
    this.updatedAt = new Date()
  }

  isActive(): boolean {
    return this.status === PromoStatus.ACTIVE
  }

  isExpired(): boolean {
    if (!this.endDate) return false
    return new Date() > this.endDate
  }

  isStarted(): boolean {
    if (!this.startDate) return true
    return new Date() >= this.startDate
  }

  isCurrentlyActive(): boolean {
    return this.isActive() && this.isStarted() && !this.isExpired()
  }
}