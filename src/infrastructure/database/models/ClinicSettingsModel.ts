export interface ClinicSettingsModel {
  id: string
  clinic_name: string
  address?: string
  phone?: string
  email?: string
  maintenance_mode: boolean
  created_at: string
  updated_at: string
}