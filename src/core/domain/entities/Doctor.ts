import { EntityId } from '../value-objects/EntityId'
import { Email } from '../value-objects/Email'
import { PhoneNumber } from '../value-objects/PhoneNumber'

export enum Gender {
  MALE = 'male',
  FEMALE = 'female'
}

export enum DoctorStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export interface DoctorSchedule {
  [key: string]: {
    start: string
    end: string
    available: boolean
  }
}

export class Doctor {
  constructor(
    private readonly id: EntityId,
    private fullName: string,
    private specialist: string,
    private status: DoctorStatus = DoctorStatus.ACTIVE,
    private photoUrl?: string,
    private education?: string,
    private experience?: string,
    private schedule?: DoctorSchedule,
    private strNumber?: string,
    private sipNumber?: string,
    private phoneNumber?: PhoneNumber,
    private email?: Email,
    private gender?: Gender,
    private yearsOfPractice?: number,
    private clinicRoom?: string,
    private createdAt: Date = new Date(),
    private updatedAt: Date = new Date()
  ) {
    if (!fullName || fullName.trim().length === 0) {
      throw new Error('Doctor full name is required')
    }
    if (!specialist || specialist.trim().length === 0) {
      throw new Error('Doctor specialist is required')
    }
  }

  getId(): EntityId {
    return this.id
  }

  getFullName(): string {
    return this.fullName
  }

  getSpecialist(): string {
    return this.specialist
  }

  getStatus(): DoctorStatus {
    return this.status
  }

  getPhotoUrl(): string | undefined {
    return this.photoUrl
  }

  getEducation(): string | undefined {
    return this.education
  }

  getExperience(): string | undefined {
    return this.experience
  }

  getSchedule(): DoctorSchedule | undefined {
    return this.schedule
  }

  getStrNumber(): string | undefined {
    return this.strNumber
  }

  getSipNumber(): string | undefined {
    return this.sipNumber
  }

  getPhoneNumber(): PhoneNumber | undefined {
    return this.phoneNumber
  }

  getEmail(): Email | undefined {
    return this.email
  }

  getGender(): Gender | undefined {
    return this.gender
  }

  getYearsOfPractice(): number | undefined {
    return this.yearsOfPractice
  }

  getClinicRoom(): string | undefined {
    return this.clinicRoom
  }

  getCreatedAt(): Date {
    return this.createdAt
  }

  getUpdatedAt(): Date {
    return this.updatedAt
  }

  updateProfile(data: {
    fullName?: string
    specialist?: string
    photoUrl?: string
    education?: string
    experience?: string
    strNumber?: string
    sipNumber?: string
    phoneNumber?: PhoneNumber
    email?: Email
    gender?: Gender
    yearsOfPractice?: number
    clinicRoom?: string
  }): void {
    if (data.fullName !== undefined) {
      if (!data.fullName || data.fullName.trim().length === 0) {
        throw new Error('Doctor full name is required')
      }
      this.fullName = data.fullName
    }
    
    if (data.specialist !== undefined) {
      if (!data.specialist || data.specialist.trim().length === 0) {
        throw new Error('Doctor specialist is required')
      }
      this.specialist = data.specialist
    }

    if (data.photoUrl !== undefined) this.photoUrl = data.photoUrl
    if (data.education !== undefined) this.education = data.education
    if (data.experience !== undefined) this.experience = data.experience
    if (data.strNumber !== undefined) this.strNumber = data.strNumber
    if (data.sipNumber !== undefined) this.sipNumber = data.sipNumber
    if (data.phoneNumber !== undefined) this.phoneNumber = data.phoneNumber
    if (data.email !== undefined) this.email = data.email
    if (data.gender !== undefined) this.gender = data.gender
    if (data.yearsOfPractice !== undefined) this.yearsOfPractice = data.yearsOfPractice
    if (data.clinicRoom !== undefined) this.clinicRoom = data.clinicRoom

    this.updatedAt = new Date()
  }

  updateSchedule(schedule: DoctorSchedule): void {
    this.schedule = schedule
    this.updatedAt = new Date()
  }

  activate(): void {
    this.status = DoctorStatus.ACTIVE
    this.updatedAt = new Date()
  }

  deactivate(): void {
    this.status = DoctorStatus.INACTIVE
    this.updatedAt = new Date()
  }

  isActive(): boolean {
    return this.status === DoctorStatus.ACTIVE
  }
}