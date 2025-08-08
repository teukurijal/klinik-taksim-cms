import { Article } from '../../../domain/entities/Article'
import { ArticleRepository } from '../../../domain/repositories/ArticleRepository'
import { EntityId } from '../../../domain/value-objects/EntityId'
import { NotFoundError } from '../../../../shared/errors/DomainError'

export class GetArticleUseCase {
  constructor(private articleRepository: ArticleRepository) {}

  async execute(id: string): Promise<Article> {
    const entityId = new EntityId(id)
    const article = await this.articleRepository.findById(entityId)
    
    if (!article) {
      throw new NotFoundError('Article', id)
    }
    
    return article
  }

  async executeBySlug(slug: string): Promise<Article | null> {
    return this.articleRepository.findBySlug(slug)
  }
}