import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const sampleArticles = [
  {
    title: 'Understanding Heart Health: A Complete Guide',
    content: `Heart health is crucial for overall wellbeing. Regular check-ups, proper diet, and exercise are fundamental to maintaining a healthy cardiovascular system.

## Key Points:
- Regular exercise (30 minutes daily)
- Balanced diet rich in fruits and vegetables
- Avoid smoking and excessive alcohol
- Regular health screenings
- Stress management

At Klinik Taksim Medika, our experienced cardiologists provide comprehensive heart health services to ensure your cardiovascular system remains strong and healthy.`,
    status: 'published',
    slug: 'understanding-heart-health-complete-guide',
    excerpt: 'A comprehensive guide to maintaining optimal heart health through lifestyle choices and regular medical care.',
    author: 'Dr. Sarah Johnson',
    tags: ['heart health', 'cardiology', 'prevention', 'lifestyle'],
    published_at: new Date().toISOString()
  },
  {
    title: 'Preventive Care: Your First Line of Defense',
    content: `Preventive healthcare is the foundation of a healthy life. Regular screenings and check-ups can help detect health issues before they become serious problems.

## Benefits of Preventive Care:
- Early detection of health issues
- Lower healthcare costs
- Better treatment outcomes
- Improved quality of life

Our preventive care services include annual physical exams, vaccinations, health screenings, and personalized health assessments.`,
    status: 'published',
    slug: 'preventive-care-first-line-defense',
    excerpt: 'Learn how preventive healthcare can help you maintain optimal health and detect issues early.',
    author: 'Dr. Michael Chen',
    tags: ['prevention', 'health screening', 'wellness', 'check-up'],
    published_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
  },
  {
    title: 'Mental Health Awareness in Modern Healthcare',
    content: `Mental health is an integral part of overall health. Understanding the importance of mental wellbeing and seeking appropriate care when needed is crucial for a balanced life.

## Signs to Watch For:
- Persistent sadness or anxiety
- Changes in sleep patterns
- Loss of interest in activities
- Difficulty concentrating
- Social withdrawal

Our mental health professionals provide compassionate care and evidence-based treatments to support your mental wellbeing.`,
    status: 'draft',
    slug: 'mental-health-awareness-modern-healthcare',
    excerpt: 'Exploring the importance of mental health awareness and available treatment options.',
    author: 'Dr. Emily Rodriguez',
    tags: ['mental health', 'psychology', 'wellness', 'awareness']
  },
  {
    title: 'Nutrition and Wellness: Building Healthy Habits',
    content: `Proper nutrition is the cornerstone of good health. Understanding how to make informed food choices can significantly impact your overall wellbeing and energy levels.

## Nutrition Fundamentals:
- Balanced macronutrients (proteins, carbs, fats)
- Adequate hydration
- Portion control
- Regular meal timing
- Limiting processed foods

Our nutrition specialists work with you to develop personalized meal plans that fit your lifestyle and health goals.`,
    status: 'published',
    slug: 'nutrition-wellness-building-healthy-habits',
    excerpt: 'Discover the fundamentals of nutrition and how to build sustainable healthy eating habits.',
    author: 'Dr. James Wilson',
    tags: ['nutrition', 'diet', 'wellness', 'healthy eating'],
    published_at: new Date(Date.now() - 172800000).toISOString() // 2 days ago
  }
]

export async function POST() {
  try {
    // Clear existing articles (optional - for development)
    await supabase.from('articles').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    // Insert sample articles
    const { data, error } = await supabase
      .from('articles')
      .insert(sampleArticles)
      .select()

    if (error) {
      console.error('Seeder error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Articles seeded successfully',
      count: data?.length || 0,
      articles: data 
    })
  } catch (error) {
    console.error('Seeder error:', error)
    return NextResponse.json(
      { error: 'Failed to seed articles' },
      { status: 500 }
    )
  }
}