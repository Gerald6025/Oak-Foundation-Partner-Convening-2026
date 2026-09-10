'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { QRCodeSVG } from 'qrcode.react'

interface PassViewProps {
  attendee: {
    id: string
    first_name: string
    last_name: string
    full_name: string
    organization: string
    role: string
    email: string
    qr_code_token: string
    created_at?: string
  }
}

export default function PassView({ attendee }: PassViewProps) {
  const qrRef = useRef<HTMLDivElement>(null)
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const resendEmail = async () => {
    setEmailStatus('sending')
    try {
      const res = await fetch('/api/email/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: attendee.id }),
      })
      if (res.ok) {
        setEmailStatus('sent')
        setTimeout(() => setEmailStatus('idle'), 4000)
      } else {
        setEmailStatus('error')
      }
    } catch {
      setEmailStatus('error')
    }
  }

  const qrToken = attendee.qr_code_token || `OAK-2026-${(attendee.id || 'PASS').slice(0, 8).toUpperCase()}`

  const downloadQR = () => {
    const svg = qrRef.current?.querySelector('svg')
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      canvas.width = 400
      canvas.height = 400
      if (ctx) {
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, 400, 400)
        ctx.drawImage(img, 20, 20, 360, 360)
        const a = document.createElement('a')
        a.download = `${qrToken}.png`
        a.href = canvas.toDataURL('image/png')
        a.click()
      }
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  return (
    <div className="w-full flex flex-col items-center px-4 pt-3 pb-24">
      {/* ─── 1. Success Banner ─── */}
      <div className="w-[370px] max-w-full bg-gradient-to-b from-[#1C3663] to-[#142646] rounded-[26px] p-5 shadow-md flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-[16px] bg-white/10 flex items-center justify-center flex-shrink-0">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </div>
        <div>
          <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider">
            REGISTRATION COMPLETE
          </p>
          <h1 className="text-white text-[21px] font-bold leading-tight mt-0.5">
            You&apos;re Registered, {attendee.first_name}!
          </h1>
          <p className="text-white/60 text-xs mt-1">
            {attendee.organization}
          </p>
        </div>
      </div>

      {/* ─── 2. Entry Pass Card ─── */}
      <div className="w-[370px] max-w-full bg-white rounded-[26px] p-6 shadow-sm border border-slate-100/80 text-center mt-3.5">
        <h2 className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-4">
          YOUR ENTRY PASS
        </h2>

        {/* QR Code Container */}
        <div ref={qrRef} className="inline-flex justify-center items-center p-5 sm:p-6 bg-[#EEF2F6] rounded-[24px]">
          <QRCodeSVG
            value={qrToken}
            size={180}
            level="H"
            fgColor="#162E55"
            bgColor="#EEF2F6"
            includeMargin={false}
          />
        </div>

        {/* Token Display */}
        <p className="text-[12px] font-mono tracking-widest text-[#64748B] font-semibold mt-4">
          {qrToken}
        </p>
        <p className="text-[10px] text-[#94A3B8] mt-1">
          Present at event entrance for check-in
        </p>
      </div>

      {/* ─── 3. Registration Details Card ─── */}
      <div className="w-[370px] max-w-full bg-white rounded-[26px] p-5 shadow-sm border border-slate-100/80 mt-3.5">
        <h2 className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-3">
          REGISTRATION DETAILS
        </h2>
        <div>
          <DetailRow label="Name" value={attendee.full_name || `${attendee.first_name} ${attendee.last_name}`} />
          <DetailRow label="Organisation" value={attendee.organization} />
          <DetailRow label="Role" value={attendee.role} />
        </div>
      </div>

      {/* ─── 4. Confirmation Email Notice ─── */}
      <div className="w-[370px] max-w-full bg-[#F0FDF4] border border-[#BBF7D0] rounded-[22px] p-4 mt-3.5 flex items-start gap-3 text-left shadow-xs">
        <div className="w-7 h-7 rounded-full bg-[#22C55E]/15 text-[#15803D] flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">
          ✓
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-bold text-[#15803D]">
              Confirmation Email Sent
            </p>
            <button
              onClick={resendEmail}
              disabled={emailStatus === 'sending'}
              className="text-[11px] font-bold text-[#1E3A68] hover:underline cursor-pointer disabled:opacity-50"
            >
              {emailStatus === 'sending' ? 'Sending...' : emailStatus === 'sent' ? 'Resent ✓' : 'Resend Email'}
            </button>
          </div>
          <p className="text-[11px] text-[#166534] mt-1 leading-relaxed break-all">
            Registration details &amp; downloadable QR code sent to <strong>{attendee.email}</strong>
          </p>
        </div>
      </div>

      {/* ─── 5. Action Button ─── */}
      <button
        onClick={downloadQR}
        className="w-[370px] max-w-full bg-[#1E3A68] hover:bg-[#162E55] text-white py-3.5 rounded-[16px] font-bold text-sm tracking-wide shadow-md shadow-[#162E55]/20 flex items-center justify-center gap-2 mt-4 active:scale-[0.99] transition-all cursor-pointer"
        id="download-qr-btn"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Download QR Code
      </button>

      {/* ─── 5. Secondary Action ─── */}
      <Link
        href="/register"
        className="flex items-center justify-center gap-1.5 text-xs text-[#64748B] hover:text-[#162E55] transition-colors mt-3 pb-2 font-medium"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
        Register another attendee
      </Link>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100/80 last:border-0">
      <span className="text-xs text-[#64748B]">{label}</span>
      <span className="text-xs font-bold text-[#0F172A] text-right">{value}</span>
    </div>
  )
}
