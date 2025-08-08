import { Article, ArticleStatus } from '../../../domain/entities/Article'
import { ArticleRepository } from '../../../domain/repositories/ArticleRepository'
import { EntityId } from '../../../domain/value-objects/EntityId'

export interface CreateArticleRequest {
  title: string
  content: string
  slug?: string
  excerpt?: string
  imageUrl?: string
  author?: string
  tags?: string[]
  status?: ArticleStatus
}

export class CreateArticleUseCase {
  constructor(private articleRepository: ArticleRepository) {}

  async execute(request: CreateArticleRequest): Promise<Article> {
    const id = new EntityId(crypto.randomUUID())
    
    const article = new Article(
      id,
      request.title,
      request.content,
      request.status || ArticleStatus.DRAFT,
      request.slug,
      request.excerpt,
      request.imageUrl,
      request.author,
      request.tags
    )

    await this.articleRepository.save(article)
    return article
  }
}