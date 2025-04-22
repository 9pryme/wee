import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  throw new Error('Missing RESEND_API_KEY environment variable')
}

const resend = new Resend(process.env.RESEND_API_KEY)

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface PetitionEmailData {
  petitionerName: string
  petitionerEmail: string
  organizationName: string
  organizationId: string
  organizationEmail: string
}

interface EmailOptions {
  to: string
  subject: string
  html: string
  replyTo?: string
  includeUnsubscribe?: boolean
}

interface EmailResponse {
  success: boolean
  data?: {
    id?: string
  }
  error?: string
}

interface EmailParams {
  petitionerName: string;
  petitionerEmail: string;
  bankName: string;
  bankCode: string;
}

// Add this new function to generate unsubscribe link
function generateUnsubscribeLink(email: string): string {
  const token = Buffer.from(email).toString('base64')
  return `${process.env.NEXT_PUBLIC_BASE_URL}/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`
}

// Update the sendEmail function to check for unsubscribed users
async function sendEmail({ to, subject, html, replyTo, includeUnsubscribe = false }: EmailOptions): Promise<EmailResponse> {
  try {
    console.log('Sending email:', {
      to,
      subject,
      replyTo,
      includeUnsubscribe
    })

    // Only check unsubscribe and add unsubscribe link for petitioner emails
    if (includeUnsubscribe) {
      // Check if user is unsubscribed
      const { data: preferences } = await supabase
        .from('email_preferences')
        .select('unsubscribed')
        .eq('email', to)
        .single()

      if (preferences?.unsubscribed) {
        return { success: false, error: 'User is unsubscribed' }
      }

      // Add unsubscribe link to email
      const unsubscribeLink = generateUnsubscribeLink(to)
      html = `
        ${html}
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
          <p>If you no longer wish to receive these emails, you can <a href="${unsubscribeLink}">unsubscribe here</a>.</p>
        </div>
      `
    }

    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'WeeWantMore <noreply@weewantmore.ng>',
      to,
      subject,
      html,
      replyTo: replyTo || process.env.RESEND_REPLY_TO_EMAIL
    })

    if (!result?.data?.id) {
      console.error('Failed to send email:', result)
      return {
        success: false,
        error: 'Failed to send email'
      }
    }

    console.log('Email sent successfully:', result.data.id)
    return {
      success: true,
      data: { id: result.data.id },
      error: undefined
    }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error: 'Error processing email request' }
  }
}

async function getOrganizationEmails(organizationId: string): Promise<string[]> {
  console.log('Fetching email for organization:', organizationId)
  
  const { data, error } = await supabase
    .from('organizations')
    .select('email')
    .eq('id', organizationId)
    .single()

  if (error) {
    console.error('Error fetching organization email:', error)
    return ['contact@weewantmore.ng']
  }

  if (!data?.email) {
    console.log('No email found for organization, using default')
    return ['contact@weewantmore.ng']
  }

  console.log('Found organization email:', data.email)
  return [data.email]
}

// Main function to send petition email to organization
async function sendPetitionEmailToOrganization(data: PetitionEmailData): Promise<EmailResponse> {
  return sendEmail({
    to: data.organizationEmail,
    subject: `Dear ${data.organizationName}, Fund Nigerian Women's Economic Ambitions`,
    html: generatePetitionEmailTemplate(data),
    replyTo: data.petitionerEmail,
    includeUnsubscribe: false
  })
}

