export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { supabase } from '@/lib/supabase'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: true,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD
  }
})

async function sendEmail(params: {
  to: string | string[]
  subject: string
  html: string
  from?: string
  replyTo?: string
}) {
  console.log('Sending email:', params)
  
  try {
    const info = await transporter.sendMail({
      from: params.from || process.env.EMAIL_FROM,
      to: params.to,
      subject: params.subject,
      html: params.html,
      replyTo: params.replyTo
    })

    console.log('Email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Failed to send email:', error)
    throw error
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, bank_code, bank_name } = body

    console.log('Processing petition:', { name, email, bank_code, bank_name })

    // Get bank email
    const { data: bankData, error: bankError } = await supabase
      .from('banks')
      .select('email')
      .eq('code', bank_code)
      .single()

    if (bankError || !bankData?.email) {
      console.error('Error fetching bank email:', bankError)
      return NextResponse.json(
        { error: 'Bank email not found' },
        { status: 400 }
      )
    }

    // Send emails
    await Promise.all([
      // Send to bank
      sendEmail({
        to: bankData.email,
        subject: 'New Petition: Fund Women Entrepreneurs',
        html: generateBankEmailTemplate({ name, email, bank_name }),
        replyTo: email
      }),
      // Send confirmation
      sendEmail({
        to: email,
        subject: 'Thank You for Your Petition',
        html: generateConfirmationEmailTemplate({ name, bank_name })
      })
    ])

    // Store in database
    const { error: dbError } = await supabase
      .from('petition_submissions')
      .insert([{ name, email, bank_code, bank_name }])

    if (dbError) {
      console.error('Database error:', dbError)
      throw dbError
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Petition submission failed:', error)
    return NextResponse.json(
      { error: 'Failed to process petition' },
      { status: 500 }
    )
  }
}

function generateBankEmailTemplate(data: { name: string; email: string; bank_name: string }) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>New Petition Submission</h2>
      <p>Dear ${data.bank_name} Team,</p>
      <p>A new petition has been submitted requesting more funding for women entrepreneurs.</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Petitioner:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
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

function generateConfirmationEmailTemplate(data: { name: string; bank_name: string }) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Thank You for Your Petition</h2>
      <p>Dear ${data.name},</p>
      <p>Thank you for signing the petition to request more funding for women entrepreneurs from ${data.bank_name}.</p>
      <p>Your voice matters, and together we can make a difference in improving access to finance for women-led businesses in Nigeria.</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p>Your petition has been sent to ${data.bank_name}.</p>
      </div>
      <p>Share this petition with others to amplify our message:</p>
      <p><a href="https://weewantmore.ng/petition" style="background-color: #ED323D; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block;">Share the Petition</a></p>
      <p>For more information, please visit <a href="https://weewantmore.ng">weewantmore.ng</a>.</p>
    </div>
  `
} 