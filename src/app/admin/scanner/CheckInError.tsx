import AppShell from '@/components/layout/AppShell'

interface CheckInErrorProps {
  error: string
  onTryAgain: () => void
}

export default function CheckInError({ error, onTryAgain }: CheckInErrorProps) {
  return (
    <AppShell>
      {/* Error Banner */}
      <div className="mx-4 mt-4 rounded-2xl p-5 relative overflow-hidden animate-scale-in bg-oak-red">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="flex items-start gap-3 relative z-10">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <div>
            <p className="text-white/80 text-xs font-medium uppercase tracking-wider">Check-in Failed</p>
            <h1 className="text-white text-xl font-bold mt-0.5">QR Not Recognised</h1>
            <p className="text-white/70 text-sm mt-0.5">{error}</p>
          </div>
        </div>
      </div>

      {/* Possible Reasons */}
      <div className="max-w-lg mx-auto px-4 mt-4 animate-slide-up stagger-1">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-oak-text flex items-center gap-2">
            <span className="text-lg">⚠️</span>
            Possible reasons
          </h3>
          <ul className="mt-3 space-y-2.5">
            {[
              'QR code belongs to a different event',
              'Registration was not completed',
              'Code has been altered or corrupted',
              'Attendee registered under a different email',
            ].map((reason, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-oak-text-muted">
                <span className="w-2 h-2 bg-oak-red/40 rounded-full mt-1.5 flex-shrink-0" />
                {reason}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actions */}
      <div className="max-w-lg mx-auto px-4 mt-6 space-y-3 animate-slide-up stagger-2 mb-8">
        <button
          onClick={onTryAgain}
          className="w-full bg-oak-navy text-white py-4 rounded-2xl font-semibold text-base
            hover:bg-oak-navy-light transition-colors shadow-lg shadow-oak-navy/20 active:scale-[0.98]"
          id="try-again-btn"
        >
          <span className="flex items-center justify-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 4v6h6" />
              <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
            </svg>
            Try Again
          </span>
        </button>

        <button
          className="w-full bg-white text-oak-text py-4 rounded-2xl font-semibold text-base
            border border-oak-gray-200 hover:bg-oak-gray-50 transition-colors"
        >
          <span className="flex items-center justify-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
            </svg>
            Contact Coordination Team
          </span>
        </button>
      </div>
    </AppShell>
  )
}
