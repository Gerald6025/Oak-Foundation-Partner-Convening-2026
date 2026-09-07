'use client'

import Image from 'next/image'
import { QRCodeSVG } from 'qrcode.react'

interface PassCardProps {
  attendee: {
    id: string
    full_name: string
    organization: string
    qr_code_token: string
  }
}

export default function PassCard({ attendee }: PassCardProps) {
  return (
    <div className="max-w-lg mx-auto px-4 mt-4 animate-slide-up stagger-2">
      <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
        {/* Event Branding Header */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="bg-oak-navy px-3 py-1.5 rounded-lg flex items-center">
            <Image
              src="/oak-foundation-logo.png"
              alt="Oak Foundation"
              width={90}
              height={32}
              className="h-5 w-auto object-contain"
            />
          </div>
        </div>

        <h2 className="text-xs font-semibold text-oak-text-muted uppercase tracking-wider mb-5">
          Your Entry Pass
        </h2>

        {/* QR Code */}
        <div className="inline-block p-4 bg-white rounded-2xl border-2 border-oak-gray-100">
          <QRCodeSVG
            value={attendee.qr_code_token}
            size={200}
            level="H"
            fgColor="#162E55"
            bgColor="#FFFFFF"
            includeMargin={false}
          />
        </div>

        {/* Token Display */}
        <p className="text-sm font-mono text-oak-text-muted mt-4 tracking-wider">
          {attendee.qr_code_token}
        </p>
        <p className="text-xs text-oak-gray-400 mt-1">
          Present at event entrance for check-in
        </p>
      </div>
    </div>
  )
}
