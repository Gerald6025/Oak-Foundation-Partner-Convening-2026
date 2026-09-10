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
  const now = new Date()
  const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  const checkedCount = headcount?.checked_in_today ?? 74
  const totalCount = headcount?.total_registered ?? 110
  const percent = Math.min(100, Math.round((checkedCount / Math.max(1, totalCount)) * 100))

  return (
    <AppShell>
      <div className="w-full flex flex-col items-center px-4 pt-3 pb-24">
        <div className="w-[370px] max-w-full">
          {/* ─── 1. Green Success Banner ─── */}
          <div className="w-full bg-[#05A36A] rounded-[26px] p-5 shadow-md flex items-center gap-3.5 relative overflow-hidden animate-scale-in">
            <div className="w-12 h-12 rounded-[16px] bg-white/20 flex items-center justify-center flex-shrink-0 text-white">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <h1 className="text-white text-[20px] font-black leading-tight">
                {alreadyCheckedIn ? 'Already Checked In' : 'Checked In Successfully'}
              </h1>
              <p className="text-white/80 text-xs mt-0.5 font-medium flex items-center gap-1.5">
                <span>⏱</span>
                <span>{timeStr} · {dateStr}</span>
              </p>
            </div>
          </div>

          {/* ─── 2. Attendee Info Card ─── */}
          <div className="w-full bg-white rounded-[26px] p-5 shadow-sm border border-slate-100/80 mt-3.5 animate-slide-up">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-[#1E3A68] text-white font-black text-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-extrabold text-[18px] text-[#0F172A] leading-tight truncate">
                  {attendee.full_name}
                </h2>
                <p className="text-xs text-[#64748B] mt-0.5 truncate font-normal">
                  {attendee.organization}
                </p>
                <div className="mt-1.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#EEF2F6] text-[#1E3A68] border border-slate-200/60 text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1E3A68]" />
                    <span>{attendee.role}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-100 my-4" />

            {/* Next Session + Venue 2-Column Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-[#F1F5F9] rounded-[18px] p-3.5">
                <p className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <span>NEXT SESSION</span>
                </p>
                <p className="text-sm font-extrabold text-[#0F172A] mt-1.5 leading-snug">
                  Opening Plenary
                </p>
              </div>

              <div className="bg-[#F1F5F9] rounded-[18px] p-3.5">
                <p className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>VENUE</span>
                </p>
                <p className="text-sm font-extrabold text-[#0F172A] mt-1.5 leading-snug">
                  Main Hall A
                </p>
              </div>
            </div>
          </div>

          {/* ─── 3. Live Event Status Card ─── */}
          <div className="w-full bg-white rounded-[26px] p-5 shadow-sm border border-slate-100/80 mt-3.5 animate-slide-up">
            <h3 className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>LIVE EVENT STATUS</span>
            </h3>

            <div className="mt-3">
              <p className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#05A36A] rounded-full animate-pulse" />
                <span>Opening Plenary starting at 09:30</span>
              </p>
              <p className="text-xs text-[#64748B] mt-1 font-normal">
                {checkedCount} of {totalCount} attendees checked in · Main Hall A
              </p>

              {/* Progress bar */}
              <div className="mt-3.5 w-full bg-[#E2E8F0] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#1E3A68] h-2 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          </div>

          {/* ─── 4. CTA: Scan Next Attendee ─── */}
          <button
            onClick={onScanNext}
            className="w-full bg-[#1E3A68] hover:bg-[#162E55] text-white py-4 rounded-[18px] font-bold text-sm tracking-wide shadow-md shadow-[#162E55]/20 flex items-center justify-center gap-2.5 mt-4 active:scale-95 transition-all cursor-pointer"
            id="scan-next-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7V5a2 2 0 0 1 2-2h2" />
              <path d="M17 3h2a2 2 0 0 1 2 2v2" />
              <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
              <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
              <line x1="7" y1="12" x2="17" y2="12" />
            </svg>
            <span>Scan Next Attendee</span>
          </button>
        </div>
      </div>
    </AppShell>
  )
}
