import { Article, ArticleStatus } from '../../../core/domain/entities/Article'
import { EntityId } from '../../../core/domain/value-objects/EntityId'

export interface ArticleRow {
  id: string
  title: string
  content: string
  status: string
  slug?: string
  excerpt?: string
  image_url?: string
  author?: string
  tags?: string[]
  published_at?: string
  created_at: string
  updated_at: string
}

export class ArticleModel {
  static toDomain(row: ArticleRow): Article {
    return new Article(
      new EntityId(row.id),
      row.title,
      row.content,
      row.status as ArticleStatus,
      row.slug,
      row.excerpt,
      row.image_url,
      row.author,
      row.tags,
      row.published_at ? new Date(row.published_at) : undefined,
      new Date(row.created_at),
      new Date(row.updated_at)
    )
  }

  static fromDomain(article: Article): Omit<ArticleRow, 'created_at' | 'updated_at'> {
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
      published_at: article.getPublishedAt()?.toISOString()
    }
  }
}