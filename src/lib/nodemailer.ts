import nodemailer from 'nodemailer'

if (!process.env.EMAIL_SERVER_HOST || !process.env.EMAIL_SERVER_PORT || !process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD) {
  throw new Error('Missing email configuration environment variables')
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD
  }
})

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
  from = process.env.EMAIL_FROM || 'noreply@weewantmore.ng',
  replyTo
}: SendEmailParams) => {
  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
      replyTo
    })

    console.log('Message sent: %s', info.messageId)
    return { success: true, data: info }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}

// Verify connection configuration
export const verifyEmailConfig = async () => {
  try {
    const verification = await transporter.verify()
    console.log('Server is ready to take our messages')
    return verification
  } catch (error) {
    console.error('Error verifying email configuration:', error)
    return false
  }
} 
