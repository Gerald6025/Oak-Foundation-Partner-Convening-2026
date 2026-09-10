import AppShell from '@/components/layout/AppShell'

interface CheckInErrorProps {
  error: string
  onTryAgain: () => void
}

export default function CheckInError({ error, onTryAgain }: CheckInErrorProps) {
  return (
    <AppShell>
      <div className="w-full flex flex-col items-center px-4 pt-3 pb-24">
        <div className="w-[370px] max-w-full">
          {/* ─── 1. Red Error Banner ─── */}
          <div className="w-full bg-[#E53935] rounded-[26px] p-5 shadow-md flex items-center gap-3.5 relative overflow-hidden animate-scale-in">
            <div className="w-12 h-12 rounded-[16px] bg-white/20 flex items-center justify-center flex-shrink-0 text-white">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
            <div>
              <p className="text-white/80 text-[10px] font-bold uppercase tracking-wider">
                CHECK-IN FAILED
              </p>
              <h1 className="text-white text-[21px] font-black leading-tight mt-0.5">
                QR Not Recognised
              </h1>
              <p className="text-white/80 text-xs mt-0.5 font-normal">
                {error || 'Code is invalid or unregistered'}
              </p>
            </div>
          </div>

          {/* ─── 2. Possible Reasons Card ─── */}
          <div className="w-full bg-white rounded-[26px] p-5 shadow-sm border border-slate-100/80 mt-3.5 animate-slide-up">
            <h3 className="font-extrabold text-sm text-[#0F172A] flex items-center gap-2">
              <span className="text-amber-500">⚠️</span>
              <span>Possible reasons</span>
            </h3>
            <ul className="mt-3.5 space-y-2.5">
              {[
                'QR code belongs to a different event',
                'Registration was not completed',
                'Code has been altered or corrupted',
                'Attendee registered under a different email',
              ].map((reason, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-[#64748B] leading-relaxed">
                  <span className="w-2 h-2 bg-red-400 rounded-full mt-1.5 flex-shrink-0" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ─── 3. Action Buttons ─── */}
          <div className="mt-4 space-y-3">
            <button
              onClick={onTryAgain}
              className="w-full bg-[#1E3A68] hover:bg-[#162E55] text-white py-3.5 rounded-[18px] font-bold text-sm tracking-wide shadow-md shadow-[#162E55]/20 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
              id="try-again-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.5 2v6h-6" />
                <path d="M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
              <span>Try Again</span>
            </button>

            <a
              href="tel:+263770000000"
              className="w-full bg-white text-[#0F172A] py-3.5 rounded-[18px] font-bold text-sm border border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer shadow-sm text-center"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
              </svg>
              <span>Contact Coordination Team</span>
            </a>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
