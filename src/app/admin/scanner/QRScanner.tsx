'use client'

import { useEffect, useRef, useState } from 'react'

interface QRScannerProps {
  onScan: (code: string) => void
  isProcessing: boolean
}

export default function QRScanner({ onScan, isProcessing }: QRScannerProps) {
  const scannerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isStarted, setIsStarted] = useState(false)
  const scannerInstanceRef = useRef<unknown>(null)

  useEffect(() => {
    let html5QrCode: unknown = null

    const initScanner = async () => {
      try {
        const { Html5Qrcode } = await import('html5-qrcode')
        
        if (!scannerRef.current) return

        html5QrCode = new Html5Qrcode('qr-scanner-element')
        scannerInstanceRef.current = html5QrCode

        await (html5QrCode as { start: (constraints: object, config: object, onSuccess: (text: string) => void, onError: () => void) => Promise<void> }).start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          },
          (decodedText: string) => {
            if (!isProcessing) {
              onScan(decodedText)
            }
          },
          () => {
            // Ignore scan errors (no QR found in frame)
          }
        )

        setIsStarted(true)
      } catch (err) {
        console.error('Scanner init error:', err)
        setError(
          'Camera access denied. Please allow camera permissions or use manual code entry.'
        )
      }
    }

    initScanner()

    return () => {
      if (html5QrCode && typeof (html5QrCode as { isScanning: boolean }).isScanning !== 'undefined' && (html5QrCode as { isScanning: boolean }).isScanning) {
        (html5QrCode as { stop: () => Promise<void> }).stop().catch(console.error)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="text-center">
          <div className="w-16 h-16 bg-oak-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
              <path d="M1 1l22 22M17 17h2a2 2 0 002-2V5a2 2 0 00-2-2H7" />
              <path d="M10.66 5H5a2 2 0 00-2 2v10a2 2 0 002 2h8" />
            </svg>
          </div>
          <p className="text-sm text-oak-text-muted">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div
        ref={scannerRef}
        className="bg-oak-gray-700 rounded-2xl overflow-hidden relative"
        style={{ minHeight: '300px' }}
      >
        <div id="qr-scanner-element" className="w-full" />
        
        {!isStarted && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white/60">
              <svg className="animate-spin h-8 w-8 mx-auto mb-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-sm">Starting camera...</p>
            </div>
          </div>
        )}

        {/* Corner markers */}
        <div className="scanner-corner top-left" />
        <div className="scanner-corner top-right" />
        <div className="scanner-corner bottom-left" />
        <div className="scanner-corner bottom-right" />
      </div>

      {/* Helper text */}
      <p className="text-center text-oak-text-muted text-xs mt-3">
        Position QR code within the frame
      </p>

      {isProcessing && (
        <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
          <div className="bg-white rounded-xl px-6 py-3 flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-oak-navy" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-sm font-medium">Processing...</span>
          </div>
        </div>
      )}

      {/* Camera tip */}
      <div className="flex items-center gap-2 mt-2 bg-oak-gray-100 rounded-xl px-4 py-2.5">
        <span className="text-base">📸</span>
        <span className="text-xs text-oak-text-muted">
          Hold camera steady · Auto-scans in 1–2 seconds
        </span>
      </div>
    </div>
  )
}
