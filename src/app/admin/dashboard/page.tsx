import AppShell from '@/components/layout/AppShell'
import { createAdminClient } from '@/lib/supabase/admin'
import { getTodayDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = createAdminClient()
  const today = getTodayDate()

  // Fetch counts
  const [
    { count: totalRegistered },
    { count: checkedInToday },
    { count: day1Count },
    { count: day2Count },
    { count: day3Count },
  ] = await Promise.all([
    supabase.from('attendees').select('*', { count: 'exact', head: true }),
    supabase.from('check_ins').select('*', { count: 'exact', head: true }).eq('check_in_date', today),
    supabase.from('check_ins').select('*', { count: 'exact', head: true }).eq('check_in_date', '2026-11-09'),
    supabase.from('check_ins').select('*', { count: 'exact', head: true }).eq('check_in_date', '2026-11-10'),
    supabase.from('check_ins').select('*', { count: 'exact', head: true }).eq('check_in_date', '2026-11-11'),
  ])

  // Fetch recent check-ins
  const { data: recentCheckIns } = await supabase
    .from('check_ins')
    .select(`
      id,
      check_in_date,
      checked_in_at,
      attendee:attendees(full_name, organization, role)
    `)
    .eq('check_in_date', today)
    .order('checked_in_at', { ascending: false })
    .limit(10)

  const total = totalRegistered || 0
  const todayChecked = checkedInToday || 0
  const percentage = total > 0 ? Math.round((todayChecked / total) * 100) : 0

  return (
    <AppShell>
      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-oak-text">Attendance Dashboard</h1>
          <p className="text-sm text-oak-text-muted mt-1">Live event check-in status</p>
        </div>

        {/* Main Stats */}
        <div className="bg-white rounded-2xl p-5 shadow-sm animate-fade-in">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-4xl font-bold text-oak-navy">{todayChecked}</p>
              <p className="text-xs text-oak-text-muted mt-1">Checked In Today</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-oak-text">{total}</p>
              <p className="text-xs text-oak-text-muted mt-1">Total Registered</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-oak-text-muted mb-1">
              <span>Attendance</span>
              <span>{percentage}%</span>
            </div>
            <div className="w-full bg-oak-gray-100 rounded-full h-3">
              <div
                className="bg-oak-navy h-3 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Per-Day Breakdown */}
        <div className="grid grid-cols-3 gap-3 animate-slide-up stagger-1">
          <DayCard day={1} date="Nov 9" count={day1Count || 0} />
          <DayCard day={2} date="Nov 10" count={day2Count || 0} />
          <DayCard day={3} date="Nov 11" count={day3Count || 0} />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 animate-slide-up stagger-2">
          <a
            href="/admin/scanner"
            className="bg-oak-navy text-white rounded-2xl p-4 text-center hover:bg-oak-navy-light transition-colors"
          >
            <svg className="mx-auto mb-1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M9 3H5C3.89543 3 3 3.89543 3 5V9" strokeLinecap="round" />
              <path d="M15 3H19C20.1046 3 21 3.89543 21 5V9" strokeLinecap="round" />
              <path d="M9 21H5C3.89543 21 3 20.1046 3 19V15" strokeLinecap="round" />
              <path d="M15 21H19C20.1046 21 21 20.1046 21 19V15" strokeLinecap="round" />
            </svg>
            <span className="text-sm font-semibold">Scan QR</span>
          </a>
          <a
            href="/admin/attendees"
            className="bg-white text-oak-text rounded-2xl p-4 text-center shadow-sm border border-oak-gray-200 hover:bg-oak-gray-50 transition-colors"
          >
            <svg className="mx-auto mb-1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87" strokeLinecap="round" />
              <path d="M16 3.13a4 4 0 010 7.75" strokeLinecap="round" />
            </svg>
            <span className="text-sm font-semibold">Attendees</span>
          </a>
        </div>

        {/* Recent Check-ins */}
        <div className="bg-white rounded-2xl p-5 shadow-sm animate-slide-up stagger-3">
          <h2 className="text-xs font-semibold text-oak-text-muted uppercase tracking-wider mb-4">
            Recent Check-ins
          </h2>
          {recentCheckIns && recentCheckIns.length > 0 ? (
            <div className="space-y-3">
              {recentCheckIns.map((checkIn) => {
                const attendee = checkIn.attendee as unknown as {
                  full_name: string
                  organization: string
                  role: string
                } | null
                if (!attendee) return null
                
                const time = new Date(checkIn.checked_in_at).toLocaleTimeString('en-GB', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
                return (
                  <div key={checkIn.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-oak-green/10 rounded-full flex items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-oak-text">{attendee.full_name}</p>
                        <p className="text-xs text-oak-text-muted">{attendee.organization}</p>
                      </div>
                    </div>
                    <span className="text-xs text-oak-text-muted">{time}</span>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-oak-text-muted text-center py-4">
              No check-ins today yet
            </p>
          )}
        </div>
      </div>
    </AppShell>
  )
}

function DayCard({ day, date, count }: { day: number; date: string; count: number }) {
  return (
    <div className="bg-white rounded-2xl p-3 shadow-sm text-center">
      <p className="text-[10px] font-semibold text-oak-text-muted uppercase">Day {day}</p>
      <p className="text-2xl font-bold text-oak-navy mt-1">{count}</p>
      <p className="text-[10px] text-oak-text-muted">{date}</p>
    </div>
  )
}
