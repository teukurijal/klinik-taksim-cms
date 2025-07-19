import { NextRequest, NextResponse } from 'next/server'
import { CreateFAQUseCase } from '../../core/application/use-cases/faq/CreateFAQUseCase'
import { GetFAQUseCase, GetAllFAQsUseCase } from '../../core/application/use-cases/faq/GetFAQUseCase'
import { UpdateFAQUseCase } from '../../core/application/use-cases/faq/UpdateFAQUseCase'
import { DeleteFAQUseCase } from '../../core/application/use-cases/faq/DeleteFAQUseCase'
import { FAQRepository } from '../../core/domain/repositories/FAQRepository'
import { FAQ } from '../../core/domain/entities/FAQ'
import { DomainError } from '../../shared/errors/DomainError'

export class FAQController {
  constructor(private faqRepository: FAQRepository) {}

  async create(request: NextRequest): Promise<NextResponse> {
    try {
      const body = await request.json()

      const useCase = new CreateFAQUseCase(this.faqRepository)
      const faq = await useCase.execute({
        question: body.question,
        answer: body.answer
      })
      
      return NextResponse.json({ 
        data: this.faqToResponse(faq),
        success: true 
      }, { status: 201 })
    } catch (error) {
      return this.handleError(error)
    }
  }

  async getById(id: string): Promise<NextResponse> {
    try {
      const useCase = new GetFAQUseCase(this.faqRepository)
      const faq = await useCase.execute(id)
      
      return NextResponse.json({ 
        data: this.faqToResponse(faq),
        success: true 
      })
    } catch (error) {
      return this.handleError(error)
    }
  }

  async getAll(): Promise<NextResponse> {
    try {
      const useCase = new GetAllFAQsUseCase(this.faqRepository)
      const faqs = await useCase.execute()
      
      return NextResponse.json({ 
        data: faqs.map(faq => this.faqToResponse(faq)),
        success: true 
      })
    } catch (error) {
      return this.handleError(error)
    }
  }

  async update(id: string, request: NextRequest): Promise<NextResponse> {
    try {
      const body = await request.json()

      const useCase = new UpdateFAQUseCase(this.faqRepository)
      const faq = await useCase.execute(id, {
        question: body.question,
        answer: body.answer
      })
      
      return NextResponse.json({ 
        data: this.faqToResponse(faq),
        success: true 
      })
    } catch (error) {
      return this.handleError(error)
    }
  }

  async delete(id: string): Promise<NextResponse> {
    try {
      const useCase = new DeleteFAQUseCase(this.faqRepository)
      await useCase.execute(id)
      
      return NextResponse.json({ 
        success: true,
        message: 'FAQ deleted successfully'
      })
    } catch (error) {
      return this.handleError(error)
    }
  }

  private faqToResponse(faq: FAQ) {
    return {
      id: faq.getId().getValue(),
      question: faq.getQuestion(),
      answer: faq.getAnswer(),
      created_at: faq.getCreatedAt().toISOString(),
      updated_at: faq.getUpdatedAt().toISOString()
    }
  }

  private handleError(error: unknown): NextResponse {
    console.error('FAQ controller error:', error)
    
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