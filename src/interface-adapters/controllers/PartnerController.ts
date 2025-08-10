import { NextRequest, NextResponse } from 'next/server'
import { CreatePartnerUseCase } from '../../core/application/use-cases/partner/CreatePartnerUseCase'
import { GetPartnerUseCase, GetAllPartnersUseCase } from '../../core/application/use-cases/partner/GetPartnerUseCase'
import { UpdatePartnerUseCase } from '../../core/application/use-cases/partner/UpdatePartnerUseCase'
import { DeletePartnerUseCase } from '../../core/application/use-cases/partner/DeletePartnerUseCase'
import { PartnerRepository } from '../../core/domain/repositories/PartnerRepository'
import { Partner } from '../../core/domain/entities/Partner'
import { DomainError } from '../../shared/errors/DomainError'

export class PartnerController {
  constructor(private partnerRepository: PartnerRepository) {}

  async create(request: NextRequest): Promise<NextResponse> {
    try {
      const body = await request.json()
      
      if (body.image_url) {
        body.imageUrl = body.image_url
      }

      const useCase = new CreatePartnerUseCase(this.partnerRepository)
      const partner = await useCase.execute(body)
      
      return NextResponse.json({ 
        data: this.partnerToResponse(partner),
        success: true 
      }, { status: 201 })
    } catch (error) {
      return this.handleError(error)
    }
  }

  async getById(id: string): Promise<NextResponse> {
    try {
      const useCase = new GetPartnerUseCase(this.partnerRepository)
      const partner = await useCase.execute(id)
      
      return NextResponse.json({ 
        data: this.partnerToResponse(partner),
        success: true 
      })
    } catch (error) {
      return this.handleError(error)
    }
  }

  async getAll(): Promise<NextResponse> {
    try {
      const useCase = new GetAllPartnersUseCase(this.partnerRepository)
      const partners = await useCase.execute()
      
      return NextResponse.json({ 
        data: partners.map(partner => this.partnerToResponse(partner)),
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

      const useCase = new UpdatePartnerUseCase(this.partnerRepository)
      const partner = await useCase.execute(id, body)
      
      return NextResponse.json({ 
        data: this.partnerToResponse(partner),
        success: true 
      })
    } catch (error) {
      return this.handleError(error)
    }
  }

  async delete(id: string): Promise<NextResponse> {
    try {
      const useCase = new DeletePartnerUseCase(this.partnerRepository)
      await useCase.execute(id)
      
      return NextResponse.json({ 
        success: true,
        message: 'Partner deleted successfully'
      })
    } catch (error) {
      return this.handleError(error)
    }
  }

  private partnerToResponse(partner: Partner) {
    return {
      id: partner.getId().getValue(),
      image_url: partner.getImageUrl(),
      name: partner.getName(),
      link: partner.getLink(),
      created_at: partner.getCreatedAt().toISOString(),
      updated_at: partner.getUpdatedAt().toISOString()
    }
  }

  private handleError(error: unknown): NextResponse {
    console.error('Partner controller error:', error)
    
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