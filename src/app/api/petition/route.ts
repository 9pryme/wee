export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendPetitionEmailToOrganization, sendConfirmationEmail } from '@/services/email'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Processing petition:', body)
    
    const { name, email, organization_id } = body

    // First verify the organization exists
    const { data: organization } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', organization_id)
      .single()

    // Debug log to see what we're getting from the database
    console.log('Found organization:', organization)

    if (!organization) {
      console.error('Organization not found:', organization_id)
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    // Ensure we have an email to send to
    if (!organization.organizationemail) {
      console.error('No email found for organization:', organization.organization_name)
      return NextResponse.json(
        { error: 'Organization email not found' },
        { status: 400 }
      )
    }

    // Save petition
    const { error: dbError } = await supabase
      .from('petition_submissions')
      .insert({
        petitioner_name: name,
        petitioner_email: email,
        organization_id: organization.id,
        organization_name: organization.organization_name
      })

    if (dbError) {
      console.error('Failed to save petition:', dbError)
      return NextResponse.json(
        { error: 'Failed to save petition' },
        { status: 500 }
      )
    }

    // Send both emails
    const [orgEmailResult, confirmationEmailResult] = await Promise.allSettled([
      sendPetitionEmailToOrganization({
        petitionerName: name,
        petitionerEmail: email,
        organizationName: organization.organization_name,
        organizationId: organization.id,
        organizationEmail: organization.organizationemail
      }),
      sendConfirmationEmail({
        petitionerName: name,
        petitionerEmail: email,
        organizationName: organization.organization_name,
        organizationId: organization.id,
        organizationEmail: organization.organizationemail
      })
    ])

    // Log results for debugging
    console.log('Email sending results:', {
      orgEmail: orgEmailResult,
      confirmationEmail: confirmationEmailResult
    })

    return NextResponse.json({
      success: true,
      orgEmailSent: orgEmailResult.status === 'fulfilled',
      confirmationEmailSent: confirmationEmailResult.status === 'fulfilled'
    })
  } catch (error) {
    console.error('Error processing petition:', error)
    return NextResponse.json(
      { error: 'Failed to process petition' },
      { status: 500 }
    )
  }
} 