import { EntityId } from '../value-objects/EntityId'

export class FAQ {
  constructor(
    private readonly id: EntityId,
    private question: string,
    private answer: string,
    private createdAt: Date = new Date(),
    private updatedAt: Date = new Date()
  ) {
    if (!question || question.trim().length === 0) {
      throw new Error('FAQ question is required')
    }
    if (!answer || answer.trim().length === 0) {
      throw new Error('FAQ answer is required')
    }
  }

  getId(): EntityId {
    return this.id
  }

  getQuestion(): string {
    return this.question
  }

  getAnswer(): string {
    return this.answer
  }

  getCreatedAt(): Date {
    return this.createdAt
  }

  getUpdatedAt(): Date {
    return this.updatedAt
  }

  updateDetails(data: {
    question?: string
    answer?: string
  }): void {
    if (data.question !== undefined) {
      if (!data.question || data.question.trim().length === 0) {
        throw new Error('FAQ question is required')
      }
      this.question = data.question
    }

    if (data.answer !== undefined) {
      if (!data.answer || data.answer.trim().length === 0) {
        throw new Error('FAQ answer is required')
      }
      this.answer = data.answer
    }

    this.updatedAt = new Date()
  }
}