import { DoctorRepository } from '../../core/domain/repositories/DoctorRepository'
import { PromoRepository } from '../../core/domain/repositories/PromoRepository'
import { FacilityPhotoRepository } from '../../core/domain/repositories/FacilityPhotoRepository'
import { TestimonialRepository } from '../../core/domain/repositories/TestimonialRepository'
import { FAQRepository } from '../../core/domain/repositories/FAQRepository'
import { ClinicSettingsRepository } from '../../core/domain/repositories/ClinicSettingsRepository'
import { ArticleRepository } from '../../core/domain/repositories/ArticleRepository'
import { PolyClinicRepository } from '../../core/domain/repositories/PolyClinicRepository'
import { PartnerRepository } from '../../core/domain/repositories/PartnerRepository'

import { SupabaseDoctorRepository } from '../../infrastructure/database/repositories/SupabaseDoctorRepository'
import { SupabasePromoRepository } from '../../infrastructure/database/repositories/SupabasePromoRepository'
import { SupabaseFacilityPhotoRepository } from '../../infrastructure/database/repositories/SupabaseFacilityPhotoRepository'
import { SupabaseTestimonialRepository } from '../../infrastructure/database/repositories/SupabaseTestimonialRepository'
import { SupabaseFAQRepository } from '../../infrastructure/database/repositories/SupabaseFAQRepository'
import { SupabaseClinicSettingsRepository } from '../../infrastructure/database/repositories/SupabaseClinicSettingsRepository'
import { SupabaseArticleRepository } from '../../infrastructure/database/repositories/SupabaseArticleRepository'
import { SupabasePolyClinicRepository } from '../../infrastructure/database/repositories/SupabasePolyClinicRepository'
import { SupabasePartnerRepository } from '../../infrastructure/database/repositories/SupabasePartnerRepository'

import { DoctorController } from '../../interface-adapters/controllers/DoctorController'
import { PromoController } from '../../interface-adapters/controllers/PromoController'
import { FacilityPhotoController } from '../../interface-adapters/controllers/FacilityPhotoController'
import { TestimonialController } from '../../interface-adapters/controllers/TestimonialController'
import { FAQController } from '../../interface-adapters/controllers/FAQController'
import { ClinicSettingsController } from '../../interface-adapters/controllers/ClinicSettingsController'
import { ArticleController } from '../../interface-adapters/controllers/ArticleController'
import { PolyClinicController } from '../../interface-adapters/controllers/PolyClinicController'
import { PartnerController } from '../../interface-adapters/controllers/PartnerController'

import { CreatePolyClinicUseCase } from '../../core/application/use-cases/polyclinic/CreatePolyClinicUseCase'
import { GetPolyClinicUseCase } from '../../core/application/use-cases/polyclinic/GetPolyClinicUseCase'
import { GetAllPolyClinicsUseCase } from '../../core/application/use-cases/polyclinic/GetAllPolyClinicsUseCase'
import { UpdatePolyClinicUseCase } from '../../core/application/use-cases/polyclinic/UpdatePolyClinicUseCase'
import { DeletePolyClinicUseCase } from '../../core/application/use-cases/polyclinic/DeletePolyClinicUseCase'

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
    this.repositories.set('ClinicSettingsRepository', new SupabaseClinicSettingsRepository())
    this.repositories.set('ArticleRepository', new SupabaseArticleRepository())
    this.repositories.set('PolyClinicRepository', new SupabasePolyClinicRepository())
    this.repositories.set('PartnerRepository', new SupabasePartnerRepository())
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
    this.controllers.set('ClinicSettingsController', new ClinicSettingsController(
      this.repositories.get('ClinicSettingsRepository') as ClinicSettingsRepository
    ))
    
    this.controllers.set('ArticleController', new ArticleController(
      this.repositories.get('ArticleRepository') as ArticleRepository
    ))
    
    const polyClinicRepository = this.repositories.get('PolyClinicRepository') as PolyClinicRepository
    this.controllers.set('PolyClinicController', new PolyClinicController(
      new CreatePolyClinicUseCase(polyClinicRepository),
      new GetPolyClinicUseCase(polyClinicRepository),
      new GetAllPolyClinicsUseCase(polyClinicRepository),
      new UpdatePolyClinicUseCase(polyClinicRepository),
      new DeletePolyClinicUseCase(polyClinicRepository)
    ))
    
    this.controllers.set('PartnerController', new PartnerController(
      this.repositories.get('PartnerRepository') as PartnerRepository
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

  getClinicSettingsRepository(): ClinicSettingsRepository {
    return this.repositories.get('ClinicSettingsRepository') as ClinicSettingsRepository
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

  getClinicSettingsController(): ClinicSettingsController {
    return this.controllers.get('ClinicSettingsController') as ClinicSettingsController
  }

  getArticleRepository(): ArticleRepository {
    return this.repositories.get('ArticleRepository') as ArticleRepository
  }

  getArticleController(): ArticleController {
    return this.controllers.get('ArticleController') as ArticleController
  }

  getPolyClinicRepository(): PolyClinicRepository {
    return this.repositories.get('PolyClinicRepository') as PolyClinicRepository
  }

  getPolyClinicController(): PolyClinicController {
    return this.controllers.get('PolyClinicController') as PolyClinicController
  }

  getPartnerRepository(): PartnerRepository {
    return this.repositories.get('PartnerRepository') as PartnerRepository
  }

  getPartnerController(): PartnerController {
    return this.controllers.get('PartnerController') as PartnerController
  }
}