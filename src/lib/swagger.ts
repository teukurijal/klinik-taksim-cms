import swaggerJSDoc from 'swagger-jsdoc'

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Klinik Taksim CMS API',
      version: '1.0.0',
      description: 'Public API for Klinik Taksim CMS - Access doctors and other public data',
      contact: {
        name: 'API Support',
        email: 'support@klinik-taksim.com'
      }
    },
    servers: [
      {
        url: '/api',
        description: 'API Base URL'
      }
    ],
    tags: [
      {
        name: 'Doctors',
        description: 'Operations related to doctors'
      },
      {
        name: 'Partners',
        description: 'Operations related to clinic partners'
      }
    ]
  },
  apis: [
    './src/app/api/public/**/*.ts',
    './src/app/api/public/**/*.js'
  ]
}

export const swaggerSpec = swaggerJSDoc(options)