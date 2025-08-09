-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret-here';

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('clinic-images', 'clinic-images', true);

-- Create doctors table
CREATE TABLE doctors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  photo_url TEXT,
  specialist VARCHAR(255) NOT NULL,
  education TEXT,
  experience TEXT,
  schedule JSONB,
  str_number VARCHAR(100),
  sip_number VARCHAR(100),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  phone_number VARCHAR(20),
  email VARCHAR(255),
  gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
  years_of_practice INTEGER,
  clinic_room VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create promos table
CREATE TABLE promos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  start_date DATE,
  end_date DATE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create facility_photos table
CREATE TABLE facility_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  title VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create testimonials table
CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  photo_url TEXT,
  testimonial_text TEXT NOT NULL,
  patient_category VARCHAR(100),
  rate INTEGER DEFAULT 5 CHECK (rate >= 1 AND rate <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create faqs table
CREATE TABLE faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create partners table
CREATE TABLE partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255),
  image_url TEXT NOT NULL,
  link VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create polyclinics table
CREATE TABLE polyclinics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  head VARCHAR(255) NOT NULL,
  location VARCHAR(500),
  phone_number VARCHAR(20),
  email VARCHAR(255),
  working_hours JSONB,
  capacity INTEGER,
  services TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- Create articles table
CREATE TABLE articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  slug VARCHAR(500) UNIQUE,
  excerpt TEXT,
  image_url TEXT,
  author VARCHAR(255),
  tags TEXT[],
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clinic_settings table
CREATE TABLE clinic_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinic_name VARCHAR(255) DEFAULT 'Klinik Taksim Medika',
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  maintenance_mode BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default clinic settings
INSERT INTO clinic_settings (clinic_name, address, phone, email) 
VALUES ('Klinik Taksim Medika', 'Jl. Taksim No. 123, Jakarta', '+62-21-1234567', 'info@taksimmedika.com');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON doctors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_promos_updated_at BEFORE UPDATE ON promos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_facility_photos_updated_at BEFORE UPDATE ON facility_photos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON faqs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON partners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_polyclinics_updated_at BEFORE UPDATE ON polyclinics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clinic_settings_updated_at BEFORE UPDATE ON clinic_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security on all tables
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE promos ENABLE ROW LEVEL SECURITY;
ALTER TABLE facility_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE polyclinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access only
CREATE POLICY "Admin access" ON doctors FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin access" ON promos FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin access" ON facility_photos FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin access" ON testimonials FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin access" ON faqs FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin access" ON partners FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin access" ON polyclinics FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin access" ON articles FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin access" ON clinic_settings FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Create public read policies for website display
CREATE POLICY "Public read doctors" ON doctors FOR SELECT USING (status = 'active');
CREATE POLICY "Public read promos" ON promos FOR SELECT USING (status = 'active');
CREATE POLICY "Public read facility_photos" ON facility_photos FOR SELECT USING (true);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public read faqs" ON faqs FOR SELECT USING (true);
CREATE POLICY "Public read partners" ON partners FOR SELECT USING (true);
CREATE POLICY "Public read polyclinics" ON polyclinics FOR SELECT USING (status = 'active');
CREATE POLICY "Public read articles" ON articles FOR SELECT USING (status = 'published');
CREATE POLICY "Public read clinic_settings" ON clinic_settings FOR SELECT USING (true);

-- Storage policies
CREATE POLICY "Admin can upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'clinic-images' AND auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin can update images" ON storage.objects FOR UPDATE USING (bucket_id = 'clinic-images' AND auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin can delete images" ON storage.objects FOR DELETE USING (bucket_id = 'clinic-images' AND auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Public can view images" ON storage.objects FOR SELECT USING (bucket_id = 'clinic-images');