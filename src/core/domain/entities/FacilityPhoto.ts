import { EntityId } from '../value-objects/EntityId'

export class FacilityPhoto {
  constructor(
    private readonly id: EntityId,
    private imageUrl: string,
    private title?: string,
    private description?: string,
    private createdAt: Date = new Date(),
    private updatedAt: Date = new Date()
  ) {
    if (!imageUrl || imageUrl.trim().length === 0) {
      throw new Error('Facility photo image URL is required')
    }
  }

  getId(): EntityId {
    return this.id
  }

  getImageUrl(): string {
    return this.imageUrl
  }

  getTitle(): string | undefined {
    return this.title
  }

  getDescription(): string | undefined {
    return this.description
  }

  getCreatedAt(): Date {
    return this.createdAt
  }

  getUpdatedAt(): Date {
    return this.updatedAt
  }

  updateDetails(data: {
    imageUrl?: string
    title?: string
    description?: string
  }): void {
    if (data.imageUrl !== undefined) {
      if (!data.imageUrl || data.imageUrl.trim().length === 0) {
        throw new Error('Facility photo image URL is required')
      }
      this.imageUrl = data.imageUrl
    }

    if (data.title !== undefined) this.title = data.title
    if (data.description !== undefined) this.description = data.description

    this.updatedAt = new Date()
  }
}