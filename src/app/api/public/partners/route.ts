import { NextResponse } from 'next/server'
import { Container } from '../../../../shared/di/Container'

const container = Container.getInstance()
const partnerController = container.getPartnerController()

/**
 * @swagger
 * /api/public/partners:
 *   get:
 *     tags:
 *       - Partners
 *     summary: Get all partners
 *     description: Retrieve a list of all clinic partners and their information. This is a public endpoint that doesn't require authentication.
 *     responses:
 *       200:
 *         description: Successfully retrieved partners
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Unique identifier for the partner
 *                       image_url:
 *                         type: string
 *                         description: URL to the partner's logo/image
 *                       name:
 *                         type: string
 *                         description: Name of the partner organization
 *                       link:
 *                         type: string
 *                         description: Website URL of the partner
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         description: Record creation timestamp
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         description: Last update timestamp
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request failed
 */
export async function GET() {
  try {
    return await partnerController.getAll()
  } catch (error) {
    console.error('Error in public partners API:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        success: false 
      },
      { status: 500 }
    )
  }
}