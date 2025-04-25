import { config } from 'dotenv'
import { resolve } from 'path'
import { Resend } from 'resend'
import { generatePetitionEmailTemplate, generateConfirmationEmailTemplate } from '../services/email'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

if (!process.env.RESEND_DEMAND_API_KEY || !process.env.RESEND_CONFIRMATION_API_KEY) {
  throw new Error('Both RESEND_DEMAND_API_KEY and RESEND_CONFIRMATION_API_KEY are required')
}

const resendDemand = new Resend(process.env.RESEND_DEMAND_API_KEY)
const resendConfirmation = new Resend(process.env.RESEND_CONFIRMATION_API_KEY)

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
    console.log('Sending test demand email...')
    const demandResult = await resendDemand.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'WeeWantMore <noreply@weewantmore.ng>',
      to: testData.organizationEmail,
      subject: `Dear ${testData.organizationName}, Fund Nigerian Women's Economic Ambitions`,
      html: generatePetitionEmailTemplate(testData),
      replyTo: testData.petitionerEmail
    })
    console.log('Demand email sent successfully:', demandResult)

    console.log('\nSending test confirmation email...')
    const confirmationResult = await resendConfirmation.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'WeeWantMore <noreply@weewantmore.ng>',
      to: testData.petitionerEmail,
      subject: 'Thank you for your petition',
      html: generateConfirmationEmailTemplate(testData),
      replyTo: process.env.RESEND_REPLY_TO_EMAIL
    })
    console.log('Confirmation email sent successfully:', confirmationResult)

  } catch (error) {
    console.error('Failed to send email:', error)
  }
}

// Run the test
testEmailSending() 