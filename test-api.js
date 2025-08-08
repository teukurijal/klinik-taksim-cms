// Simple test script to verify the API endpoints work
const testAPI = async () => {
  try {
    console.log('Testing API endpoints...\n')
    
    // Test swagger documentation endpoint
    console.log('1. Testing Swagger documentation endpoint...')
    const swaggerResponse = await fetch('http://localhost:3000/api/swagger')
    if (swaggerResponse.ok) {
      const swaggerData = await swaggerResponse.json()
      console.log('✅ Swagger endpoint working')
      console.log('   OpenAPI version:', swaggerData.openapi)
      console.log('   Title:', swaggerData.info.title)
    } else {
      console.log('❌ Swagger endpoint failed')
    }
    
    console.log('\n2. Testing Public Doctors API endpoint...')
    // Test public doctors endpoint  
    const doctorsResponse = await fetch('http://localhost:3000/api/public/doctors')
    if (doctorsResponse.ok) {
      const doctorsData = await doctorsResponse.json()
      console.log('✅ Public doctors endpoint working')
      console.log('   Response type:', Array.isArray(doctorsData) ? 'Array' : typeof doctorsData)
      if (Array.isArray(doctorsData)) {
        console.log('   Number of doctors:', doctorsData.length)
      }
    } else {
      console.log('❌ Public doctors endpoint failed')
      console.log('   Status:', doctorsResponse.status)
    }
    
    console.log('\n3. Testing Public Doctors API with active filter...')
    // Test public doctors endpoint with active filter
    const activeDoctorsResponse = await fetch('http://localhost:3000/api/public/doctors?status=active')
    if (activeDoctorsResponse.ok) {
      const activeDoctorsData = await activeDoctorsResponse.json()
      console.log('✅ Public doctors (active only) endpoint working')
      console.log('   Response type:', Array.isArray(activeDoctorsData) ? 'Array' : typeof activeDoctorsData)
      if (Array.isArray(activeDoctorsData)) {
        console.log('   Number of active doctors:', activeDoctorsData.length)
      }
    } else {
      console.log('❌ Public doctors (active only) endpoint failed')
      console.log('   Status:', activeDoctorsResponse.status)
    }
    
  } catch (error) {
    console.error('Error testing API:', error.message)
  }
}

// Check if we can import fetch
if (typeof fetch === 'undefined') {
  console.log('Note: Run this test with Node.js 18+ or start the dev server and test manually')
  console.log('Manual test URLs:')
  console.log('- Swagger JSON: http://localhost:3000/api/swagger')
  console.log('- Public Doctors: http://localhost:3000/api/public/doctors')
  console.log('- Active Doctors: http://localhost:3000/api/public/doctors?status=active')
  console.log('- Documentation Page: http://localhost:3000/docs')
} else {
  testAPI()
}