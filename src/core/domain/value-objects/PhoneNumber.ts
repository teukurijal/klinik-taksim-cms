export class PhoneNumber {
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Phone number cannot be empty')
    }
  }

  getValue(): string {
    return this.value
  }

  equals(other: PhoneNumber): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}