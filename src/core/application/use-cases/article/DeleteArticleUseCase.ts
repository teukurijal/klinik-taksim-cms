import { ArticleRepository } from '../../../domain/repositories/ArticleRepository'
import { EntityId } from '../../../domain/value-objects/EntityId'

export class DeleteArticleUseCase {
  constructor(private articleRepository: ArticleRepository) {}

  async execute(id: string): Promise<void> {
    await this.articleRepository.delete(new EntityId(id))
  }
}