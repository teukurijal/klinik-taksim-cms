import { NextRequest, NextResponse } from 'next/server'
import { CreatePolyClinicUseCase } from '@/core/application/use-cases/polyclinic/CreatePolyClinicUseCase'
import { GetPolyClinicUseCase } from '@/core/application/use-cases/polyclinic/GetPolyClinicUseCase'
import { GetAllPolyClinicsUseCase } from '@/core/application/use-cases/polyclinic/GetAllPolyClinicsUseCase'
import { UpdatePolyClinicUseCase } from '@/core/application/use-cases/polyclinic/UpdatePolyClinicUseCase'
import { DeletePolyClinicUseCase } from '@/core/application/use-cases/polyclinic/DeletePolyClinicUseCase'

export class PolyClinicController {
  constructor(
    private readonly createPolyClinicUseCase: CreatePolyClinicUseCase,
    private readonly getPolyClinicUseCase: GetPolyClinicUseCase,
    private readonly getAllPolyClinicsUseCase: GetAllPolyClinicsUseCase,
    private readonly updatePolyClinicUseCase: UpdatePolyClinicUseCase,
    private readonly deletePolyClinicUseCase: DeletePolyClinicUseCase
  ) {}

  async createPolyClinic(request: NextRequest): Promise<NextResponse> {
    try {
      const data = await request.json()
      
      const polyClinic = await this.createPolyClinicUseCase.execute({
        name: data.name,
        description: data.description,
        head: data.head,
        location: data.location,
        phoneNumber: data.phone_number,
        email: data.email,
        workingHours: data.working_hours,
        capacity: data.capacity ? parseInt(data.capacity) : undefined,
        services: data.services
      })

      return NextResponse.json({
        success: true,
        data: {
          id: polyClinic.getId().getValue(),
          name: polyClinic.getName(),
          description: polyClinic.getDescription(),
          status: polyClinic.getStatus(),
          head: polyClinic.getHead(),
          location: polyClinic.getLocation(),
          phone_number: polyClinic.getPhoneNumber(),
          email: polyClinic.getEmail(),
          working_hours: polyClinic.getWorkingHours(),
          capacity: polyClinic.getCapacity(),
          services: polyClinic.getServices(),
          created_at: polyClinic.getCreatedAt().toISOString(),
          updated_at: polyClinic.getUpdatedAt().toISOString()
        }
      }, { status: 201 })
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create polyclinic'
      }, { status: 400 })
    }
  }

  async getPolyClinic(id: string): Promise<NextResponse> {
    try {
      const polyClinic = await this.getPolyClinicUseCase.execute(id)

      if (!polyClinic) {
        return NextResponse.json({
          success: false,
          error: 'PolyClinic not found'
        }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        data: {
          id: polyClinic.getId().getValue(),
          name: polyClinic.getName(),
          description: polyClinic.getDescription(),
          status: polyClinic.getStatus(),
          head: polyClinic.getHead(),
          location: polyClinic.getLocation(),
          phone_number: polyClinic.getPhoneNumber(),
          email: polyClinic.getEmail(),
          working_hours: polyClinic.getWorkingHours(),
          capacity: polyClinic.getCapacity(),
          services: polyClinic.getServices(),
          created_at: polyClinic.getCreatedAt().toISOString(),
          updated_at: polyClinic.getUpdatedAt().toISOString()
        }
      })
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get polyclinic'
      }, { status: 500 })
    }
  }

  async getAllPolyClinics(): Promise<NextResponse> {
    try {
      const polyClinics = await this.getAllPolyClinicsUseCase.execute()

      return NextResponse.json({
        success: true,
        data: polyClinics.map(polyClinic => ({
          id: polyClinic.getId().getValue(),
          name: polyClinic.getName(),
          description: polyClinic.getDescription(),
          status: polyClinic.getStatus(),
          head: polyClinic.getHead(),
          location: polyClinic.getLocation(),
          phone_number: polyClinic.getPhoneNumber(),
          email: polyClinic.getEmail(),
          working_hours: polyClinic.getWorkingHours(),
          capacity: polyClinic.getCapacity(),
          services: polyClinic.getServices(),
          created_at: polyClinic.getCreatedAt().toISOString(),
          updated_at: polyClinic.getUpdatedAt().toISOString()
        }))
      })
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get polyclinics'
      }, { status: 500 })
    }
  }

  async getAll(activeOnly: boolean = false): Promise<NextResponse> {
    try {
      const polyClinics = await this.getAllPolyClinicsUseCase.execute(activeOnly)

      return NextResponse.json({
        success: true,
        data: polyClinics.map(polyClinic => ({
          id: polyClinic.getId().getValue(),
          name: polyClinic.getName(),
          description: polyClinic.getDescription(),
          status: polyClinic.getStatus(),
          head: polyClinic.getHead(),
          location: polyClinic.getLocation(),
          phone_number: polyClinic.getPhoneNumber(),
          email: polyClinic.getEmail(),
          working_hours: polyClinic.getWorkingHours(),
          capacity: polyClinic.getCapacity(),
          services: polyClinic.getServices(),
          created_at: polyClinic.getCreatedAt().toISOString(),
          updated_at: polyClinic.getUpdatedAt().toISOString()
        }))
      })
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get polyclinics'
      }, { status: 500 })
    }
  }

  async updatePolyClinic(id: string, request: NextRequest): Promise<NextResponse> {
    try {
      const data = await request.json()
      
      const polyClinic = await this.updatePolyClinicUseCase.execute({
        id,
        name: data.name,
        description: data.description,
        head: data.head,
        location: data.location,
        phoneNumber: data.phone_number,
        email: data.email,
        workingHours: data.working_hours,
        capacity: data.capacity ? parseInt(data.capacity) : undefined,
        services: data.services
      })

      if (!polyClinic) {
        return NextResponse.json({
          success: false,
          error: 'PolyClinic not found'
        }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        data: {
          id: polyClinic.getId().getValue(),
          name: polyClinic.getName(),
          description: polyClinic.getDescription(),
          status: polyClinic.getStatus(),
          head: polyClinic.getHead(),
          location: polyClinic.getLocation(),
          phone_number: polyClinic.getPhoneNumber(),
          email: polyClinic.getEmail(),
          working_hours: polyClinic.getWorkingHours(),
          capacity: polyClinic.getCapacity(),
          services: polyClinic.getServices(),
          created_at: polyClinic.getCreatedAt().toISOString(),
          updated_at: polyClinic.getUpdatedAt().toISOString()
        }
      })
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update polyclinic'
      }, { status: 400 })
    }
  }

  async deletePolyClinic(id: string): Promise<NextResponse> {
    try {
      await this.deletePolyClinicUseCase.execute(id)

      return NextResponse.json({
        success: true,
        message: 'PolyClinic deleted successfully'
      })
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete polyclinic'
      }, { status: 500 })
    }
  }

  async create(request: NextRequest): Promise<NextResponse> {
    return this.createPolyClinic(request)
  }

  async getById(id: string): Promise<NextResponse> {
    return this.getPolyClinic(id)
  }

  async update(id: string, request: NextRequest): Promise<NextResponse> {
    return this.updatePolyClinic(id, request)
  }

  async delete(id: string): Promise<NextResponse> {
    return this.deletePolyClinic(id)
  }
}