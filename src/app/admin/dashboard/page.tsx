import AppShell from '@/components/layout/AppShell'
import { createAdminClient } from '@/lib/supabase/admin'
import { getTodayDate } from '@/lib/utils'
import AttendanceDashboardClient, { type AttendeeRecord } from './AttendanceDashboardClient'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = createAdminClient()
  const today = getTodayDate()

  // Fetch attendees and check-ins
  const [
    { data: attendeesData },
    { data: checkInsData },
    { count: day1Count },
    { count: day2Count },
    { count: day3Count },
  ] = await Promise.all([
    supabase
      .from('attendees')
      .select('id, full_name, first_name, last_name, email, organization, role, created_at, qr_code_token')
      .order('created_at', { ascending: false }),
    supabase
      .from('check_ins')
      .select('attendee_id, check_in_date, checked_in_at'),
    supabase.from('check_ins').select('*', { count: 'exact', head: true }).eq('check_in_date', '2026-11-09'),
    supabase.from('check_ins').select('*', { count: 'exact', head: true }).eq('check_in_date', '2026-11-10'),
    supabase.from('check_ins').select('*', { count: 'exact', head: true }).eq('check_in_date', '2026-11-11'),
  ])

  // Build map of checked-in attendee IDs
  const checkInMap = new Map<string, string>()
  if (checkInsData) {
    checkInsData.forEach((ci) => {
      const time = new Date(ci.checked_in_at).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      })
      checkInMap.set(ci.attendee_id, time)
    })
  }

  // Fallback demo attendees if database is empty or needs seeding
  const defaultDemoAttendees: AttendeeRecord[] = [
    {
      id: 'demo-1',
      full_name: 'Maria Schmidt',
      first_name: 'Maria',
      last_name: 'Schmidt',
      organization: 'Open Society Foundations',
      role: 'Partner',
      email: 'maria.schmidt@osf.org',
      created_at: new Date().toISOString(),
      checked_in: true,
      check_in_time: '12:41',
    },
    {
      id: 'demo-2',
      full_name: 'Collin Manyande',
      first_name: 'Collin',
      last_name: 'Manyande',
      organization: 'Open Society Foundations',
      role: 'Partner',
      email: 'collin.m@osf.org',
      created_at: new Date().toISOString(),
      checked_in: true,
      check_in_time: '09:15',
    },
    {
      id: 'demo-3',
      full_name: 'James Odhiambo',
      first_name: 'James',
      last_name: 'Odhiambo',
      organization: 'OAK Foundation',
      role: 'OAK Staff',
      email: 'j.odhiambo@oakfnd.org',
      created_at: new Date().toISOString(),
      checked_in: true,
      check_in_time: '08:45',
    },
    {
      id: 'demo-4',
      full_name: 'Kayden Mamu',
      first_name: 'Kayden',
      last_name: 'Mamu',
      organization: 'Southern Africa Trust',
      role: 'Partner',
      email: 'k.mamu@satrust.org',
      created_at: new Date().toISOString(),
      checked_in: false,
    },
    {
      id: 'demo-5',
      full_name: 'Amina Diallo',
      first_name: 'Amina',
      last_name: 'Diallo',
      organization: 'Sahel Resilience Lab',
      role: 'Presenter',
      email: 'amina@sahelresilience.org',
      created_at: new Date().toISOString(),
      checked_in: true,
      check_in_time: '09:00',
    },
    {
      id: 'demo-6',
      full_name: 'Dr. Ingrid Holm',
      first_name: 'Ingrid',
      last_name: 'Holm',
      organization: 'Nordic Evaluation Centre',
      role: 'Presenter',
      email: 'i.holm@nordic-eval.org',
      created_at: new Date().toISOString(),
      checked_in: false,
    },
    {
      id: 'demo-7',
      full_name: 'Samuel Okafor',
      first_name: 'Samuel',
      last_name: 'Okafor',
      organization: 'Africa Climate Alliance',
      role: 'Observer',
      email: 'samuel@climatealliance.africa',
      created_at: new Date().toISOString(),
      checked_in: true,
      check_in_time: '10:15',
    },
    {
      id: 'demo-8',
      full_name: 'Gerald Chibanda',
      first_name: 'Gerald',
      last_name: 'Chibanda',
      organization: 'OAK Foundation Events',
      role: 'Coordination Team',
      email: 'gerald@oakconvening.org',
      created_at: new Date().toISOString(),
      checked_in: true,
      check_in_time: '07:30',
    },
  ]

  let attendeesList: AttendeeRecord[] = []

  if (attendeesData && attendeesData.length > 0) {
    attendeesList = attendeesData.map((att) => ({
      id: att.id,
      full_name: att.full_name || `${att.first_name} ${att.last_name}`,
      first_name: att.first_name,
      last_name: att.last_name,
      organization: att.organization,
      role: att.role,
      email: att.email,
      created_at: att.created_at,
      qr_code_token: att.qr_code_token,
      checked_in: checkInMap.has(att.id),
      check_in_time: checkInMap.get(att.id),
    }))

    // Merge default demos if not present
    defaultDemoAttendees.forEach((demo) => {
      if (!attendeesList.some((a) => a.full_name.toLowerCase() === demo.full_name.toLowerCase())) {
        attendeesList.push(demo)
      }
    })
  } else {
    attendeesList = defaultDemoAttendees
  }

  const initialDayCounts = {
    day1: day1Count || 74,
    day2: day2Count || 0,
    day3: day3Count || 0,
  }

  return (
    <AppShell>
      <AttendanceDashboardClient
        initialAttendees={attendeesList}
        initialDayCounts={initialDayCounts}
      />
    </AppShell>
  )
}
