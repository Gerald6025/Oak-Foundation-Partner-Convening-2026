'use client'

import { useState, useCallback, useEffect } from 'react'
import AppShell from '@/components/layout/AppShell'
import QRScanner from './QRScanner'
import CheckInSuccess from './CheckInSuccess'
import CheckInError from './CheckInError'

interface CheckInResult {
  success: boolean
  already_checked_in?: boolean
  message?: string
  error?: string
  attendee?: {
    full_name: string
    first_name: string
    last_name: string
    organization: string
    role: string
    qr_code_token: string
  }
  headcount?: {
    checked_in_today: number
    total_registered: number
  }
}

export default function ScannerPage() {
  const [result, setResult] = useState<CheckInResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [manualCode, setManualCode] = useState('')
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

  const handleScan = useCallback(async (qrCode: string) => {
    if (isProcessing) return
    setIsProcessing(true)

    try {
      const res = await fetch('/api/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qr_code_token: qrCode }),
      })

      const data: CheckInResult = await res.json()
      setResult(data)
    } catch {
      setResult({
        success: false,
        error: 'Network error. Please check your connection.',
      })
    } finally {
      setIsProcessing(false)
    }
  }, [isProcessing])

  const handleManualCheck = async () => {
    if (!manualCode.trim()) return
    await handleScan(manualCode.trim())
  }

  const handleReset = () => {
    setResult(null)
    setManualCode('')
  }

  // Show result screens
  if (result) {
    if (result.success && result.attendee) {
      return (
        <CheckInSuccess
          attendee={result.attendee}
          alreadyCheckedIn={result.already_checked_in || false}
          headcount={result.headcount}
          onScanNext={handleReset}
        />
      )
    }
    return <CheckInError error={result.error || 'Unknown error'} onTryAgain={handleReset} />
  }

  // Presenters have NO right to Check-In
  if (role === 'Presenter') {
    return (
      <AppShell>
        <div className="w-full flex flex-col items-center px-4 pt-10 pb-24">
          <div className="w-[370px] max-w-full bg-white rounded-[26px] p-6 text-center shadow-sm border border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3.5 text-2xl border border-amber-200">
              🔒
            </div>
            <h1 className="text-lg font-black text-[#0F172A]">
              Check-In Access Restricted
            </h1>
            <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
              The Check-In Scanner is restricted to members of the <strong>Coordination Team</strong>. As a <strong>Presenter</strong>, your privileges include access to the Programme and Partner directory.
            </p>
            <a
              href="/programme"
              className="mt-5 inline-block w-full bg-[#162E55] hover:bg-[#1E3A68] text-white py-3.5 rounded-[16px] font-bold text-xs shadow-md shadow-[#162E55]/20 transition-all text-center"
            >
              Go to Programme
            </a>
          </div>
        </div>
      </AppShell>
    )
  }

  const mockAttendees = [
    {
      initials: 'MS',
      name: 'Collin Manyande',
      code: 'OAK-2026-7842-XKPH',
      role: 'Partner',
    },
    {
      initials: 'JO',
      name: 'James Odhiambo',
      code: 'OAK-2026-1193-JWQA',
      role: 'OAK Staff',
    },
    {
      initials: 'KM',
      name: 'Kayden Mamu',
      code: 'OAK-2026-5592-FWBN',
      role: 'Partner',
    },
    {
      initials: 'MS',
      name: 'Maria Schmidt',
      code: 'OAK-2026-9214-MSCH',
      role: 'Partner',
    },
  ]

  return (
    <AppShell>
      <div className="w-full flex flex-col items-center px-4 pt-3 pb-24">
        <div className="w-[370px] max-w-full">
          {/* Title Section */}
          <div className="pt-2 pb-3.5">
            <h1 className="text-[26px] font-black text-[#0F172A] leading-tight">
              Event Check-In
            </h1>
            <p className="text-xs text-[#64748B] mt-0.5 font-normal">
              Scan an attendee QR code to check them in
            </p>
          </div>

          {/* QR Scanner */}
          <QRScanner onScan={handleScan} isProcessing={isProcessing} />

          {/* Simulate QR Scan (Matching Screenshot 3) */}
          <div className="mt-5">
            <h3 className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-2.5">
              Simulate QR Scan
            </h3>
            <div className="space-y-2">
              {mockAttendees.map((att) => {
                const isPartner = att.role === 'Partner'
                return (
                  <button
                    key={att.code}
                    onClick={() => handleScan(att.code)}
                    disabled={isProcessing}
                    className="w-full bg-white rounded-[20px] p-3 shadow-sm border border-slate-100/80 hover:border-slate-200 hover:shadow-md transition-all flex items-center justify-between gap-3 text-left cursor-pointer active:scale-[0.99] disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-[#1E3A68] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {att.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#0F172A] truncate">
                          {att.name}
                        </p>
                        <p className="text-[10px] font-mono text-[#94A3B8] tracking-wider mt-0.5">
                          {att.code}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold flex-shrink-0 ${
                        isPartner
                          ? 'bg-[#EEF2F6] text-[#1E3A68] border border-slate-200/60'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isPartner ? 'bg-[#1E3A68]' : 'bg-emerald-600'
                        }`}
                      />
                      <span>{att.role}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Manual Code Entry (Matching Screenshot 3) */}
          <div className="mt-5">
            <div className="bg-white rounded-[24px] p-4 shadow-sm border border-slate-100/80">
              <h3 className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-2.5">
                Manual Code Entry
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="OAK-2026-XXXX-XXXX"
                  className="flex-1 px-3.5 py-2.5 bg-[#EEF2F6] border-0 rounded-[14px] text-xs font-mono text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#162E55]/25 uppercase transition-all"
                  onKeyDown={(e) => e.key === 'Enter' && handleManualCheck()}
                  id="manual-code-input"
                />
                <button
                  onClick={handleManualCheck}
                  disabled={!manualCode.trim() || isProcessing}
                  className="bg-[#1E3A68] hover:bg-[#162E55] text-white px-5 py-2.5 rounded-[14px] font-bold text-xs shadow-sm active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                  id="manual-check-btn"
                >
                  Check
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
