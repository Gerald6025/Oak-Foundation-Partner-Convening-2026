import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { checkInSchema } from '@/lib/validators'
import { getTodayDate } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const parsed = checkInSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid QR code data', success: false },
        { status: 400 }
      )
    }

    const { qr_code_token } = parsed.data
    const supabase = createAdminClient()

    // Look up attendee by QR token
    const { data: attendee, error: lookupError } = await supabase
      .from('attendees')
      .select('id, first_name, last_name, full_name, organization, role, qr_code_token')
      .eq('qr_code_token', qr_code_token)
      .single()

    if (lookupError || !attendee) {
      return NextResponse.json(
        {
          error: 'QR Not Recognised',
          message: 'Code is invalid or unregistered',
          success: false,
        },
        { status: 404 }
      )
    }

    const today = getTodayDate()

    // Attempt check-in (unique constraint prevents duplicates)
    const { error: checkInError } = await supabase
      .from('check_ins')
      .insert({
        attendee_id: attendee.id,
        check_in_date: today,
      })

    if (checkInError) {
      // Check if it's a duplicate
      if (checkInError.code === '23505') {
        return NextResponse.json(
          {
            success: true,
            already_checked_in: true,
            message: 'Already checked in today',
            attendee: {
              full_name: attendee.full_name,
              first_name: attendee.first_name,
              last_name: attendee.last_name,
              organization: attendee.organization,
              role: attendee.role,
              qr_code_token: attendee.qr_code_token,
            },
          },
          { status: 200 }
        )
      }

      console.error('Check-in error:', checkInError)
      return NextResponse.json(
        { error: 'Check-in failed. Please try again.', success: false },
        { status: 500 }
      )
    }

    // Get updated headcount
    const { count: todayCount } = await supabase
      .from('check_ins')
      .select('*', { count: 'exact', head: true })
      .eq('check_in_date', today)

    const { count: totalRegistered } = await supabase
      .from('attendees')
      .select('*', { count: 'exact', head: true })

    return NextResponse.json(
      {
        success: true,
        already_checked_in: false,
        message: 'Checked In Successfully',
        attendee: {
          full_name: attendee.full_name,
          first_name: attendee.first_name,
          last_name: attendee.last_name,
          organization: attendee.organization,
          role: attendee.role,
          qr_code_token: attendee.qr_code_token,
        },
        headcount: {
          checked_in_today: todayCount || 0,
          total_registered: totalRegistered || 0,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Check-in endpoint error:', error)
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    )
  }
}
