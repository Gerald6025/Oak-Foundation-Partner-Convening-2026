'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    const match = document.cookie.match(/(^|;)\s*user_role=([^;]+)/)
    if (match) {
      setRole(decodeURIComponent(match[2]))
    } else {
      const stored = localStorage.getItem('user_role')
      if (stored) setRole(stored)
    }
  }, [])

  const isPartner = role === 'Partner'
  const isPresenter = role === 'Presenter'
  const isObserver = role === 'Observer'
  const isCoordinationTeam =
    role === 'Coordination Team' ||
    (!isPartner && !isPresenter && !isObserver && role !== 'OAK Staff')

  const isRegisterActive = pathname === '/register'
  const isProgrammeActive = pathname.startsWith('/programme')
  const isPartnersActive = pathname.startsWith('/partners')
  const isCheckInActive = pathname === '/admin/scanner'
  const isAttendanceActive =
    pathname === '/admin/dashboard' || pathname === '/admin/attendance'

  return (
    <aside className="hidden md:flex flex-col fixed inset-y-0 left-0 w-60 bg-white border-r border-slate-100 z-40 no-print select-none">
      {/* ─── Top Brand Header ─── */}
      <div className="p-6 pb-5">
        <Link href="/" className="inline-block">
          <Image
            src="/oak-foundation-logo-sidebar.png"
            alt="Oak Foundation"
            width={120}
            height={48}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>
        <p className="text-[10px] font-bold text-[#64748B] tracking-[0.14em] uppercase mt-3">
          PARTNER CONVENING 2026
        </p>
      </div>

      {/* ─── Navigation Links ─── */}
      <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto">
        {/* Register link */}
        <Link
          href="/register"
          className={`flex items-center gap-3 px-4 py-3 rounded-[14px] text-xs font-bold transition-all ${
            isRegisterActive
              ? 'bg-[#162E55] text-white shadow-sm'
              : 'text-[#64748B] hover:bg-[#EEF2F6] hover:text-[#162E55]'
          }`}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flex-shrink-0"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" y1="8" x2="19" y2="14" />
            <line x1="22" y1="11" x2="16" y2="11" />
          </svg>
          <span>Register</span>
        </Link>

        {/* Programme link */}
        <Link
          href="/programme"
          className={`flex items-center gap-3 px-4 py-3 rounded-[14px] text-xs font-bold transition-all ${
            isProgrammeActive
              ? 'bg-[#162E55] text-white shadow-sm'
              : 'text-[#64748B] hover:bg-[#EEF2F6] hover:text-[#162E55]'
          }`}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flex-shrink-0"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>Programme</span>
        </Link>

        {/* Partners link (Staff, Presenters, Observers, Coordination Team) */}
        {!isPartner && (
          <Link
            href="/partners"
            className={`flex items-center gap-3 px-4 py-3 rounded-[14px] text-xs font-bold transition-all ${
              isPartnersActive
                ? 'bg-[#162E55] text-white shadow-sm'
                : 'text-[#64748B] hover:bg-[#EEF2F6] hover:text-[#162E55]'
            }`}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="flex-shrink-0"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span>Partners</span>
          </Link>
        )}

        {/* Check In (Coordination Team Only) */}
        {isCoordinationTeam && (
          <Link
            href="/admin/scanner"
            className={`flex items-center gap-3 px-4 py-3 rounded-[14px] text-xs font-bold transition-all ${
              isCheckInActive
                ? 'bg-[#162E55] text-white shadow-sm'
                : 'text-[#64748B] hover:bg-[#EEF2F6] hover:text-[#162E55]'
            }`}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="flex-shrink-0"
            >
              <path d="M3 7V5a2 2 0 0 1 2-2h2" />
              <path d="M17 3h2a2 2 0 0 1 2 2v2" />
              <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
              <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
              <line x1="7" y1="12" x2="17" y2="12" />
            </svg>
            <span>Check In</span>
          </Link>
        )}

        {/* Attendance (Coordination Team Only) */}
        {isCoordinationTeam && (
          <Link
            href="/admin/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-[14px] text-xs font-bold transition-all ${
              isAttendanceActive
                ? 'bg-[#162E55] text-white shadow-sm'
                : 'text-[#64748B] hover:bg-[#EEF2F6] hover:text-[#162E55]'
            }`}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="flex-shrink-0"
            >
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
            </svg>
            <span>Attendance</span>
          </Link>
        )}
      </nav>

      {/* ─── Bottom Footer Widget ─── */}
      <div className="mt-auto border-t border-slate-100 p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#EEF2F6] flex items-center justify-center text-[#64748B] flex-shrink-0">
          <svg
            width="16"
            height="16"
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
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-[#0F172A] leading-tight">Harare, Zimbabwe</p>
          <p className="text-[10px] text-[#94A3B8] mt-0.5 font-medium">9–11 Nov 2026</p>
        </div>
      </div>
    </aside>
  )
}
