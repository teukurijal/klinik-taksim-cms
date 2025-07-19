import { DoctorRepository } from '../../core/domain/repositories/DoctorRepository'
import { PromoRepository } from '../../core/domain/repositories/PromoRepository'
import { FacilityPhotoRepository } from '../../core/domain/repositories/FacilityPhotoRepository'
import { TestimonialRepository } from '../../core/domain/repositories/TestimonialRepository'
import { FAQRepository } from '../../core/domain/repositories/FAQRepository'

import { SupabaseDoctorRepository } from '../../infrastructure/database/repositories/SupabaseDoctorRepository'
import { SupabasePromoRepository } from '../../infrastructure/database/repositories/SupabasePromoRepository'
import { SupabaseFacilityPhotoRepository } from '../../infrastructure/database/repositories/SupabaseFacilityPhotoRepository'
import { SupabaseTestimonialRepository } from '../../infrastructure/database/repositories/SupabaseTestimonialRepository'
import { SupabaseFAQRepository } from '../../infrastructure/database/repositories/SupabaseFAQRepository'

import { DoctorController } from '../../interface-adapters/controllers/DoctorController'
import { PromoController } from '../../interface-adapters/controllers/PromoController'
import { FacilityPhotoController } from '../../interface-adapters/controllers/FacilityPhotoController'
import { TestimonialController } from '../../interface-adapters/controllers/TestimonialController'
import { FAQController } from '../../interface-adapters/controllers/FAQController'

export class Container {
  private static instance: Container
  private repositories: Map<string, unknown> = new Map()
  private controllers: Map<string, unknown> = new Map()

  private constructor() {
    this.setupRepositories()
    this.setupControllers()
  }

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container()
    }
    return Container.instance
  }

  private setupRepositories(): void {
    this.repositories.set('DoctorRepository', new SupabaseDoctorRepository())
    this.repositories.set('PromoRepository', new SupabasePromoRepository())
    this.repositories.set('FacilityPhotoRepository', new SupabaseFacilityPhotoRepository())
    this.repositories.set('TestimonialRepository', new SupabaseTestimonialRepository())
    this.repositories.set('FAQRepository', new SupabaseFAQRepository())
  }

  private setupControllers(): void {
    this.controllers.set('DoctorController', new DoctorController(
      this.repositories.get('DoctorRepository') as DoctorRepository
    ))
    this.controllers.set('PromoController', new PromoController(
      this.repositories.get('PromoRepository') as PromoRepository
    ))
    this.controllers.set('FacilityPhotoController', new FacilityPhotoController(
      this.repositories.get('FacilityPhotoRepository') as FacilityPhotoRepository
    ))
    this.controllers.set('TestimonialController', new TestimonialController(
      this.repositories.get('TestimonialRepository') as TestimonialRepository
    ))
    this.controllers.set('FAQController', new FAQController(
      this.repositories.get('FAQRepository') as FAQRepository
    ))
  }

  getDoctorRepository(): DoctorRepository {
    return this.repositories.get('DoctorRepository') as DoctorRepository
  }

  getPromoRepository(): PromoRepository {
    return this.repositories.get('PromoRepository') as PromoRepository
  }

  getFacilityPhotoRepository(): FacilityPhotoRepository {
    return this.repositories.get('FacilityPhotoRepository') as FacilityPhotoRepository
  }

  getTestimonialRepository(): TestimonialRepository {
    return this.repositories.get('TestimonialRepository') as TestimonialRepository
  }

  getFAQRepository(): FAQRepository {
    return this.repositories.get('FAQRepository') as FAQRepository
  }

  getDoctorController(): DoctorController {
    return this.controllers.get('DoctorController') as DoctorController
  }

  getPromoController(): PromoController {
    return this.controllers.get('PromoController') as PromoController
  }

  getFacilityPhotoController(): FacilityPhotoController {
    return this.controllers.get('FacilityPhotoController') as FacilityPhotoController
  }

  getTestimonialController(): TestimonialController {
    return this.controllers.get('TestimonialController') as TestimonialController
  }

  getFAQController(): FAQController {
    return this.controllers.get('FAQController') as FAQController
  }
}