export abstract class DomainError extends Error {
  abstract readonly code: string
  
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

export class NotFoundError extends DomainError {
  readonly code = 'NOT_FOUND'
  
  constructor(entity: string, id: string) {
    super(`${entity} with id ${id} not found`)
  }
}

export class ValidationError extends DomainError {
  readonly code = 'VALIDATION_ERROR'
  
  constructor(message: string) {
    super(message)
  }
}

export class ConflictError extends DomainError {
  readonly code = 'CONFLICT'
  
  constructor(message: string) {
    super(message)
  }
}