export class EntityId {
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('EntityId cannot be empty')
    }
  }

  getValue(): string {
    return this.value
  }

  equals(other: EntityId): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}