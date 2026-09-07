'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { Partner } from '@/lib/types'
import { defaultPartners } from '@/lib/partnersData'

const regions = [
  'All Regions',
  'Global',
  'Sub-Saharan Africa',
  'Northern Europe',
  'Middle East & North Africa',
  'Western Europe',
  'Europe',
]

function getTagColor(tag: string): string {
  switch (tag.toLowerCase()) {
    case 'foundation':
      return 'bg-[#EEF2FF] text-[#4F46E5]'
    case 'ngo':
      return 'bg-[#ECFDF5] text-[#059669]'
    case 'research':
      return 'bg-[#F5F3FF] text-[#7C3AED]'
    case 'academic':
      return 'bg-[#F0F9FF] text-[#0284C7]'
    case 'network':
      return 'bg-[#FFFBEB] text-[#D97706]'
    default:
      return 'bg-[#F1F5F9] text-[#475569]'
  }
}

function formatDomain(url: string): string {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`)
    return parsed.hostname.replace(/^www\./, '')
  } catch {
    return url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
  }
}

interface PartnersViewProps {
  initialPartners?: Partner[]
}

export default function PartnersView({ initialPartners }: PartnersViewProps) {
  const partnersList = initialPartners && initialPartners.length > 0 ? initialPartners : defaultPartners

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('All Regions')

  // Sub-partners always displayed in the top section
  const subPartners = useMemo(() => {
    return defaultPartners.filter((p) => p.is_sub_partner)
  }, [])

  // Filtered partners for ALL PARTNERS section
  const filteredPartners = useMemo(() => {
    return partnersList.filter((p) => {
      // Region filter
      if (selectedRegion !== 'All Regions') {
        const matchesRegion =
          p.region?.toLowerCase().includes(selectedRegion.toLowerCase()) ||
          (selectedRegion === 'Global' && p.region?.toLowerCase().includes('global'))
        if (!matchesRegion) return false
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const matchName = p.name.toLowerCase().includes(query)
        const matchAcronym = p.acronym?.toLowerCase().includes(query)
        const matchRegion = p.region?.toLowerCase().includes(query)
        const matchTags = p.tags?.some((t) => t.toLowerCase().includes(query))
        const matchDesc = p.description?.toLowerCase().includes(query)

        return matchName || matchAcronym || matchRegion || matchTags || matchDesc
      }

      return true
    })
  }, [partnersList, selectedRegion, searchQuery])

  return (
    <div className="w-full flex flex-col items-center px-4 pt-3 pb-24">
      <div className="w-[370px] max-w-full">
        {/* ─── Page Title ─── */}
        <h1 className="text-[26px] font-extrabold text-[#0F172A] tracking-tight">
          Partner Directory
        </h1>

        {/* ─── Search & Filters Card ─── */}
        <div className="bg-white rounded-[24px] p-3.5 shadow-sm border border-slate-100/80 mt-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search organisations, focus areas..."
              className="w-full bg-[#EEF2F6] text-[#0F172A] placeholder:text-[#94A3B8] text-xs sm:text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#162E55]/30 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm font-semibold cursor-pointer"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Region Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-3 pb-0.5">
            {regions.map((region) => {
              const isSelected = selectedRegion === region
              return (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#162E55] text-white font-medium shadow-sm'
                      : 'bg-[#EEF2F6] text-[#64748B] font-normal hover:bg-slate-200'
                  }`}
                >
                  {region}
                </button>
              )
            })}
          </div>
        </div>

        {/* ─── SUB-PARTNERS ─── */}
        <div className="mt-5">
          <h2 className="text-[11px] font-bold text-[#64748B] tracking-wider uppercase mb-2.5">
            SUB-PARTNERS
          </h2>
          <div className="grid grid-cols-3 gap-2.5">
            {subPartners.map((sp) => (
              <Link
                key={sp.id}
                href={`/partners/${sp.id}`}
                className="bg-white rounded-[22px] p-3 flex flex-col items-center justify-center text-center shadow-sm border border-slate-100/80 hover:shadow-md hover:border-slate-200 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#162E55] text-white flex items-center justify-center font-bold text-xs mb-2 shadow-sm group-hover:scale-105 transition-transform">
                  {sp.acronym}
                </div>
                <span className="text-xs font-bold text-[#0F172A] leading-tight">
                  {sp.acronym}
                </span>
                <span className="text-[10px] text-[#64748B] mt-0.5 leading-tight line-clamp-1">
                  {sp.region}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* ─── ALL PARTNERS ─── */}
        <div className="mt-6">
          <h2 className="text-[11px] font-bold text-[#64748B] tracking-wider uppercase mb-2.5">
            ALL PARTNERS
          </h2>

          <div className="space-y-3">
            {filteredPartners.map((partner) => {
              const acronym =
                partner.acronym ||
                partner.name
                  .split(' ')
                  .map((w) => w[0])
                  .slice(0, 3)
                  .join('')
                  .toUpperCase()

              return (
                <div
                  key={partner.id}
                  className="bg-white rounded-[22px] p-4 shadow-sm border border-slate-100/80 hover:shadow-md hover:border-slate-200 transition-all"
                >
                  {/* Top content row - clicking navigates to partner page */}
                  <Link
                    href={`/partners/${partner.id}`}
                    className="flex items-start gap-3.5 group cursor-pointer block"
                  >
                    {/* Navy badge */}
                    <div className="w-14 h-14 rounded-2xl bg-[#162E55] text-white flex items-center justify-center font-bold text-base flex-shrink-0 shadow-sm group-hover:scale-102 transition-transform">
                      {acronym}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="font-bold text-[15px] text-[#0F172A] leading-tight truncate group-hover:text-[#162E55] transition-colors">
                          {partner.name}
                        </h3>
                        <div className="text-slate-400 group-hover:text-[#162E55] p-0.5 flex-shrink-0 transition-colors">
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
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </div>
                      </div>

                      <p className="text-xs text-[#64748B] mt-0.5">
                        {partner.region || 'International'}
                      </p>

                      {/* Tag badges */}
                      {partner.tags && partner.tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          {partner.tags.map((tag) => (
                            <span
                              key={tag}
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${getTagColor(
                                tag
                              )}`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Divider & Footer */}
                  <div className="border-t border-slate-100 mt-3.5 pt-3 flex items-center justify-between text-xs">
                    <span className="text-[#94A3B8]">
                      Partner since {partner.since_year || '2019'}
                    </span>

                    {partner.website_url && (
                      <a
                        href={partner.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-[#162E55] flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        <span>{formatDomain(partner.website_url)}</span>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              )
            })}

            {filteredPartners.length === 0 && (
              <div className="text-center py-10 bg-white rounded-[22px] border border-slate-100 p-6 shadow-sm">
                <p className="text-sm text-slate-500 font-medium">
                  No partners match your criteria.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedRegion('All Regions')
                  }}
                  className="mt-3 text-xs text-[#162E55] font-semibold underline cursor-pointer"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
