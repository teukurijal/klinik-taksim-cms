import { createClient } from '@supabase/supabase-js'
import { Article } from '../../../core/domain/entities/Article'
import { ArticleRepository } from '../../../core/domain/repositories/ArticleRepository'
import { EntityId } from '../../../core/domain/value-objects/EntityId'
import { ArticleModel, ArticleRow } from '../models/ArticleModel'

export class SupabaseArticleRepository implements ArticleRepository {
  private supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async findById(id: EntityId): Promise<Article | null> {
    const { data, error } = await this.supabase
      .from('articles')
      .select('*')
      .eq('id', id.getValue())
      .single()

    if (error || !data) return null

    return ArticleModel.toDomain(data as ArticleRow)
  }

  async findAll(): Promise<Article[]> {
    const { data, error } = await this.supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error || !data) return []

    return data.map((row: ArticleRow) => ArticleModel.toDomain(row))
  }

  async findByStatus(status: string): Promise<Article[]> {
    const { data, error } = await this.supabase
      .from('articles')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error || !data) return []

    return data.map((row: ArticleRow) => ArticleModel.toDomain(row))
  }

  async findBySlug(slug: string): Promise<Article | null> {
    const { data, error } = await this.supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !data) return null

    return ArticleModel.toDomain(data as ArticleRow)
  }

  async save(article: Article): Promise<void> {
    const articleData = ArticleModel.fromDomain(article)
    
    const { error } = await this.supabase
      .from('articles')
      .upsert(articleData)

    if (error) {
      throw new Error(`Failed to save article: ${error.message}`)
    }
  }

  async delete(id: EntityId): Promise<void> {
    const { error } = await this.supabase
      .from('articles')
      .delete()
      .eq('id', id.getValue())

    if (error) {
      throw new Error(`Failed to delete article: ${error.message}`)
    }
  }
}