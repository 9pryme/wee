import { supabase } from '@/lib/supabase'

interface PetitionEmailData {
  petitionerName: string
  petitionerEmail: string
  bankName: string
  bankCode: string
}

interface EmailOptions {
  to: string
  subject: string
  html: string
}

interface EmailResponse {
  success: boolean
  error?: string
}

// Send email helper function
async function sendEmail({ to, subject, html }: EmailOptions): Promise<EmailResponse> {
  try {
    // Temporary implementation
    console.log('Sending email:', { to, subject, html })
    return { success: true }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error: String(error) }
  }
}

// Get bank email addresses from the database
export async function getBankEmails(bankCode: string): Promise<string[]> {
  console.log('Fetching emails for bank code:', bankCode)
  
  const { data, error } = await supabase
    .from('banks')
    .select('email')
    .eq('code', bankCode)
    .single()

  if (error || !data) {
    console.error('Error fetching bank emails:', error)
    return []
  }

  console.log('Found bank email:', data.email)
  return data.email ? [data.email] : []
}

// Send emails via API
export async function sendPetitionEmailToBank(data: PetitionEmailData): Promise<boolean> {
  try {
    console.log('Sending petition email to bank:', data.bankName)
    const response = await fetch('/api/petition', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.petitionerName,
        email: data.petitionerEmail,
        bank_code: data.bankCode,
        bank_name: data.bankName
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to send petition')
    }

    const result = await response.json()
    console.log('Petition submission result:', result)
    return true
  } catch (error) {
    console.error('Error sending petition:', error)
    return false
  }
}

// Send confirmation email to petitioner
export async function sendConfirmationEmail(data: PetitionEmailData): Promise<boolean> {
  try {
    console.log('Sending confirmation email to petitioner:', data.petitionerEmail)
    const result = await sendEmail({
      to: data.petitionerEmail,
      subject: 'Thank You for Your Petition',
      html: generateConfirmationEmailTemplate(data)
    })

    console.log('Confirmation email send result:', result)
    return result.success
  } catch (error) {
    console.error('Error sending confirmation email:', error)
    return false
  }
}

// Generate HTML template for bank email
function generateBankEmailTemplate(data: PetitionEmailData): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>New Petition Submission</h2>
      <p>Dear ${data.bankName} Team,</p>
      <p>A new petition has been submitted requesting more funding for women entrepreneurs.</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Petitioner:</strong> ${data.petitionerName}</p>
        <p><strong>Email:</strong> ${data.petitionerEmail}</p>
      </div>
      <h3>Petition Demands:</h3>
      <ol>
        <li>Increase funding allocation for women-led businesses</li>
        <li>Create specialized loan products for women entrepreneurs</li>
        <li>Simplify application processes for women-owned businesses</li>
        <li>Provide mentorship and support programs alongside funding</li>
      </ol>
      <p>This petition is part of the WeeWantMore campaign to improve access to finance for women entrepreneurs in Nigeria.</p>
      <p>For more information, please visit <a href="https://weewantmore.ng">weewantmore.ng</a>.</p>
    </div>
  `
}

// Generate HTML template for confirmation email
function generateConfirmationEmailTemplate(data: PetitionEmailData): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Thank You for Your Petition</h2>
      <p>Dear ${data.petitionerName},</p>
      <p>Thank you for signing the petition to request more funding for women entrepreneurs from ${data.bankName}.</p>
      <p>Your voice matters, and together we can make a difference in improving access to finance for women-led businesses in Nigeria.</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p>Your petition has been sent to ${data.bankName}.</p>
      </div>
      <p>Share this petition with others to amplify our message:</p>
      <p><a href="https://weewantmore.ng/petition" style="background-color: #ED323D; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block;">Share the Petition</a></p>
      <p>For more information, please visit <a href="https://weewantmore.ng">weewantmore.ng</a>.</p>
    </div>
  `
}

// Export generateBankEmailTemplate if it's used elsewhere
export { generateBankEmailTemplate } 