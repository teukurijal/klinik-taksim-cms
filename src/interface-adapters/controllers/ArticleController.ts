import { NextRequest, NextResponse } from 'next/server'
import { CreateArticleUseCase } from '../../core/application/use-cases/article/CreateArticleUseCase'
import { GetAllArticlesUseCase } from '../../core/application/use-cases/article/GetAllArticlesUseCase'
import { GetArticleUseCase } from '../../core/application/use-cases/article/GetArticleUseCase'
import { UpdateArticleUseCase } from '../../core/application/use-cases/article/UpdateArticleUseCase'
import { DeleteArticleUseCase } from '../../core/application/use-cases/article/DeleteArticleUseCase'
import { ArticleRepository } from '../../core/domain/repositories/ArticleRepository'
import { Article } from '../../core/domain/entities/Article'
import { DomainError } from '../../shared/errors/DomainError'

export class ArticleController {
  constructor(private articleRepository: ArticleRepository) {}

  async getAll(status?: string): Promise<NextResponse> {
    try {
      const useCase = new GetAllArticlesUseCase(this.articleRepository)
      const articles = await useCase.execute(status)
      
      return NextResponse.json({ 
        data: articles.map(article => this.articleToResponse(article)),
        success: true 
      })
    } catch (error) {
      return this.handleError(error)
    }
  }

  async getById(id: string): Promise<NextResponse> {
    try {
      const useCase = new GetArticleUseCase(this.articleRepository)
      const article = await useCase.execute(id)
      
      return NextResponse.json({ 
        data: this.articleToResponse(article),
        success: true 
      })
    } catch (error) {
      return this.handleError(error)
    }
  }

  async create(request: NextRequest): Promise<NextResponse> {
    try {
      const body = await request.json()
      const useCase = new CreateArticleUseCase(this.articleRepository)
      const article = await useCase.execute(body)
      
      return NextResponse.json({ 
        data: this.articleToResponse(article),
        success: true 
      }, { status: 201 })
    } catch (error) {
      return this.handleError(error)
    }
  }

  async update(id: string, request: NextRequest): Promise<NextResponse> {
    try {
      const body = await request.json()
      const useCase = new UpdateArticleUseCase(this.articleRepository)
      const article = await useCase.execute(id, body)
      
      return NextResponse.json({ 
        data: this.articleToResponse(article),
        success: true 
      })
    } catch (error) {
      return this.handleError(error)
    }
  }

  async delete(id: string): Promise<NextResponse> {
    try {
      const useCase = new DeleteArticleUseCase(this.articleRepository)
      await useCase.execute(id)
      
      return NextResponse.json({ 
        success: true,
        message: 'Article deleted successfully'
      })
    } catch (error) {
      return this.handleError(error)
    }
  }

  private articleToResponse(article: Article) {
    return {
      id: article.getId().getValue(),
      title: article.getTitle(),
      content: article.getContent(),
      status: article.getStatus(),
      slug: article.getSlug(),
      excerpt: article.getExcerpt(),
      image_url: article.getImageUrl(),
      author: article.getAuthor(),
      tags: article.getTags(),
      published_at: article.getPublishedAt()?.toISOString(),
      created_at: article.getCreatedAt().toISOString(),
      updated_at: article.getUpdatedAt().toISOString()
    }
  }

  private handleError(error: unknown): NextResponse {
    console.error('Article controller error:', error)
    
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