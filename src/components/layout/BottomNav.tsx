'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BottomNav() {
  const pathname = usePathname()

  const isRegisterActive =
    pathname === '/' || pathname === '/register' || pathname.startsWith('/pass')
  const isProgrammeActive = pathname.startsWith('/programme')
  const isPartnersActive = pathname.startsWith('/partners')

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 shadow-sm no-print">
      <div className="w-[370px] max-w-full mx-auto flex items-center justify-between py-2 px-3">
        {/* Tab 1: Register */}
        <Link
          href="/"
          className={`flex flex-col items-center gap-1 rounded-[16px] px-5 py-1.5 transition-all ${
            isRegisterActive
              ? 'bg-[#EEF2F6] text-[#162E55]'
              : 'text-[#64748B] hover:text-[#162E55]'
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" y1="8" x2="19" y2="14" />
            <line x1="22" y1="11" x2="16" y2="11" />
          </svg>
          <span className={`text-[10px] ${isRegisterActive ? 'font-bold' : 'font-medium'}`}>
            Register
          </span>
        </Link>

        {/* Tab 2: Programme */}
        <Link
          href="/programme"
          className={`flex flex-col items-center gap-1 rounded-[16px] px-5 py-1.5 transition-all ${
            isProgrammeActive
              ? 'bg-[#EEF2F6] text-[#162E55]'
              : 'text-[#64748B] hover:text-[#162E55]'
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span className={`text-[10px] ${isProgrammeActive ? 'font-bold' : 'font-medium'}`}>
            Programme
          </span>
        </Link>

        {/* Tab 3: Partners */}
        <Link
          href="/partners"
          className={`flex flex-col items-center gap-1 rounded-[16px] px-5 py-1.5 transition-all ${
            isPartnersActive
              ? 'bg-[#EEF2F6] text-[#162E55]'
              : 'text-[#64748B] hover:text-[#162E55]'
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <span className={`text-[10px] ${isPartnersActive ? 'font-bold' : 'font-medium'}`}>
            Partners
          </span>
        </Link>
      </div>
    </nav>
  )
}
