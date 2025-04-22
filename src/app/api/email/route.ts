import { NextResponse } from 'next/server'
import { sendPetitionEmailToBank, sendConfirmationEmail } from '@/services/email'
import { verifyEmailConfig } from '@/lib/nodemailer'

// Verify email configuration
verifyEmailConfig()
  .then(isVerified => {
    if (!isVerified) {
      console.error('Email configuration verification failed')
    }
  })
  .catch(error => {
    console.error('Error verifying email configuration:', error)
  })

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { petitionerName, petitionerEmail, bankName, bankCode } = body

    // Validate required fields
    if (!petitionerName || !petitionerEmail || !bankName || !bankCode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Send emails
    const [bankEmailResult, confirmationEmailResult] = await Promise.allSettled([
      sendPetitionEmailToBank({
        petitionerName,
        petitionerEmail,
        bankName,
        bankCode
      }),
      sendConfirmationEmail({
        petitionerName,
        petitionerEmail,
        bankName,
        bankCode
      })
    ])

    return NextResponse.json({
      success: true,
      bankEmailSent: bankEmailResult.status === 'fulfilled' && bankEmailResult.value,
      confirmationEmailSent: confirmationEmailResult.status === 'fulfilled' && confirmationEmailResult.value
    })
  } catch (error) {
    console.error('Error in email API route:', error)
    return NextResponse.json(
      { error: 'Failed to process email request' },
      { status: 500 }
    )
  }
}