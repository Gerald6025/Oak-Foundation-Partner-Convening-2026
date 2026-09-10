'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useState, useEffect } from 'react'

export default function BottomNav() {
  const pathname = usePathname()
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    // Read role from cookie or localStorage
    const match = document.cookie.match(/(^|;)\s*user_role=([^;]+)/)
    if (match) {
      setRole(decodeURIComponent(match[2]))
    } else {
      const stored = localStorage.getItem('user_role')
      if (stored) setRole(stored)
    }
  }, [])

  // User permissions:
  // - Partners: ONLY access to Registration, QR code page, and Programme (no check-in, attendance, or partners directory)
  // - Observers: ONLY access to Programme and Partners (no QR code, no check-in, no attendance)
  // - Presenters: Programme and Partners (no check-in, attendance, or QR pass)
  // - Coordination Team: Check In, Programme, Partners, Attendance
  const isPartner = role === 'Partner'
  const isPresenter = role === 'Presenter'
  const isObserver = role === 'Observer'
  const isCoordinationTeam =
    role === 'Coordination Team' ||
    (!isPartner && !isPresenter && !isObserver && role !== 'OAK Staff')

  const showCheckIn = isCoordinationTeam
  const showAttendance = isCoordinationTeam
  const showPartners = !isPartner // Partners do not have access to partners directory; Observers and Presenters DO
  const showRegistrationTab = isPartner

  const isCheckInActive = pathname === '/admin/scanner'
  const isProgrammeActive = pathname.startsWith('/programme')
  const isPartnersActive = pathname.startsWith('/partners')
  const isRegisterActive = pathname === '/register'
  const isAttendanceActive =
    pathname === '/admin/dashboard' || pathname === '/admin/attendance'

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 shadow-sm no-print md:hidden">
      <div className="w-[370px] max-w-full mx-auto flex items-center justify-around py-2 px-2">
        {/* Tab: Check In (Coordination Team Only) */}
        {showCheckIn && (
          <Link
            href="/admin/scanner"
            className={`flex flex-col items-center gap-1 rounded-[16px] px-3.5 py-1.5 transition-all ${
              isCheckInActive
                ? 'bg-[#EEF2F6] text-[#162E55]'
                : 'text-[#64748B] hover:text-[#162E55]'
            }`}
            id="nav-checkin"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 7V5a2 2 0 0 1 2-2h2" />
              <path d="M17 3h2a2 2 0 0 1 2 2v2" />
              <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
              <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
              <line x1="7" y1="12" x2="17" y2="12" />
            </svg>
            <span
              className={`text-[10px] ${
                isCheckInActive ? 'font-bold' : 'font-medium'
              }`}
            >
              Check In
            </span>
          </Link>
        )}

        {/* Tab 2: Programme (All attendees) */}
        <Link
          href="/programme"
          className={`flex flex-col items-center gap-1 rounded-[16px] px-4 py-1.5 transition-all ${
            isProgrammeActive
              ? 'bg-[#EEF2F6] text-[#162E55]'
              : 'text-[#64748B] hover:text-[#162E55]'
          }`}
          id="nav-programme"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span
            className={`text-[10px] ${
              isProgrammeActive ? 'font-bold' : 'font-medium'
            }`}
          >
            Programme
          </span>
        </Link>

        {/* Tab 3: Partners (Coordination Team, Presenters, Staff) */}
        {showPartners && (
          <Link
            href="/partners"
            className={`flex flex-col items-center gap-1 rounded-[16px] px-4 py-1.5 transition-all ${
              isPartnersActive
                ? 'bg-[#EEF2F6] text-[#162E55]'
                : 'text-[#64748B] hover:text-[#162E55]'
            }`}
            id="nav-partners"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span
              className={`text-[10px] ${
                isPartnersActive ? 'font-bold' : 'font-medium'
              }`}
            >
              Partners
            </span>
          </Link>
        )}

        {/* Tab: Registration (Partner Only) */}
        {showRegistrationTab && (
          <Link
            href="/register"
            className={`flex flex-col items-center gap-1 rounded-[16px] px-4 py-1.5 transition-all ${
              isRegisterActive
                ? 'bg-[#EEF2F6] text-[#162E55]'
                : 'text-[#64748B] hover:text-[#162E55]'
            }`}
            id="nav-register"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
            <span
              className={`text-[10px] ${
                isRegisterActive ? 'font-bold' : 'font-medium'
              }`}
            >
              Register
            </span>
          </Link>
        )}

        {/* Tab 4: Attendance (Coordination Team Only) */}
        {showAttendance && (
          <Link
            href="/admin/dashboard"
            className={`flex flex-col items-center gap-1 rounded-[16px] px-3.5 py-1.5 transition-all ${
              isAttendanceActive
                ? 'bg-[#EEF2F6] text-[#162E55]'
                : 'text-[#64748B] hover:text-[#162E55]'
            }`}
            id="nav-attendance"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
            </svg>
            <span
              className={`text-[10px] ${
                isAttendanceActive ? 'font-bold' : 'font-medium'
              }`}
            >
              Attendance
            </span>
          </Link>
        )}
      </div>
    </nav>
  )
}
