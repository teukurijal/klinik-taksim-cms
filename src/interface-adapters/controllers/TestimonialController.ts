import { NextRequest, NextResponse } from 'next/server'
import { CreateTestimonialUseCase } from '../../core/application/use-cases/testimonial/CreateTestimonialUseCase'
import { GetTestimonialUseCase, GetAllTestimonialsUseCase, GetTestimonialsByCategoryUseCase } from '../../core/application/use-cases/testimonial/GetTestimonialUseCase'
import { UpdateTestimonialUseCase } from '../../core/application/use-cases/testimonial/UpdateTestimonialUseCase'
import { DeleteTestimonialUseCase } from '../../core/application/use-cases/testimonial/DeleteTestimonialUseCase'
import { TestimonialRepository } from '../../core/domain/repositories/TestimonialRepository'
import { Testimonial } from '../../core/domain/entities/Testimonial'
import { DomainError } from '../../shared/errors/DomainError'

export class TestimonialController {
  constructor(private testimonialRepository: TestimonialRepository) {}

  async create(request: NextRequest): Promise<NextResponse> {
    try {
      const body = await request.json()
      
      if (body.photo_url) {
        body.photoUrl = body.photo_url
      }

      const useCase = new CreateTestimonialUseCase(this.testimonialRepository)
      const testimonial = await useCase.execute({
        name: body.name,
        testimonialText: body.testimonial_text,
        photoUrl: body.photoUrl,
        patientCategory: body.patient_category,
        rate: body.rate
      })
      
      return NextResponse.json({ 
        data: this.testimonialToResponse(testimonial),
        success: true 
      }, { status: 201 })
    } catch (error) {
      return this.handleError(error)
    }
  }

  async getById(id: string): Promise<NextResponse> {
    try {
      const useCase = new GetTestimonialUseCase(this.testimonialRepository)
      const testimonial = await useCase.execute(id)
      
      return NextResponse.json({ 
        data: this.testimonialToResponse(testimonial),
        success: true 
      })
    } catch (error) {
      return this.handleError(error)
    }
  }

  async getAll(request: NextRequest): Promise<NextResponse> {
    try {
      const { searchParams } = new URL(request.url)
      const category = searchParams.get('category')

      let useCase
      if (category) {
        useCase = new GetTestimonialsByCategoryUseCase(this.testimonialRepository)
        const testimonials = await useCase.execute(category)
        return NextResponse.json({ 
          data: testimonials.map(testimonial => this.testimonialToResponse(testimonial)),
          success: true 
        })
      } else {
        useCase = new GetAllTestimonialsUseCase(this.testimonialRepository)
        const testimonials = await useCase.execute()
        return NextResponse.json({ 
          data: testimonials.map(testimonial => this.testimonialToResponse(testimonial)),
          success: true 
        })
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  async update(id: string, request: NextRequest): Promise<NextResponse> {
    try {
      const body = await request.json()
      
      if (body.photo_url) {
        body.photoUrl = body.photo_url
      }

      const useCase = new UpdateTestimonialUseCase(this.testimonialRepository)
      const testimonial = await useCase.execute(id, {
        name: body.name,
        testimonialText: body.testimonial_text,
        photoUrl: body.photoUrl,
        patientCategory: body.patient_category,
        rate: body.rate
      })
      
      return NextResponse.json({ 
        data: this.testimonialToResponse(testimonial),
        success: true 
      })
    } catch (error) {
      return this.handleError(error)
    }
  }

  async delete(id: string): Promise<NextResponse> {
    try {
      const useCase = new DeleteTestimonialUseCase(this.testimonialRepository)
      await useCase.execute(id)
      
      return NextResponse.json({ 
        success: true,
        message: 'Testimonial deleted successfully'
      })
    } catch (error) {
      return this.handleError(error)
    }
  }

  private testimonialToResponse(testimonial: Testimonial) {
    return {
      id: testimonial.getId().getValue(),
      name: testimonial.getName(),
      photo_url: testimonial.getPhotoUrl(),
      testimonial_text: testimonial.getTestimonialText(),
      patient_category: testimonial.getPatientCategory(),
      rate: testimonial.getRate(),
      created_at: testimonial.getCreatedAt().toISOString(),
      updated_at: testimonial.getUpdatedAt().toISOString()
    }
  }

  private handleError(error: unknown): NextResponse {
    console.error('Testimonial controller error:', error)
    
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