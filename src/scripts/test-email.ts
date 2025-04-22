import { config } from 'dotenv'
import { resolve } from 'path'
import { Resend } from 'resend'
import { generatePetitionEmailTemplate } from '../services/email'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is required')
}

const resend = new Resend(process.env.RESEND_API_KEY)

async function testEmailSending() {
  // Use real organization data for testing
  const testData = {
    petitionerName: "Test User",
    petitionerEmail: "goodnessobaje@gmail.com",
    organizationName: "CBN (Central Bank of Nigeria)",
    organizationId: "f3c5ef0b-4dab-4aa4-b8a0-212aaef764ca",
    organizationEmail: "contactcbn@cbn.gov.ng"
  }

  try {
    console.log('Sending test email...')
    
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'WeeWantMore <noreply@weewantmore.ng>',
      to: testData.organizationEmail,
      subject: `Dear ${testData.organizationName}, Fund Nigerian Women's Economic Ambitions`,
      html: generatePetitionEmailTemplate(testData),
      replyTo: testData.petitionerEmail
    })

    console.log('Email sent successfully:', result)
  } catch (error) {
    console.error('Failed to send email:', error)
  }
}

// Run the test
testEmailSending() 