import { NextRequest, NextResponse } from 'next/server'
import { CreateFacilityPhotoUseCase } from '../../core/application/use-cases/facility-photo/CreateFacilityPhotoUseCase'
import { GetFacilityPhotoUseCase, GetAllFacilityPhotosUseCase } from '../../core/application/use-cases/facility-photo/GetFacilityPhotoUseCase'
import { UpdateFacilityPhotoUseCase } from '../../core/application/use-cases/facility-photo/UpdateFacilityPhotoUseCase'
import { DeleteFacilityPhotoUseCase } from '../../core/application/use-cases/facility-photo/DeleteFacilityPhotoUseCase'
import { FacilityPhotoRepository } from '../../core/domain/repositories/FacilityPhotoRepository'
import { FacilityPhoto } from '../../core/domain/entities/FacilityPhoto'
import { DomainError } from '../../shared/errors/DomainError'

export class FacilityPhotoController {
  constructor(private facilityPhotoRepository: FacilityPhotoRepository) {}

  async create(request: NextRequest): Promise<NextResponse> {
    try {
      const body = await request.json()
      
      if (body.image_url) {
        body.imageUrl = body.image_url
      }

      const useCase = new CreateFacilityPhotoUseCase(this.facilityPhotoRepository)
      const facilityPhoto = await useCase.execute(body)
      
      return NextResponse.json({ 
        data: this.facilityPhotoToResponse(facilityPhoto),
        success: true 
      }, { status: 201 })
    } catch (error) {
      return this.handleError(error)
    }
  }

  async getById(id: string): Promise<NextResponse> {
    try {
      const useCase = new GetFacilityPhotoUseCase(this.facilityPhotoRepository)
      const facilityPhoto = await useCase.execute(id)
      
      return NextResponse.json({ 
        data: this.facilityPhotoToResponse(facilityPhoto),
        success: true 
      })
    } catch (error) {
      return this.handleError(error)
    }
  }

  async getAll(): Promise<NextResponse> {
    try {
      const useCase = new GetAllFacilityPhotosUseCase(this.facilityPhotoRepository)
      const facilityPhotos = await useCase.execute()
      
      return NextResponse.json({ 
        data: facilityPhotos.map(photo => this.facilityPhotoToResponse(photo)),
        success: true 
      })
    } catch (error) {
      return this.handleError(error)
    }
  }

  async update(id: string, request: NextRequest): Promise<NextResponse> {
    try {
      const body = await request.json()
      
      if (body.image_url) {
        body.imageUrl = body.image_url
      }

      const useCase = new UpdateFacilityPhotoUseCase(this.facilityPhotoRepository)
      const facilityPhoto = await useCase.execute(id, body)
      
      return NextResponse.json({ 
        data: this.facilityPhotoToResponse(facilityPhoto),
        success: true 
      })
    } catch (error) {
      return this.handleError(error)
    }
  }

  async delete(id: string): Promise<NextResponse> {
    try {
      const useCase = new DeleteFacilityPhotoUseCase(this.facilityPhotoRepository)
      await useCase.execute(id)
      
      return NextResponse.json({ 
        success: true,
        message: 'Facility photo deleted successfully'
      })
    } catch (error) {
      return this.handleError(error)
    }
  }

  private facilityPhotoToResponse(facilityPhoto: FacilityPhoto) {
    return {
      id: facilityPhoto.getId().getValue(),
      image_url: facilityPhoto.getImageUrl(),
      title: facilityPhoto.getTitle(),
      description: facilityPhoto.getDescription(),
      created_at: facilityPhoto.getCreatedAt().toISOString(),
      updated_at: facilityPhoto.getUpdatedAt().toISOString()
    }
  }

  private handleError(error: unknown): NextResponse {
    console.error('Facility photo controller error:', error)
    
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