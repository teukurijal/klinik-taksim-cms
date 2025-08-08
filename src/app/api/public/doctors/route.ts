import { NextRequest, NextResponse } from 'next/server'
import { Container } from '../../../../shared/di/Container'

const container = Container.getInstance()
const doctorController = container.getDoctorController()

/**
 * @swagger
 * /api/public/doctors:
 *   get:
 *     tags:
 *       - Doctors
 *     summary: Get all doctors
 *     description: Retrieve a list of all doctors. Use the status parameter to filter by active doctors only.
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active]
 *         description: Filter doctors by status. Use 'active' to get only active doctors.
 *     responses:
 *       200:
 *         description: Successfully retrieved doctors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Unique identifier for the doctor
 *                   fullName:
 *                     type: string
 *                     description: Full name of the doctor
 *                   specialist:
 *                     type: string
 *                     description: Medical specialization
 *                   status:
 *                     type: string
 *                     enum: [active, inactive]
 *                     description: Current status of the doctor
 *                   photoUrl:
 *                     type: string
 *                     description: URL to the doctor's photo
 *                   education:
 *                     type: string
 *                     description: Educational background
 *                   experience:
 *                     type: string
 *                     description: Work experience details
 *                   schedule:
 *                     type: object
 *                     description: Weekly schedule
 *                   strNumber:
 *                     type: string
 *                     description: STR (Surat Tanda Registrasi) number
 *                   sipNumber:
 *                     type: string
 *                     description: SIP (Surat Izin Praktik) number
 *                   phoneNumber:
 *                     type: string
 *                     description: Contact phone number
 *                   email:
 *                     type: string
 *                     description: Contact email address
 *                   gender:
 *                     type: string
 *                     enum: [male, female]
 *                     description: Gender of the doctor
 *                   yearsOfPractice:
 *                     type: number
 *                     description: Number of years in practice
 *                   clinicRoom:
 *                     type: string
 *                     description: Assigned clinic room
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Record creation timestamp
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: Last update timestamp
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
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const activeOnly = url.searchParams.get('status') === 'active'
    
    return await doctorController.getAll(activeOnly)
  } catch (error) {
    console.error('Error in public doctors API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}