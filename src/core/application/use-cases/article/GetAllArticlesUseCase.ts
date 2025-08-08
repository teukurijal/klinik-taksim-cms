import { Article } from '../../../domain/entities/Article'
import { ArticleRepository } from '../../../domain/repositories/ArticleRepository'

export class GetAllArticlesUseCase {
  constructor(private articleRepository: ArticleRepository) {}

  async execute(status?: string): Promise<Article[]> {
    if (status) {
      return this.articleRepository.findByStatus(status)
    }
    return this.articleRepository.findAll()
  }
}