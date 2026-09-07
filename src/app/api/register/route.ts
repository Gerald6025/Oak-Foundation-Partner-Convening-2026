import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { registrationSchema } from '@/lib/validators'
import { generateQRToken } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const parsed = registrationSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = parsed.data

    // Generate unique QR token
    const qr_code_token = generateQRToken()

    // Use admin client to bypass RLS for insert + immediate select
    const supabase = createAdminClient()

    // Check if email already registered
    const { data: existing } = await supabase
      .from('attendees')
      .select('id, qr_code_token')
      .eq('email', data.email)
      .single()

    if (existing) {
      // Return existing registration
      return NextResponse.json(
        {
          id: existing.id,
          qr_code_token: existing.qr_code_token,
          message: 'You are already registered! Here is your pass.',
          already_registered: true,
        },
        { status: 200 }
      )
    }

    // Insert new attendee
    const { data: attendee, error } = await supabase
      .from('attendees')
      .insert({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone || null,
        organization: data.organization,
        sub_partner: data.sub_partner || null,
        role: data.role,
        dietary_requirements: data.dietary_requirements || null,
        accessibility_needs: data.accessibility_needs || null,
        travel_needs: data.travel_needs || null,
        consent_given: data.consent_given,
        qr_code_token,
      })
      .select('id, qr_code_token')
      .single()

    if (error) {
      console.error('Registration error:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to register. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        id: attendee.id,
        qr_code_token: attendee.qr_code_token,
        message: 'Registration successful!',
        already_registered: false,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Registration endpoint error:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
