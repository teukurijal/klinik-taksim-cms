export interface TestimonialModel {
  id: string
  name: string
  photo_url?: string
  testimonial_text: string
  patient_category?: string
  rate: number
  created_at: string
  updated_at: string
}