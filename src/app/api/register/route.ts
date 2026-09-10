import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { registrationSchema } from '@/lib/validators'
import { generateQRToken } from '@/lib/utils'
import { setAttendeeOverride } from '@/lib/attendee-overrides'
import { sendPartnerConfirmationEmail } from '@/lib/email'

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
    const hasNoQRCode = data.role === 'Observer' || data.role === 'Coordination Team'

    // Observers and Coordination Team members do not have QR codes generated; use unique placeholder to satisfy Postgres NOT NULL column constraint
    const qr_code_token = hasNoQRCode
      ? `NON_QR_${data.role.replace(/\s+/g, '_').toUpperCase()}_${generateQRToken()}`
      : generateQRToken()

    // Use admin client to bypass RLS for insert + immediate select
    const supabase = createAdminClient()

    // Combine travel and accommodation needs for the database field
    const combinedTravel = [
      data.travel_needs ? `Travel: ${data.travel_needs}` : null,
      data.accommodation_needs ? `Accommodation: ${data.accommodation_needs}` : null,
    ]
      .filter(Boolean)
      .join(' | ') || null

    // Check if email already registered
    const { data: existing } = await supabase
      .from('attendees')
      .select('id, qr_code_token, role, first_name, last_name, organization')
      .eq('email', data.email)
      .single()

    if (existing) {
      // Ensure role override is saved even if Supabase anon key cannot update Postgres table
      setAttendeeOverride({
        id: existing.id,
        email: data.email,
        role: data.role,
        organization: data.organization || existing.organization,
        first_name: data.first_name || existing.first_name,
        last_name: data.last_name || existing.last_name,
        full_name: `${data.first_name || existing.first_name} ${data.last_name || existing.last_name}`,
        qr_code_token: existing.qr_code_token,
      })

      // Attempt DB update
      if (data.role) {
        try {
          await supabase
            .from('attendees')
            .update({ role: data.role, organization: data.organization })
            .eq('id', existing.id)
        } catch {}
      }

      // Send confirmation email containing registration details, QR code, and event info ONLY for Partners
      if (data.role === 'Partner') {
        try {
          await sendPartnerConfirmationEmail({
            to: data.email,
            name: `${data.first_name || existing.first_name} ${data.last_name || existing.last_name}`,
            organization: data.organization || existing.organization,
            role: data.role || existing.role,
            qr_code_token: existing.qr_code_token,
            pass_id: existing.id,
          })
        } catch (err) {
          console.error('Failed to send confirmation email:', err)
        }
      }

      const res = NextResponse.json(
        {
          id: existing.id,
          qr_code_token: hasNoQRCode ? null : existing.qr_code_token,
          role: data.role,
          message: 'You are registered!',
          already_registered: true,
        },
        { status: 200 }
      )
      res.cookies.set('user_role', data.role, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
        sameSite: 'lax',
      })
      return res
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
        travel_needs: combinedTravel,
        consent_given: data.consent_given,
        qr_code_token,
      })
      .select('id, qr_code_token, role')
      .single()

    if (error) {
      console.error('Registration error:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to register. Please try again.' },
        { status: 500 }
      )
    }

    // Send confirmation email containing registration details, QR code, and event info ONLY for Partners
    if (data.role === 'Partner') {
      try {
        await sendPartnerConfirmationEmail({
          to: data.email,
          name: `${data.first_name} ${data.last_name}`,
          organization: data.organization,
          role: attendee.role,
          qr_code_token: attendee.qr_code_token,
          pass_id: attendee.id,
        })
      } catch (err) {
        console.error('Failed to send confirmation email:', err)
      }
    }

    const res = NextResponse.json(
      {
        id: attendee.id,
        qr_code_token: hasNoQRCode ? null : attendee.qr_code_token,
        role: attendee.role,
        message: 'Registration successful!',
        already_registered: false,
      },
      { status: 201 }
    )
    res.cookies.set('user_role', attendee.role, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
    })
    return res
  } catch (error: any) {
    console.error('Registration endpoint error:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
