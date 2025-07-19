import { Promo, PromoStatus } from '../../../core/domain/entities/Promo'
import { EntityId } from '../../../core/domain/value-objects/EntityId'

export interface PromoRow {
  id: string
  title: string
  description: string
  image_url?: string
  start_date?: string
  end_date?: string
  status: string
  created_at: string
  updated_at: string
}

export class PromoModel {
  static toDomain(row: PromoRow): Promo {
    return new Promo(
      new EntityId(row.id),
      row.title,
      row.description,
      row.status as PromoStatus,
      row.image_url,
      row.start_date ? new Date(row.start_date) : undefined,
      row.end_date ? new Date(row.end_date) : undefined,
      new Date(row.created_at),
      new Date(row.updated_at)
    )
  }

  static fromDomain(promo: Promo): Omit<PromoRow, 'created_at' | 'updated_at'> {
    return {
      id: promo.getId().getValue(),
      title: promo.getTitle(),
      description: promo.getDescription(),
      image_url: promo.getImageUrl(),
      start_date: promo.getStartDate()?.toISOString(),
      end_date: promo.getEndDate()?.toISOString(),
      status: promo.getStatus()
    }
  }
}