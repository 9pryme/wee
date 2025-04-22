import { NextResponse } from 'next/server'
import { sendPetitionEmailToOrganization, sendConfirmationEmail } from '@/services/email'
import { verifyEmailConfig } from '@/lib/nodemailer'

let emailConfigVerified = false

// Verify email configuration
verifyEmailConfig()
  .then(isVerified => {
    emailConfigVerified = isVerified
    if (!isVerified) {
      console.warn('Email configuration verification failed - emails will not be sent')
    }
  })
  .catch(error => {
    console.error('Error verifying email configuration:', error)
  })

export async function POST(request: Request) {
  if (!emailConfigVerified) {
    console.warn('Email configuration not verified - skipping email send')
    return NextResponse.json({
      success: true,
      orgEmailSent: false,
      confirmationEmailSent: false,
      warning: 'Email configuration not verified'
    })
  }

  try {
    const body = await request.json()
    const { petitionerName, petitionerEmail, organizationName, organizationId } = body

    // Validate required fields
    if (!petitionerName || !petitionerEmail || !organizationName || !organizationId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Send emails
    const [orgEmailResult, confirmationEmailResult] = await Promise.allSettled([
      sendPetitionEmailToOrganization({
        petitionerName,
        petitionerEmail,
        organizationName,
        organizationId,
        organizationEmail: body.organizationEmail
      }),
      sendConfirmationEmail({
        petitionerName,
        petitionerEmail,
        organizationName,
        organizationId,
        organizationEmail: body.organizationEmail
      })
    ])

    return NextResponse.json({
      success: true,
      orgEmailSent: orgEmailResult.status === 'fulfilled',
      confirmationEmailSent: confirmationEmailResult.status === 'fulfilled'
    })
  } catch (error) {
    console.error('Error in email API route:', error)
    return NextResponse.json(
      { error: 'Failed to process email request' },
      { status: 500 }
    )
  }
}