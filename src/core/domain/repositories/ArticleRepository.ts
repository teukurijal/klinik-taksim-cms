import { Article } from '../entities/Article'
import { EntityId } from '../value-objects/EntityId'

export interface ArticleRepository {
  findById(id: EntityId): Promise<Article | null>
  findAll(): Promise<Article[]>
  findByStatus(status: string): Promise<Article[]>
  findBySlug(slug: string): Promise<Article | null>
  save(article: Article): Promise<void>
  delete(id: EntityId): Promise<void>
}