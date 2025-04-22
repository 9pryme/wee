import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  console.warn('Missing RESEND_API_KEY environment variable')
}

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendEmailParams {
  to: string | string[]
  subject: string
  html: string
  from?: string
  replyTo?: string
}

export const sendEmail = async ({
  to,
  subject,
  html,
  from = process.env.RESEND_FROM_EMAIL || 'WeeWantMore <noreply@weewantmore.ng>',
  replyTo = process.env.RESEND_REPLY_TO_EMAIL
}: SendEmailParams) => {
  try {
    const result = await resend.emails.send({
      from,
      to,
      subject,
      html,
      replyTo
    })

    console.log('Message sent:', result)
    return { success: true, data: result }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}

// Verify connection configuration
export async function verifyEmailConfig(): Promise<boolean> {
  const requiredVars = [
    'RESEND_API_KEY',
    'RESEND_FROM_EMAIL',
    'RESEND_REPLY_TO_EMAIL'
  ]

  const missingVars = requiredVars.filter(varName => !process.env[varName])

  if (missingVars.length > 0) {
    console.warn('Missing email configuration variables:', missingVars)
    return false
  }

  return true
} 
