import { NextRequest, NextResponse } from 'next/server'
import { CreatePromoUseCase } from '../../core/application/use-cases/promo/CreatePromoUseCase'
import { GetPromoUseCase, GetAllPromosUseCase, GetActivePromosUseCase, GetCurrentlyActivePromosUseCase } from '../../core/application/use-cases/promo/GetPromoUseCase'
import { UpdatePromoUseCase } from '../../core/application/use-cases/promo/UpdatePromoUseCase'
import { DeletePromoUseCase } from '../../core/application/use-cases/promo/DeletePromoUseCase'
import { PromoRepository } from '../../core/domain/repositories/PromoRepository'
import { Promo } from '../../core/domain/entities/Promo'
import { DomainError } from '../../shared/errors/DomainError'

export class PromoController {
  constructor(private promoRepository: PromoRepository) {}

  async create(request: NextRequest): Promise<NextResponse> {
    try {
      const body = await request.json()
      
      if (body.start_date) {
        body.startDate = new Date(body.start_date)
      }
      if (body.end_date) {
        body.endDate = new Date(body.end_date)
      }

      const useCase = new CreatePromoUseCase(this.promoRepository)
      const promo = await useCase.execute(body)
      
      return NextResponse.json({ 
        data: this.promoToResponse(promo),
        success: true 
      }, { status: 201 })
    } catch (error) {
      return this.handleError(error)
    }
  }

  async getById(id: string): Promise<NextResponse> {
    try {
      const useCase = new GetPromoUseCase(this.promoRepository)
      const promo = await useCase.execute(id)
      
      return NextResponse.json({ 
        data: this.promoToResponse(promo),
        success: true 
      })
    } catch (error) {
      return this.handleError(error)
    }
  }

  async getAll(filter?: string): Promise<NextResponse> {
    try {
      let useCase
      
      switch (filter) {
        case 'active':
          useCase = new GetActivePromosUseCase(this.promoRepository)
          break
        case 'current':
          useCase = new GetCurrentlyActivePromosUseCase(this.promoRepository)
          break
        default:
          useCase = new GetAllPromosUseCase(this.promoRepository)
      }
      
      const promos = await useCase.execute()
      
      return NextResponse.json({ 
        data: promos.map(promo => this.promoToResponse(promo)),
        success: true 
      })
    } catch (error) {
      return this.handleError(error)
    }
  }

  async update(id: string, request: NextRequest): Promise<NextResponse> {
    try {
      const body = await request.json()
      
      if (body.start_date) {
        body.startDate = new Date(body.start_date)
      }
      if (body.end_date) {
        body.endDate = new Date(body.end_date)
      }

      const useCase = new UpdatePromoUseCase(this.promoRepository)
      const promo = await useCase.execute(id, body)
      
      return NextResponse.json({ 
        data: this.promoToResponse(promo),
        success: true 
      })
    } catch (error) {
      return this.handleError(error)
    }
  }

  async delete(id: string): Promise<NextResponse> {
    try {
      const useCase = new DeletePromoUseCase(this.promoRepository)
      await useCase.execute(id)
      
      return NextResponse.json({ 
        success: true,
        message: 'Promo deleted successfully'
      })
    } catch (error) {
      return this.handleError(error)
    }
  }

  private promoToResponse(promo: Promo) {
    return {
      id: promo.getId().getValue(),
      title: promo.getTitle(),
      description: promo.getDescription(),
      status: promo.getStatus(),
      image_url: promo.getImageUrl(),
      start_date: promo.getStartDate()?.toISOString().split('T')[0],
      end_date: promo.getEndDate()?.toISOString().split('T')[0],
      created_at: promo.getCreatedAt().toISOString(),
      updated_at: promo.getUpdatedAt().toISOString()
    }
  }

  private handleError(error: unknown): NextResponse {
    console.error('Promo controller error:', error)
    
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