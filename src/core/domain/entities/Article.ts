import { EntityId } from '../value-objects/EntityId'

export enum ArticleStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export class Article {
  constructor(
    private readonly id: EntityId,
    private title: string,
    private content: string,
    private status: ArticleStatus = ArticleStatus.DRAFT,
    private slug?: string,
    private excerpt?: string,
    private imageUrl?: string,
    private author?: string,
    private tags?: string[],
    private publishedAt?: Date,
    private createdAt: Date = new Date(),
    private updatedAt: Date = new Date()
  ) {}

  getId(): EntityId {
    return this.id
  }

  getTitle(): string {
    return this.title
  }

  getContent(): string {
    return this.content
  }

  getStatus(): ArticleStatus {
    return this.status
  }

  getSlug(): string | undefined {
    return this.slug
  }

  getExcerpt(): string | undefined {
    return this.excerpt
  }

  getImageUrl(): string | undefined {
    return this.imageUrl
  }

  getAuthor(): string | undefined {
    return this.author
  }

  getTags(): string[] | undefined {
    return this.tags
  }

  getPublishedAt(): Date | undefined {
    return this.publishedAt
  }

  getCreatedAt(): Date {
    return this.createdAt
  }

  getUpdatedAt(): Date {
    return this.updatedAt
  }

  updateContent(data: {
    title?: string
    content?: string
    slug?: string
    excerpt?: string
    imageUrl?: string
    author?: string
    tags?: string[]
  }): void {
    if (data.title !== undefined) {
      if (!data.title || data.title.trim().length === 0) {
        throw new Error('Article title is required')
      }
      this.title = data.title
    }
    
    if (data.content !== undefined) {
      if (!data.content || data.content.trim().length === 0) {
        throw new Error('Article content is required')
      }
      this.content = data.content
    }

    if (data.slug !== undefined) this.slug = data.slug
    if (data.excerpt !== undefined) this.excerpt = data.excerpt
    if (data.imageUrl !== undefined) this.imageUrl = data.imageUrl
    if (data.author !== undefined) this.author = data.author
    if (data.tags !== undefined) this.tags = data.tags

    this.updatedAt = new Date()
  }

  publish(): void {
    this.status = ArticleStatus.PUBLISHED
    this.publishedAt = new Date()
    this.updatedAt = new Date()
  }

  draft(): void {
    this.status = ArticleStatus.DRAFT
    this.publishedAt = undefined
    this.updatedAt = new Date()
  }

  archive(): void {
    this.status = ArticleStatus.ARCHIVED
    this.updatedAt = new Date()
  }

  isPublished(): boolean {
    return this.status === ArticleStatus.PUBLISHED
  }

  isDraft(): boolean {
    return this.status === ArticleStatus.DRAFT
  }

  isArchived(): boolean {
    return this.status === ArticleStatus.ARCHIVED
  }
}