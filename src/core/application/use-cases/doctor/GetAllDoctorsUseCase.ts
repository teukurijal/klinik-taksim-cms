import { Doctor } from '../../../domain/entities/Doctor'
import { DoctorRepository } from '../../../domain/repositories/DoctorRepository'

export class GetAllDoctorsUseCase {
  constructor(private doctorRepository: DoctorRepository) {}

  async execute(): Promise<Doctor[]> {
    return await this.doctorRepository.findAll()
  }
}

export class GetActiveDoctorsUseCase {
  constructor(private doctorRepository: DoctorRepository) {}

  async execute(): Promise<Doctor[]> {
    return await this.doctorRepository.findActiveOnly()
  }
}