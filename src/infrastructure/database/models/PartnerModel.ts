import { Partner } from '../../../core/domain/entities/Partner'
import { EntityId } from '../../../core/domain/value-objects/EntityId'

export interface PartnerRow {
  id: string
  image_url: string
  name?: string
  link?: string
  created_at: string
  updated_at: string
}

export class PartnerModel {
  static toDomain(row: PartnerRow): Partner {
    return new Partner(
      new EntityId(row.id),
      row.image_url,
      row.name,
      row.link,
      new Date(row.created_at),
      new Date(row.updated_at)
    )
  }

  static fromDomain(partner: Partner): Omit<PartnerRow, 'id' | 'created_at' | 'updated_at'> {
    return {
      image_url: partner.getImageUrl(),
      name: partner.getName(),
      link: partner.getLink()
    }
  }
}