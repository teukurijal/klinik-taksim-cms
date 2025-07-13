# Database Seeders - Klinik Taksim CMS

This document outlines all available database seeders for the Klinik Taksim CMS project.

## Overview

The project includes comprehensive seeders for all database tables to help you quickly populate your database with realistic sample data for development and testing purposes.

## Tables Covered

1. **Doctors** - Medical professionals with schedules and specializations
2. **Promos** - Marketing promotions and health campaigns  
3. **Facility Photos** - Images and descriptions of clinic facilities
4. **Testimonials** - Patient reviews and feedback
5. **FAQs** - Frequently asked questions and answers
6. **Partners** - Insurance partners and affiliated organizations
7. **Clinic Settings** - Basic clinic configuration (already has default data)

## Usage Methods

### Method 1: SQL Direct Seeding

Run the comprehensive SQL seeder directly in your database:

```sql
-- Run all seeders at once
\i all-tables-seeder.sql

-- Or run individual table seeder
\i doctors-seeder.sql
```

### Method 2: API Endpoints

Use the API endpoints to seed data programmatically:

#### Individual Table Seeders
```bash
# Seed doctors
POST /api/seed/doctors

# Seed promos  
POST /api/seed/promos

# Seed facility photos
POST /api/seed/facilities

# Seed testimonials
POST /api/seed/testimonials

# Seed FAQs
POST /api/seed/faqs

# Seed partners
POST /api/seed/partners
```

#### Master Seeder (All Tables)
```bash
# Seed all tables at once
POST /api/seed/all
```

### Method 3: Frontend/Dashboard Integration

You can create admin buttons in your dashboard to trigger seeders:

```javascript
// Example implementation
const seedAllData = async () => {
  const response = await fetch('/api/seed/all', {
    method: 'POST',
    credentials: 'include'
  })
  const result = await response.json()
  console.log('Seeding results:', result)
}
```

## Sample Data Included

### Doctors (10 records)
- **Cardiologist**: Dr. Ahmad Prasetyo, Sp.JP
- **Gynecologist**: Dr. Sari Wijayanti, Sp.OG  
- **Pediatrician**: Dr. Budi Santoso, Sp.A
- **Ophthalmologist**: Dr. Maya Kusuma, Sp.M
- **Orthopedic Surgeon**: Dr. Rizki Permana, Sp.OT
- **Dermatologist**: Dr. Indira Sari, Sp.KK
- **Urologist**: Dr. Faisal Rahman, Sp.U
- **Neurologist**: Dr. Dewi Hartono, Sp.S
- **Internal Medicine**: Dr. Andi Surya, Sp.PD
- **ENT Specialist**: Dr. Ratna Melati, Sp.THT-KL

Each doctor includes:
- Complete professional information
- Realistic weekly schedules 
- Indonesian medical credentials (STR/SIP numbers)
- Contact information and specializations

### Promos (5 records)
- Free health checkups
- COVID-19 vaccination campaigns
- Dental care for children
- Healthy diet programs
- Cancer screening initiatives

### Facility Photos (8 records)
- Reception area
- Waiting rooms
- Emergency room
- Operating theater
- Laboratory
- Pharmacy
- Radiology unit
- ICU

### Testimonials (8 records)
- Diverse patient categories
- Realistic Indonesian patient names
- Authentic healthcare feedback
- Various medical specialties covered

### FAQs (10 records)
- Operating hours
- BPJS acceptance
- Appointment booking
- Available services
- Payment policies
- Parking information

### Partners (10 records)
- BPJS Kesehatan
- Major insurance companies (Allianz, AXA, Prudential)
- Healthcare networks
- Pharmaceutical companies

## Features

### Duplicate Prevention
All seeders include built-in duplicate checking:
- Won't seed if data already exists
- Provides informative messages about existing data
- Safe to run multiple times

### Realistic Indonesian Context
- Indonesian doctor names and specializations
- Local medical credentials format
- BPJS and Indonesian insurance integration
- Indonesian healthcare terminology

### Comprehensive Schedules
Doctor schedules include:
- Specialty-specific working hours
- Realistic break patterns
- Weekend and emergency coverage
- Variable scheduling based on medical practice

### Error Handling
- Comprehensive error reporting
- Transaction safety
- Detailed logging
- Graceful failure handling

## Environment Requirements

Ensure these environment variables are set:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=your_app_url (for master seeder)
```

## File Structure

```
/
├── all-tables-seeder.sql              # Complete SQL seeder
├── doctors-seeder.sql                 # Doctors only SQL seeder  
├── src/app/api/seed/
│   ├── all/route.ts                   # Master API seeder
│   ├── doctors/route.ts               # Doctors API seeder
│   ├── promos/route.ts                # Promos API seeder
│   ├── facilities/route.ts            # Facilities API seeder
│   ├── testimonials/route.ts          # Testimonials API seeder
│   ├── faqs/route.ts                  # FAQs API seeder
│   └── partners/route.ts              # Partners API seeder
└── SEEDERS_README.md                  # This documentation
```

## Best Practices

1. **Development Environment**: Run seeders in development first
2. **Backup**: Always backup your database before seeding production
3. **Order**: Use the master seeder to ensure proper seeding order
4. **Verification**: Check seeded data through your admin dashboard
5. **Cleanup**: Have a plan to remove test data if needed

## Troubleshooting

### Common Issues

1. **Authentication Errors**: Ensure service role key is correct
2. **Duplicate Key Errors**: Seeders handle this gracefully  
3. **Network Timeouts**: Run individual seeders for large datasets
4. **Permission Issues**: Verify RLS policies allow seeding

### Logs and Debugging

Check the console/server logs for detailed error information when seeders fail.

## Contributing

When adding new seeders:
1. Follow the existing pattern
2. Include duplicate prevention
3. Use realistic, localized data
4. Add proper error handling
5. Update this documentation

---

**Generated for Klinik Taksim CMS**  
*Complete healthcare management system with comprehensive sample data*