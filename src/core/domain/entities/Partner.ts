import { EntityId } from '../value-objects/EntityId'

export class Partner {
  constructor(
    private readonly id: EntityId,
    private imageUrl: string,
    private name?: string,
    private link?: string,
    private createdAt: Date = new Date(),
    private updatedAt: Date = new Date()
  ) {
    if (!imageUrl || imageUrl.trim().length === 0) {
      throw new Error('Partner image URL is required')
    }
  }

  getId(): EntityId {
    return this.id
  }

  getImageUrl(): string {
    return this.imageUrl
  }

  getName(): string | undefined {
    return this.name
  }

  getLink(): string | undefined {
    return this.link
  }

  getCreatedAt(): Date {
    return this.createdAt
  }

  getUpdatedAt(): Date {
    return this.updatedAt
  }

  updateDetails(data: {
    imageUrl?: string
    name?: string
    link?: string
  }): void {
    if (data.imageUrl !== undefined) {
      if (!data.imageUrl || data.imageUrl.trim().length === 0) {
        throw new Error('Partner image URL is required')
      }
      this.imageUrl = data.imageUrl
    }

    if (data.name !== undefined) this.name = data.name
    if (data.link !== undefined) this.link = data.link

    this.updatedAt = new Date()
  }
}