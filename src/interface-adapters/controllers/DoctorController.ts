import { NextRequest, NextResponse } from 'next/server'
import { CreateDoctorUseCase } from '../../core/application/use-cases/doctor/CreateDoctorUseCase'
import { GetDoctorUseCase } from '../../core/application/use-cases/doctor/GetDoctorUseCase'
import { GetAllDoctorsUseCase, GetActiveDoctorsUseCase } from '../../core/application/use-cases/doctor/GetAllDoctorsUseCase'
import { UpdateDoctorUseCase } from '../../core/application/use-cases/doctor/UpdateDoctorUseCase'
import { DeleteDoctorUseCase } from '../../core/application/use-cases/doctor/DeleteDoctorUseCase'
import { DoctorRepository } from '../../core/domain/repositories/DoctorRepository'
import { Doctor } from '../../core/domain/entities/Doctor'
import { DomainError } from '../../shared/errors/DomainError'

export class DoctorController {
  constructor(private doctorRepository: DoctorRepository) {}

  async create(request: NextRequest): Promise<NextResponse> {
    try {
      const body = await request.json()
      const useCase = new CreateDoctorUseCase(this.doctorRepository)
      const doctor = await useCase.execute(body)
      
      return NextResponse.json({ 
        data: this.doctorToResponse(doctor),
        success: true 
      }, { status: 201 })
    } catch (error) {
      return this.handleError(error)
    }
  }

  async getById(id: string): Promise<NextResponse> {
    try {
      const useCase = new GetDoctorUseCase(this.doctorRepository)
      const doctor = await useCase.execute(id)
      
      return NextResponse.json({ 
        data: this.doctorToResponse(doctor),
        success: true 
      })
    } catch (error) {
      return this.handleError(error)
    }
  }

  async getAll(activeOnly: boolean = false): Promise<NextResponse> {
    try {
      const useCase = activeOnly 
        ? new GetActiveDoctorsUseCase(this.doctorRepository)
        : new GetAllDoctorsUseCase(this.doctorRepository)
      
      const doctors = await useCase.execute()
      
      return NextResponse.json({ 
        data: doctors.map(doctor => this.doctorToResponse(doctor)),
        success: true 
      })
    } catch (error) {
      return this.handleError(error)
    }
  }

  async update(id: string, request: NextRequest): Promise<NextResponse> {
    try {
      const body = await request.json()
      const useCase = new UpdateDoctorUseCase(this.doctorRepository)
      const doctor = await useCase.execute(id, body)
      
      return NextResponse.json({ 
        data: this.doctorToResponse(doctor),
        success: true 
      })
    } catch (error) {
      return this.handleError(error)
    }
  }

  async delete(id: string): Promise<NextResponse> {
    try {
      const useCase = new DeleteDoctorUseCase(this.doctorRepository)
      await useCase.execute(id)
      
      return NextResponse.json({ 
        success: true,
        message: 'Doctor deleted successfully'
      })
    } catch (error) {
      return this.handleError(error)
    }
  }

  private doctorToResponse(doctor: Doctor) {
    return {
      id: doctor.getId().getValue(),
      full_name: doctor.getFullName(),
      specialist: doctor.getSpecialist(),
      status: doctor.getStatus(),
      photo_url: doctor.getPhotoUrl(),
      education: doctor.getEducation(),
      experience: doctor.getExperience(),
      schedule: doctor.getSchedule(),
      str_number: doctor.getStrNumber(),
      sip_number: doctor.getSipNumber(),
      phone_number: doctor.getPhoneNumber()?.getValue(),
      email: doctor.getEmail()?.getValue(),
      gender: doctor.getGender(),
      years_of_practice: doctor.getYearsOfPractice(),
      clinic_room: doctor.getClinicRoom(),
      created_at: doctor.getCreatedAt().toISOString(),
      updated_at: doctor.getUpdatedAt().toISOString()
    }
  }

  private handleError(error: unknown): NextResponse {
    console.error('Doctor controller error:', error)
    
    if (error instanceof DomainError) {
      const status = error.code === 'NOT_FOUND' ? 404 : 
                    error.code === 'VALIDATION_ERROR' ? 400 : 
                    error.code === 'CONFLICT' ? 409 : 500

      return NextResponse.json({ 
        error: error.message,
        code: error.code,
        success: false 
      }, { status })
    }

    return NextResponse.json({ 
      error: 'Internal server error',
      success: false 
    }, { status: 500 })
  }
}