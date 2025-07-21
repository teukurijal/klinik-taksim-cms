import { EntityId } from '../value-objects/EntityId'

export class Testimonial {
  constructor(
    private readonly id: EntityId,
    private name: string,
    private testimonialText: string,
    private photoUrl?: string,
    private patientCategory?: string,
    private rate: number = 5,
    private createdAt: Date = new Date(),
    private updatedAt: Date = new Date()
  ) {
    if (!name || name.trim().length === 0) {
      throw new Error('Testimonial name is required')
    }
    if (!testimonialText || testimonialText.trim().length === 0) {
      throw new Error('Testimonial text is required')
    }
    if (rate < 1 || rate > 5) {
      throw new Error('Rate must be between 1 and 5')
    }
  }

  getId(): EntityId {
    return this.id
  }

  getName(): string {
    return this.name
  }

  getTestimonialText(): string {
    return this.testimonialText
  }

  getPhotoUrl(): string | undefined {
    return this.photoUrl
  }

  getPatientCategory(): string | undefined {
    return this.patientCategory
  }

  getCreatedAt(): Date {
    return this.createdAt
  }

  getUpdatedAt(): Date {
    return this.updatedAt
  }

  getRate(): number {
    return this.rate
  }

  updateDetails(data: {
    name?: string
    testimonialText?: string
    photoUrl?: string
    patientCategory?: string
    rate?: number
  }): void {
    if (data.name !== undefined) {
      if (!data.name || data.name.trim().length === 0) {
        throw new Error('Testimonial name is required')
      }
      this.name = data.name
    }

    if (data.testimonialText !== undefined) {
      if (!data.testimonialText || data.testimonialText.trim().length === 0) {
        throw new Error('Testimonial text is required')
      }
      this.testimonialText = data.testimonialText
    }

    if (data.photoUrl !== undefined) this.photoUrl = data.photoUrl
    if (data.patientCategory !== undefined) this.patientCategory = data.patientCategory
    if (data.rate !== undefined) {
      if (data.rate < 1 || data.rate > 5) {
        throw new Error('Rate must be between 1 and 5')
      }
      this.rate = data.rate
    }

    this.updatedAt = new Date()
  }
}