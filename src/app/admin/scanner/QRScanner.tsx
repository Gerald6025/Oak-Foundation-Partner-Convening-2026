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
        className="bg-[#0F1A2E] rounded-[26px] overflow-hidden relative shadow-md flex flex-col items-center justify-center text-center"
        style={{ minHeight: '320px' }}
      >
        <div id="qr-scanner-element" className="w-full" />
        
        {!isStarted && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0F1A2E]/90 z-10">
            <div className="text-center text-white/70">
              <svg className="animate-spin h-7 w-7 mx-auto mb-2 text-white/80" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-xs font-medium">Initializing camera...</p>
            </div>
          </div>
        )}

        {/* Viewfinder frame corners */}
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-8 z-10">
          <div className="relative w-56 h-56 flex flex-col items-center justify-center">
            {/* Top-left corner */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/90 rounded-tl-xl" />
            {/* Top-right corner */}
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/90 rounded-tr-xl" />
            {/* Bottom-left corner */}
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/90 rounded-bl-xl" />
            {/* Bottom-right corner */}
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/90 rounded-br-xl" />

            {/* Position QR code helper text */}
            <p className="text-center text-white/50 text-xs font-normal tracking-wide px-4">
              Position QR code within the frame
            </p>
          </div>
        </div>

        {/* Bottom indicator within scanner card */}
        <div className="w-full bg-[#0B1322]/90 border-t border-white/5 py-3 px-4 flex items-center justify-center gap-2 z-20 mt-auto">
          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/70">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7V5a2 2 0 0 1 2-2h2" />
              <path d="M17 3h2a2 2 0 0 1 2 2v2" />
              <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
              <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
            </svg>
          </div>
          <span className="text-[11px] text-white/60 font-medium">
            Hold camera steady · Auto-scans in 1–2 seconds
          </span>
        </div>
      </div>

      {isProcessing && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs rounded-[26px] flex items-center justify-center z-30 animate-fade-in">
          <div className="bg-white rounded-2xl px-6 py-3.5 flex items-center gap-3 shadow-xl">
            <svg className="animate-spin h-5 w-5 text-[#162E55]" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-xs font-bold text-[#0F172A]">Verifying Code...</span>
          </div>
        </div>
      )}
    </div>
  )
}
