'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Partner } from '@/lib/types'

interface PartnerDetailViewProps {
  partner: Partner
}

export default function PartnerDetailView({ partner }: PartnerDetailViewProps) {
  const [isMessageOpen, setIsMessageOpen] = useState(false)
  const [messageText, setMessageText] = useState('')
  const [isSent, setIsSent] = useState(false)

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim()) return
    setIsSent(true)
    setTimeout(() => {
      setIsSent(false)
      setIsMessageOpen(false)
      setMessageText('')
    }, 1800)
  }

  const acronym =
    partner.acronym ||
    partner.name
      .split(' ')
      .map((w) => w[0])
      .slice(0, 3)
      .join('')
      .toUpperCase()

  const contactInitials =
    partner.contact_initials ||
    partner.contact_name
      ?.split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase() ||
    'MS'

  return (
    <div className="w-full flex flex-col items-center px-4 pt-3 pb-24">
      <div className="w-[370px] max-w-full">
        {/* ─── Back Navigation ─── */}
        <Link
          href="/partners"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#162E55] mb-4 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Partner Directory</span>
        </Link>

        {/* ─── Hero Card ─── */}
        <div className="bg-[#182C50] rounded-[26px] p-5 shadow-sm text-white">
          <div className="flex items-start gap-3.5">
            {/* Squircle logo */}
            <div className="w-16 h-16 rounded-2xl bg-[#374C70] text-white flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-inner">
              {acronym}
            </div>

            {/* Header info */}
            <div className="flex-1 min-w-0 pt-0.5">
              <p className="text-[10px] font-bold tracking-wider text-white/70 uppercase truncate">
                {partner.category || 'FOUNDATION'} · PARTNER SINCE {partner.since_year || '2018'}
              </p>
              <h1 className="text-[21px] font-black text-white leading-tight mt-1">
                {partner.name}
              </h1>
            </div>
          </div>

          {/* Tag pills */}
          {partner.tags && partner.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-0.5">
              {partner.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-[#2B3F63] text-white/95 text-xs px-3.5 py-1.5 rounded-full font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ─── ABOUT Card ─── */}
        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100/80 mt-3.5">
          <h2 className="text-[11px] font-bold text-[#64748B] tracking-wider uppercase mb-2">
            ABOUT
          </h2>
          <p className="text-sm text-[#334155] leading-relaxed font-normal">
            {partner.description ||
              `${partner.name} builds vibrant and tolerant civil society initiatives. OAK partnership covers sustainable programming and community resilience.`}
          </p>
        </div>

        {/* ─── CONTACT AT CONVENING Card ─── */}
        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100/80 mt-3.5">
          <h2 className="text-[11px] font-bold text-[#64748B] tracking-wider uppercase mb-3">
            CONTACT AT CONVENING
          </h2>
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-[#162E55] text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm">
              {contactInitials}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-[15px] text-[#0F172A] leading-tight">
                {partner.contact_name || 'Maria Schmidt'}
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                {partner.contact_email || 'm.schmidt@osf.org'}
              </p>
            </div>
          </div>
        </div>

        {/* ─── Action 1: Visit Website ─── */}
        {partner.website_url && (
          <a
            href={partner.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#162E55] text-white font-bold text-sm rounded-[20px] py-4 px-5 flex items-center justify-between shadow-sm hover:bg-[#1C3663] transition-colors mt-3.5 cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10z" />
              </svg>
              <span>Visit Website</span>
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        )}

        {/* ─── Action 2: Send Message ─── */}
        <button
          type="button"
          onClick={() => setIsMessageOpen(true)}
          className="w-full bg-white text-[#0F172A] font-bold text-sm rounded-[20px] py-4 px-5 flex items-center justify-between shadow-sm border border-slate-100/80 hover:bg-slate-50 transition-colors mt-3 cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            <span>Send Message</span>
          </div>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#64748B"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* ─── Send Message Modal / Sheet ─── */}
      {isMessageOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div
            className="w-[370px] max-w-full bg-white rounded-[26px] p-6 shadow-xl relative animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsMessageOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
              aria-label="Close"
            >
              ✕
            </button>

            <h3 className="text-base font-bold text-[#0F172A] mb-1">
              Send Message
            </h3>
            <p className="text-xs text-[#64748B] mb-4">
              To <span className="font-semibold text-slate-900">{partner.contact_name}</span> ({partner.name})
            </p>

            {isSent ? (
              <div className="py-8 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h4 className="font-bold text-sm text-[#0F172A]">Message Sent!</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Delivered to {partner.contact_email}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage}>
                <div className="mb-3.5">
                  <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block mb-1.5">
                    Your Note or Query
                  </label>
                  <textarea
                    rows={4}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message here..."
                    className="w-full bg-[#EEF2F6] text-[#0F172A] placeholder:text-[#94A3B8] text-xs rounded-xl p-3.5 focus:outline-none focus:ring-1 focus:ring-[#162E55]/30 resize-none"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#162E55] text-white text-xs font-bold text-center hover:bg-[#1C3663] transition-colors shadow-sm cursor-pointer"
                  >
                    Send Message
                  </button>
                  {partner.contact_email && (
                    <a
                      href={`mailto:${partner.contact_email}?subject=OAK%20Partner%20Convening%202026%20-%20Connection`}
                      className="w-full py-2.5 rounded-xl bg-slate-100 text-[#0F172A] text-xs font-semibold text-center hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      Open in Email App
                    </a>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