// Rename and export the template function
function generatePetitionEmailTemplate(data: PetitionEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .demands {
          background: #FFF0F0;
          padding: 20px;
          margin: 20px 0;
          border-radius: 8px;
        }
        .demands ul {
          padding-left: 20px;
        }
        .signature {
          margin-top: 30px;
        }
        .footer {
          margin-top: 40px;
          font-size: 14px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="content">
          <p>Dear ${data.organizationName},</p>
          
          <p>Nigerian women drive 50% of our economy, but banks give us less than 10% of SME loans. That needs to change.</p>
          
          <p>As a citizen committed to economic growth and inclusion, I'm calling on you to take bold action. I want you to:</p>
          
          <div class="demands">
            <ul>
              <li>Create or expand dedicated women's business credit fund with friendly-interest rates</li>
              <li>Reserve 40% of your MSME loan portfolio to women and simplify collateral requirements</li>
              <li>Mandate 30% gender-based lending targets in your bank</li>
              <li>Reserve 50% of government MSME intervention funds exclusively for women</li>
            </ul>
          </div>
          
          <p><strong>When women earn, Nigeria grows.</strong></p>
          
          <div class="signature">
            <p>Sincerely,<br>${data.petitionerName}</p>
          </div>
          
          <div class="footer">
            <p>This petition is part of the #WEEWantMore Campaign, demanding increased access to loans and capital for Nigerian women entrepreneurs.</p>
            <p>Learn more at <a href="https://weewantmore.ng" style="color: #ED323D;">weewantmore.ng</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

// Send confirmation email to petitioner
async function sendConfirmationEmail(data: PetitionEmailData): Promise<EmailResponse> {
  return sendEmail({
    to: data.petitionerEmail,
    subject: 'Thank you for your petition',
    html: generateConfirmationEmailTemplate(data),
    includeUnsubscribe: true
  })
}

// Generate HTML template for confirmation email
function generateConfirmationEmailTemplate(data: PetitionEmailData): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Thank You for Your Petition</h2>
      <p>Dear ${data.petitionerName},</p>
      <p>Thank you for signing the petition to request more funding for women entrepreneurs from ${data.organizationName}.</p>
      <p>Your voice matters, and together we can make a difference in improving access to finance for women-led businesses in Nigeria.</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p>Your petition has been sent to ${data.organizationName}.</p>
      </div>
      <p>Share this petition with others to amplify our message:</p>
      <p><a href="https://weewantmore.ng/petition" style="background-color: #ED323D; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block;">Share the Petition</a></p>
      <p>For more information, please visit <a href="https://weewantmore.ng">weewantmore.ng</a>.</p>
    </div>
  `
}

// Generate HTML template for bank email
function generateBankEmailTemplate(data: PetitionEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Fund Nigerian Women's Economic Ambitions</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
        }
        .container {
          padding: 20px;
        }
        .header {
          background-color: #2ECEB0;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 20px;
        }
        .demands {
          background-color: #f5f5f5;
          padding: 20px;
          border-radius: 5px;
          margin: 20px 0;
        }
        .demands ul {
          margin: 0;
          padding-left: 20px;
        }
        .signature {
          margin-top: 30px;
          border-top: 1px solid #eee;
          padding-top: 20px;
        }
        .footer {
          background-color: #f5f5f5;
          padding: 20px;
          text-align: center;
          font-size: 14px;
          margin-top: 30px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="content">
          <p>Dear ${data.organizationName},</p>
          
          <p>Nigerian women drive 50% of our economy, but banks give us less than 10% of SME loans. That needs to change.</p>
          
          <p>As a citizen committed to economic growth and inclusion, I'm calling on you to take bold action. I want you to:</p>
          
          <div class="demands">
            <ul>
              <li>Create or expand dedicated women's business credit fund with friendly-interest rates</li>
              <li>Reserve 40% of your MSME loan portfolio to women and simplify collateral requirements</li>
              <li>Mandate 30% gender-based lending targets in your bank</li>
              <li>Reserve 50% of government MSME intervention funds exclusively for women</li>
            </ul>
          </div>
          
          <p><strong>When women earn, Nigeria grows.</strong></p>
          
          <div class="signature">
            <p>Sincerely,<br>${data.petitionerName}</p>
          </div>
          
          <div class="footer">
            <p>This petition is part of the #WEEWantMore Campaign, demanding increased access to loans and capital for Nigerian women entrepreneurs.</p>
            <p>Learn more at <a href="https://weewantmore.ng" style="color: #ED323D;">weewantmore.ng</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

// Export only what's needed
export {
  getOrganizationEmails,
  sendPetitionEmailToOrganization,
  sendConfirmationEmail,
  generatePetitionEmailTemplate,
  generateBankEmailTemplate,
  type EmailResponse,
  type EmailParams,
  type PetitionEmailData
}