import { NextRequest, NextResponse } from 'next/server'
import { sendPartnerConfirmationEmail } from '@/lib/email'
import { createAdminClient } from '@/lib/supabase/admin'
import { getAttendeeOverride } from '@/lib/attendee-overrides'

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json()
    if (!id) {
      return NextResponse.json({ error: 'Attendee ID required' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { data: attendee, error } = await supabase
      .from('attendees')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !attendee) {
      return NextResponse.json({ error: 'Attendee not found' }, { status: 404 })
    }

    const override = getAttendeeOverride(id) || (attendee.email ? getAttendeeOverride(attendee.email) : null)
    const role = override?.role || attendee.role
    const organization = override?.organization || attendee.organization
    const name = attendee.full_name || `${attendee.first_name} ${attendee.last_name}`

    const result = await sendPartnerConfirmationEmail({
      to: attendee.email,
      name,
      organization,
      role,
      qr_code_token: attendee.qr_code_token,
      pass_id: attendee.id,
    })

    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to resend email' }, { status: 500 })
  }
}
