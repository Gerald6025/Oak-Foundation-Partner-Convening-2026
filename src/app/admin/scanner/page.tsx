'use client'

import { useState, useCallback } from 'react'
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

  return (
    <AppShell>
      {/* Title Section */}
      <div className="max-w-lg mx-auto px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-oak-text">Event Check-In</h1>
        <p className="text-oak-text-muted text-sm mt-1">
          Scan an attendee QR code to check them in
        </p>
      </div>

      {/* QR Scanner */}
      <div className="max-w-lg mx-auto px-4">
        <QRScanner onScan={handleScan} isProcessing={isProcessing} />
      </div>

      {/* Manual Code Entry */}
      <div className="max-w-lg mx-auto px-4 mt-6 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-semibold text-oak-text-muted uppercase tracking-wider mb-3">
            Manual Code Entry
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="OAK-2026-XXXX-XXXX"
              className="form-input flex-1 font-mono text-sm"
              onKeyDown={(e) => e.key === 'Enter' && handleManualCheck()}
              id="manual-code-input"
            />
            <button
              onClick={handleManualCheck}
              disabled={!manualCode.trim() || isProcessing}
              className="bg-oak-navy text-white px-6 py-3 rounded-xl font-semibold text-sm
                hover:bg-oak-navy-light transition-colors disabled:opacity-50"
              id="manual-check-btn"
            >
              Check
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
