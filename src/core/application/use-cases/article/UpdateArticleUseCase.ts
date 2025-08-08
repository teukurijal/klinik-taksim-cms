import { Article, ArticleStatus } from '../../../domain/entities/Article'
import { ArticleRepository } from '../../../domain/repositories/ArticleRepository'
import { EntityId } from '../../../domain/value-objects/EntityId'
import { NotFoundError } from '../../../../shared/errors/DomainError'

export interface UpdateArticleRequest {
  title?: string
  content?: string
  slug?: string
  excerpt?: string
  imageUrl?: string
  author?: string
  tags?: string[]
  status?: ArticleStatus
}

export class UpdateArticleUseCase {
  constructor(private articleRepository: ArticleRepository) {}

  async execute(id: string, request: UpdateArticleRequest): Promise<Article> {
    const entityId = new EntityId(id)
    const article = await this.articleRepository.findById(entityId)
    
    if (!article) {
      throw new NotFoundError('Article', id)
    }

    article.updateContent({
      title: request.title,
      content: request.content,
      slug: request.slug,
      excerpt: request.excerpt,
      imageUrl: request.imageUrl,
      author: request.author,
      tags: request.tags
    })

    if (request.status !== undefined) {
      switch (request.status) {
        case ArticleStatus.PUBLISHED:
          article.publish()
          break
        case ArticleStatus.DRAFT:
          article.draft()
          break
        case ArticleStatus.ARCHIVED:
          article.archive()
          break
      }
    }

    await this.articleRepository.save(article)
    return article
  }
}