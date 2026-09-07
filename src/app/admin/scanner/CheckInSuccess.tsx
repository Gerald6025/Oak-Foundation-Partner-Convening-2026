import AppShell from '@/components/layout/AppShell'
import { getInitials, getAvatarColor } from '@/lib/utils'

interface CheckInSuccessProps {
  attendee: {
    full_name: string
    first_name: string
    last_name: string
    organization: string
    role: string
    qr_code_token: string
  }
  alreadyCheckedIn: boolean
  headcount?: {
    checked_in_today: number
    total_registered: number
  }
  onScanNext: () => void
}

export default function CheckInSuccess({
  attendee,
  alreadyCheckedIn,
  headcount,
  onScanNext,
}: CheckInSuccessProps) {
  const initials = getInitials(attendee.full_name)
  const avatarColor = getAvatarColor(attendee.full_name)
  const now = new Date()
  const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <AppShell>
      {/* Success Banner */}
      <div className="mx-4 mt-4 rounded-2xl p-5 relative overflow-hidden animate-scale-in bg-oak-green">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="flex items-start gap-3 relative z-10">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <div>
            <h1 className="text-white text-xl font-bold">
              {alreadyCheckedIn ? 'Already Checked In' : 'Checked In Successfully'}
            </h1>
            <p className="text-white/70 text-sm mt-0.5">
              ⏱ {timeStr} · {dateStr}
            </p>
          </div>
        </div>
      </div>

      {/* Attendee Info Card */}
      <div className="max-w-lg mx-auto px-4 mt-4 animate-slide-up stagger-1">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${avatarColor}`}>
              {initials}
            </div>
            <div>
              <h2 className="font-semibold text-lg text-oak-text">{attendee.full_name}</h2>
              <p className="text-sm text-oak-text-muted">{attendee.organization}</p>
              <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full bg-oak-green/10 text-oak-green-dark text-xs font-medium">
                <span className="w-1.5 h-1.5 bg-oak-green rounded-full" />
                {attendee.role}
              </span>
            </div>
          </div>

          {/* Next Session + Venue */}
          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="bg-oak-gray-50 rounded-xl p-3">
              <p className="text-[10px] font-semibold text-oak-text-muted uppercase tracking-wider flex items-center gap-1">
                <span>👥</span> Next Session
              </p>
              <p className="text-sm font-semibold text-oak-text mt-1">Opening Plenary</p>
            </div>
            <div className="bg-oak-gray-50 rounded-xl p-3">
              <p className="text-[10px] font-semibold text-oak-text-muted uppercase tracking-wider flex items-center gap-1">
                <span>📍</span> Venue
              </p>
              <p className="text-sm font-semibold text-oak-text mt-1">Main Hall A</p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Event Status */}
      {headcount && (
        <div className="max-w-lg mx-auto px-4 mt-4 animate-slide-up stagger-2">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="text-[10px] font-semibold text-oak-text-muted uppercase tracking-wider flex items-center gap-1">
              👥 Live Event Status
            </h3>
            <div className="mt-3">
              <p className="text-sm font-medium text-oak-text flex items-center gap-2">
                <span className="w-2 h-2 bg-oak-green rounded-full animate-pulse-soft" />
                Opening Plenary starting at 09:30
              </p>
              <p className="text-xs text-oak-text-muted mt-1">
                {headcount.checked_in_today} of {headcount.total_registered} attendees checked in · Main Hall A
              </p>
              {/* Progress bar */}
              <div className="mt-3 w-full bg-oak-gray-100 rounded-full h-2">
                <div
                  className="bg-oak-navy h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      (headcount.checked_in_today / Math.max(1, headcount.total_registered)) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scan Next Button */}
      <div className="max-w-lg mx-auto px-4 mt-6 mb-8 animate-slide-up stagger-3">
        <button
          onClick={onScanNext}
          className="w-full bg-oak-green text-white py-4 rounded-2xl font-semibold text-base
            hover:bg-oak-green-dark transition-colors shadow-lg shadow-oak-green/20 active:scale-[0.98]"
          id="scan-next-btn"
        >
          <span className="flex items-center justify-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 4v6h6" />
              <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
            </svg>
            Scan Next Attendee
          </span>
        </button>
      </div>
    </AppShell>
  )
}
