import { DoctorRepository } from '../../core/domain/repositories/DoctorRepository'
import { PromoRepository } from '../../core/domain/repositories/PromoRepository'

import { SupabaseDoctorRepository } from '../../infrastructure/database/repositories/SupabaseDoctorRepository'
import { SupabasePromoRepository } from '../../infrastructure/database/repositories/SupabasePromoRepository'

import { DoctorController } from '../../interface-adapters/controllers/DoctorController'
import { PromoController } from '../../interface-adapters/controllers/PromoController'

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
  }

  private setupControllers(): void {
    this.controllers.set('DoctorController', new DoctorController(
      this.repositories.get('DoctorRepository') as DoctorRepository
    ))
    this.controllers.set('PromoController', new PromoController(
      this.repositories.get('PromoRepository') as PromoRepository
    ))
  }

  getDoctorRepository(): DoctorRepository {
    return this.repositories.get('DoctorRepository') as DoctorRepository
  }

  getPromoRepository(): PromoRepository {
    return this.repositories.get('PromoRepository') as PromoRepository
  }

  getDoctorController(): DoctorController {
    return this.controllers.get('DoctorController') as DoctorController
  }

  getPromoController(): PromoController {
    return this.controllers.get('PromoController') as PromoController
  }
}