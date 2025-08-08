# Klinik Taksim CMS - Public API Documentation

## Overview

This document describes the public API endpoints available for Klinik Taksim CMS. These endpoints provide access to public data without requiring authentication.

## Base URL

```
/api/public
```

## Documentation

- **Interactive Documentation**: Visit `/docs` for a complete Swagger UI interface
- **OpenAPI JSON**: Get the raw OpenAPI specification at `/api/swagger`

## Available Endpoints

### Doctors

#### Get All Doctors
```http
GET /api/public/doctors
```

Retrieve a list of all doctors in the system.

**Query Parameters:**
- `status` (optional): Filter by status
  - `active`: Return only active doctors

**Example Requests:**
```bash
# Get all doctors
curl http://localhost:3000/api/public/doctors

# Get only active doctors  
curl http://localhost:3000/api/public/doctors?status=active
```

**Response Format:**
```json
[
  {
    "id": "string",
    "fullName": "string",
    "specialist": "string", 
    "status": "active|inactive",
    "photoUrl": "string",
    "education": "string",
    "experience": "string",
    "schedule": {
      "monday": {
        "start": "09:00",
        "end": "17:00", 
        "available": true
      }
    },
    "strNumber": "string",
    "sipNumber": "string",
    "phoneNumber": "string",
    "email": "string",
    "gender": "male|female",
    "yearsOfPractice": 0,
    "clinicRoom": "string",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

## Error Responses

All endpoints may return the following error responses:

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Testing the API

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Visit the documentation page:
   ```
   http://localhost:3000/docs
   ```

3. Or test endpoints directly:
   ```bash
   # Test doctors endpoint
   curl http://localhost:3000/api/public/doctors
   
   # Test with filter
   curl http://localhost:3000/api/public/doctors?status=active
   
   # Get OpenAPI specification
   curl http://localhost:3000/api/swagger
   ```

## Development

### Adding New Public Endpoints

1. Create a new route file under `src/app/api/public/`
2. Add Swagger JSDoc comments for documentation
3. Update `src/lib/swagger.ts` if needed to include new API paths
4. Test the endpoint and documentation

### Swagger Documentation

The API documentation is automatically generated from JSDoc comments in the route files. Use the following format:

```javascript
/**
 * @swagger
 * /api/public/endpoint:
 *   get:
 *     tags:
 *       - TagName
 *     summary: Brief description
 *     description: Detailed description
 *     parameters:
 *       - in: query
 *         name: paramName
 *         schema:
 *           type: string
 *         description: Parameter description
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
```

## Security

- These are public endpoints and do not require authentication
- Rate limiting should be implemented for production use
- Sensitive data should not be exposed through these endpoints
- All inputs should be validated and sanitized

## Production Deployment

Before deploying to production:

1. Ensure all environment variables are properly configured
2. Test all endpoints thoroughly
3. Implement rate limiting and security headers
4. Monitor API usage and performance
5. Set up proper error logging and monitoring