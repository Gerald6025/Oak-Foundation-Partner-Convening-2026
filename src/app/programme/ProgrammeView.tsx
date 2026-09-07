'use client'

import { useState } from 'react'
import PhotoGallery from '@/components/gallery/PhotoGallery'

interface SessionItem {
  id: string
  day: number
  startTime: string
  endTime: string
  title: string
  speaker?: string
  location?: string
  type: 'plenary' | 'breakout' | 'workshop' | 'social'
  description?: string
  isFeatured?: boolean
}

type TimelineEntry =
  | { kind: 'milestone'; time: string; label: string }
  | { kind: 'session'; session: SessionItem }

const day1Timeline: TimelineEntry[] = [
  { kind: 'milestone', time: '08:00', label: 'Registration & Welcome Coffee' },
  { kind: 'milestone', time: '10:30', label: 'Coffee Break' },
  {
    kind: 'session',
    session: {
      id: 'd1-2',
      day: 1,
      startTime: '10:50',
      endTime: '12:00',
      title: 'Thematic Dialogue: Climate Justice & Grantmaking',
      speaker: 'Samuel Okafor · Africa Climate Alliance',
      location: 'Conference Room B2',
      type: 'breakout',
      description: 'Interactive discussion exploring the intersection of climate resilience and grassroots grantmaking models across East and Southern Africa.',
    },
  },
  {
    kind: 'session',
    session: {
      id: 'd1-3',
      day: 1,
      startTime: '10:50',
      endTime: '12:00',
      title: 'Workshop: Measuring Long-term Change',
      speaker: 'Dr. Ingrid Holm · Nordic Evaluation Centre',
      location: 'Workshop Room C',
      type: 'workshop',
      description: 'Practical tools and participatory metrics for tracking systemic shifts in community empowerment and youth-led initiatives.',
    },
  },
  { kind: 'milestone', time: '12:00', label: 'Networking Lunch' },
  {
    kind: 'session',
    session: {
      id: 'd1-4',
      day: 1,
      startTime: '13:30',
      endTime: '14:30',
      title: 'Partner Spotlight: Rights-Based Approaches',
      speaker: 'Fatima Zahra Benali · MENA Rights Group',
      location: 'Main Hall A',
      type: 'plenary',
      description: 'Case studies demonstrating rights-based strategies in underrepresented regions, highlighting partner synergies.',
    },
  },
  {
    kind: 'session',
    session: {
      id: 'd1-5',
      day: 1,
      startTime: '14:45',
      endTime: '16:00',
      title: 'Digital Rights in Authoritarian Contexts',
      speaker: 'Li Wei · Digital Frontiers Institute',
      location: 'Conference Room B1',
      type: 'breakout',
      description: 'Navigating digital security, secure communication, and cross-border digital solidarity for civic activists.',
    },
  },
  {
    kind: 'session',
    session: {
      id: 'd1-6',
      day: 1,
      startTime: '18:00',
      endTime: '20:00',
      title: 'Welcome Reception & Dinner',
      location: 'Rooftop Terrace',
      type: 'social',
      description: 'An informal evening gathering to connect with fellow partners, department heads, and the OAK leadership team.',
    },
  },
]

const day2Timeline: TimelineEntry[] = [
  { kind: 'milestone', time: '08:30', label: 'Morning Coffee & Networking' },
  {
    kind: 'session',
    session: {
      id: 'd2-1',
      day: 2,
      startTime: '09:00',
      endTime: '10:30',
      title: 'Plenary: Community-Driven Innovations',
      speaker: 'Amina Diallo · Sahel Resilience Lab',
      location: 'Main Hall A',
      type: 'plenary',
      description: 'Showcasing grassroots-led models that leverage local technology and indigenous knowledge systems.',
    },
  },
  { kind: 'milestone', time: '10:30', label: 'Tea & Refreshments' },
  {
    kind: 'session',
    session: {
      id: 'd2-2',
      day: 2,
      startTime: '11:00',
      endTime: '12:30',
      title: 'Workshop: Agile Program Monitoring',
      speaker: 'Kudzai Moyo · Uncommon.org',
      location: 'Workshop Room A',
      type: 'workshop',
      description: 'Hands-on session using low-code digital dashboards for real-time grant performance monitoring.',
    },
  },
  { kind: 'milestone', time: '12:30', label: 'Buffet Lunch' },
  {
    kind: 'session',
    session: {
      id: 'd2-3',
      day: 2,
      startTime: '14:00',
      endTime: '15:30',
      title: 'Roundtable: Cross-Sector Collaboration',
      speaker: 'Partner Consortium Panel',
      location: 'Conference Room B1',
      type: 'breakout',
      description: 'Deep-dive into multi-stakeholder partnerships and pooled funding mechanisms.',
    },
  },
  {
    kind: 'session',
    session: {
      id: 'd2-4',
      day: 2,
      startTime: '17:00',
      endTime: '19:00',
      title: 'Cultural Exchange & Showcase',
      location: 'Garden Pavilion',
      type: 'social',
      description: 'Music, performance, and networking celebrating partner diversity.',
    },
  },
]

const day3Timeline: TimelineEntry[] = [
  { kind: 'milestone', time: '08:30', label: 'Morning Coffee' },
  {
    kind: 'session',
    session: {
      id: 'd3-1',
      day: 3,
      startTime: '09:00',
      endTime: '10:30',
      title: 'Strategy Plenary: Future Outlook 2026–2030',
      speaker: 'OAK Executive Leadership',
      location: 'Main Hall A',
      type: 'plenary',
      description: 'Strategic vision presentation on emerging priority regions and grant opportunities.',
    },
  },
  { kind: 'milestone', time: '10:30', label: 'Tea Break' },
  {
    kind: 'session',
    session: {
      id: 'd3-2',
      day: 3,
      startTime: '11:00',
      endTime: '12:30',
      title: 'Closing Plenary & Partner Commitments',
      speaker: 'Elisha Urombo & Beyond Bechani',
      location: 'Main Hall A',
      type: 'plenary',
      description: 'Synthesizing recommendations from all breakout sessions into actionable 2026 partner goals.',
    },
  },
  { kind: 'milestone', time: '12:30', label: 'Farewell Luncheon' },
]

const timelinesByDay: Record<number, TimelineEntry[]> = {
  1: day1Timeline,
  2: day2Timeline,
  3: day3Timeline,
}

const featuredByDay: Record<number, { title: string; time: string; speaker: string; location: string } | null> = {
  1: {
    title: 'Opening Plenary: Pathways to Impact',
    time: '09:00 - 10:30',
    speaker: 'Dr. Helena Moreau · OAK Foundation',
    location: 'Main Hall A',
  },
  2: {
    title: 'Plenary: Community-Driven Innovations',
    time: '09:00 - 10:30',
    speaker: 'Amina Diallo · Sahel Resilience Lab',
    location: 'Main Hall A',
  },
  3: {
    title: 'Strategy Plenary: Future Outlook 2026–2030',
    time: '09:00 - 10:30',
    speaker: 'OAK Executive Leadership',
    location: 'Main Hall A',
  },
}

const badgeStyles = {
  plenary: {
    bg: 'bg-[#E0E7FF]',
    text: 'text-[#3730A3]',
    dot: 'bg-[#4338CA]',
    label: 'Plenary',
  },
  breakout: {
    bg: 'bg-[#FEF3C7]',
    text: 'text-[#92400E]',
    dot: 'bg-[#D97706]',
    label: 'Breakout',
  },
  workshop: {
    bg: 'bg-[#F3E8FF]',
    text: 'text-[#6B21A8]',
    dot: 'bg-[#9333EA]',
    label: 'Workshop',
  },
  social: {
    bg: 'bg-[#FFEDD5]',
    text: 'text-[#9A3412]',
    dot: 'bg-[#EA580C]',
    label: 'Social',
  },
}

interface NoteItem {
  id: string
  initials: string
  name: string
  org: string
  timeTag: string
  text: string
}

const defaultNotes: NoteItem[] = [
  {
    id: 'note-1',
    initials: 'MS',
    name: 'Maria Schmidt',
    org: 'Open Society Foundations',
    timeTag: 'Day 1 · 14:32',
    text: 'The rights-based approaches session surfaced strong demand for a shared learning platform. OSF will follow up with MENA Rights Group on joint programming opportunities in the Mediterranean region.',
  },
  {
    id: 'note-2',
    initials: 'JO',
    name: 'James Ochiambo',
    org: 'OAK Foundation',
    timeTag: 'Day 1 · 16:50',
    text: 'Digital Rights breakout: participants want a working group to share tools for operating in restricted digital environments. Interested orgs: Digital Frontiers, Access Now, EFF.',
  },
  {
    id: 'note-3',
    initials: 'AD',
    name: 'Awa Diallo',
    org: 'Geneva Secretariat',
    timeTag: 'Day 2 · 11:15',
    text: "Strategic communications workshop highly rated. Rashida's adaptive messaging framework is directly applicable across 60% of the portfolio. Requesting follow-up toolkit.",
  },
  {
    id: 'note-4',
    initials: 'FK',
    name: 'Fungai Kupe',
    org: 'Southern Africa Trust',
    timeTag: 'Day 2 · 15:40',
    text: 'Fishbowl revealed consensus: philanthropy needs to accept longer time horizons (10+ years) and better share learning. Key ask: OAK to publish failure cases alongside success stories.',
  },
]

const keyTakeaways = [
  'Philanthropy needs to accept 10+ year time horizons for systemic change',
  'Shared learning infrastructure is the most requested resource across the portfolio',
  'Digital rights must be integrated into all programme areas, not siloed',
  'Rights-based framing significantly improves grantee advocacy effectiveness',
  'Peer exchange is rated more valuable than expert-led sessions (92% vs 74%)',
]

const resourcesList = [
  {
    id: 'res-1',
    title: 'Opening Plenary Presentation',
    type: 'PDF · 3.2 MB · Day 1',
  },
  {
    id: 'res-2',
    title: 'OAK Portfolio Overview 2024-26',
    type: 'PDF · 1.8 MB · Day 2',
  },
  {
    id: 'res-3',
    title: 'Action Planning Workbook',
    type: 'DOCX · 2.5 MB · Day 3',
  },
  {
    id: 'res-4',
    title: 'Partner Contact Directory',
    type: 'XLSX · 5.4 MB · All Days',
  },
  {
    id: 'res-5',
    title: 'Photo Gallery (High Res)',
    type: 'ZIP · 184 MB · All Days',
  },
]

export default function ProgrammeView() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'docs'>('schedule')
  const [activeDay, setActiveDay] = useState(1)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Notes state
  const [notes, setNotes] = useState<NoteItem[]>(defaultNotes)
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [noteAuthor, setNoteAuthor] = useState('')
  const [noteOrg, setNoteOrg] = useState('')
  const [noteContent, setNoteContent] = useState('')

  // Download notification toast
  const [downloadToast, setDownloadToast] = useState<string | null>(null)

  const days = [
    { day: 1, dow: 'MON', title: 'Day 1', date: '9 Nov' },
    { day: 2, dow: 'TUE', title: 'Day 2', date: '10 Nov' },
    { day: 3, dow: 'WED', title: 'Day 3', date: '11 Nov' },
  ]

  const featured = featuredByDay[activeDay]
  const timeline = timelinesByDay[activeDay] || []

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!noteContent.trim() || !noteAuthor.trim()) return

    const nameParts = noteAuthor.trim().split(' ')
    const initials =
      nameParts.length > 1
        ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
        : noteAuthor.slice(0, 2).toUpperCase()

    const newNote: NoteItem = {
      id: 'note-' + Date.now(),
      initials,
      name: noteAuthor.trim(),
      org: noteOrg.trim() || 'Partner Organization',
      timeTag: `Day ${activeDay} · Just now`,
      text: noteContent.trim(),
    }

    setNotes([newNote, ...notes])
    setNoteAuthor('')
    setNoteOrg('')
    setNoteContent('')
    setIsAddingNote(false)
  }

  const triggerDownload = (title: string) => {
    setDownloadToast(`Downloading ${title}...`)
    setTimeout(() => {
      setDownloadToast(null)
    }, 2500)
  }

  return (
    <div className="w-full flex flex-col items-center px-4 pt-3 pb-24">
      <div className="w-[370px] max-w-full">
        {/* ─── Page Title ─── */}
        <h1 className="text-[26px] font-black text-[#0F172A] leading-tight">
          Programme
        </h1>
        <p className="text-xs text-[#64748B] mt-0.5 font-normal">
          OAK Partner Convening 2026
        </p>

        {/* ─── Segmented Control: Schedule vs Docs ─── */}
        <div className="bg-[#EEF2F6] rounded-2xl p-1 flex items-center mt-3.5 shadow-inner">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex-1 py-1.5 text-center text-xs tracking-wide transition-all rounded-xl cursor-pointer ${
              activeTab === 'schedule'
                ? 'bg-white text-[#0F172A] font-bold shadow-sm'
                : 'text-[#64748B] font-medium hover:text-[#0F172A]'
            }`}
          >
            Schedule
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`flex-1 py-1.5 text-center text-xs tracking-wide transition-all rounded-xl cursor-pointer ${
              activeTab === 'docs'
                ? 'bg-white text-[#0F172A] font-bold shadow-sm'
                : 'text-[#64748B] font-medium hover:text-[#0F172A]'
            }`}
          >
            Docs
          </button>
        </div>

        {activeTab === 'schedule' ? (
          <>
            {/* ─── Day Selector Cards ─── */}
            <div className="grid grid-cols-3 gap-2.5 mt-3.5">
              {days.map((d) => {
                const isActive = activeDay === d.day
                return (
                  <button
                    key={d.day}
                    onClick={() => {
                      setActiveDay(d.day)
                      setExpandedId(null)
                    }}
                    className={`rounded-[20px] p-3.5 text-left transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#162E55] text-white shadow-md'
                        : 'bg-white text-[#0F172A] border border-slate-100/80 shadow-sm hover:border-slate-200'
                    }`}
                  >
                    <div className={`text-[10px] uppercase font-bold tracking-wider ${isActive ? 'text-white/60' : 'text-[#64748B]'}`}>
                      {d.dow}
                    </div>
                    <div className={`text-[16px] font-black leading-tight mt-0.5 ${isActive ? 'text-white' : 'text-[#0F172A]'}`}>
                      {d.title}
                    </div>
                    <div className={`text-[11px] font-normal mt-0.5 ${isActive ? 'text-white/70' : 'text-[#64748B]'}`}>
                      {d.date}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* ─── Featured Session Card ─── */}
            {featured && (
              <div className="rounded-[24px] bg-gradient-to-br from-[#1C3663] to-[#122444] p-5 text-white shadow-md mt-4 relative overflow-hidden">
                <div className="flex items-center gap-2 text-[10px] font-bold text-white/70 uppercase tracking-wider mb-1.5">
                  <span className="text-white text-xs">★</span>
                  <span>FEATURED</span>
                  <span>·</span>
                  <span>{featured.time}</span>
                </div>

                <h2 className="text-[19px] font-extrabold text-white leading-tight tracking-tight">
                  {featured.title}
                </h2>

                <div className="flex items-center gap-2 mt-3 text-xs text-white/75">
                  <span className="w-5 h-5 rounded-full bg-white/15 text-[10px] font-bold flex items-center justify-center text-white flex-shrink-0">
                    {featured.speaker[0]}
                  </span>
                  <span className="truncate">{featured.speaker}</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-white/60 mt-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>{featured.location}</span>
                </div>
              </div>
            )}

            {/* ─── Category Legend ─── */}
            <div className="flex items-center justify-between mt-4 px-1 text-[11px] font-semibold text-[#64748B]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#162E55]" />
                <span>Plenary</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#D97706]" />
                <span>Breakout</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#9333EA]" />
                <span>Workshop</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#EA580C]" />
                <span>Social</span>
              </div>
            </div>

            {/* ─── Timeline / Session Cards ─── */}
            <div className="mt-3.5 space-y-2.5">
              {timeline.map((item, idx) => {
                if (item.kind === 'milestone') {
                  return (
                    <div key={`ms-${idx}`} className="flex items-center gap-2.5 py-1 text-[11px] text-[#64748B]">
                      <span className="font-semibold text-slate-500 w-11 flex-shrink-0">{item.time}</span>
                      <div className="h-px bg-slate-200/90 flex-1" />
                      <span className="font-medium text-slate-500 text-center px-1 text-[11px]">{item.label}</span>
                      <div className="h-px bg-slate-200/90 flex-1" />
                    </div>
                  )
                }

                const s = item.session
                const badge = badgeStyles[s.type] || badgeStyles.plenary
                const isExpanded = expandedId === s.id

                return (
                  <div
                    key={s.id}
                    onClick={() => setExpandedId(isExpanded ? null : s.id)}
                    className="bg-white rounded-[22px] p-4 shadow-sm border border-slate-100/80 cursor-pointer hover:border-slate-200 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="w-12 flex-shrink-0 text-left pt-0.5">
                        <div className="text-sm font-black text-[#0F172A] leading-none">
                          {s.startTime}
                        </div>
                        <div className="text-[10px] text-[#94A3B8] font-medium mt-1">
                          -{s.endTime}
                        </div>
                      </div>

                      <div className="flex-1 pr-1">
                        <h3 className="text-sm font-bold text-[#0F172A] leading-snug">
                          {s.title}
                        </h3>

                        {s.speaker && (
                          <p className="text-xs text-[#64748B] mt-1 font-normal leading-normal">
                            {s.speaker}
                          </p>
                        )}

                        {s.location && (
                          <div className="flex items-center gap-1 text-[11px] text-[#64748B] mt-1">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            <span>{s.location}</span>
                          </div>
                        )}

                        {isExpanded && s.description && (
                          <p className="text-xs text-slate-600 mt-2.5 pt-2 border-t border-slate-100 leading-relaxed animate-fade-in">
                            {s.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0 pt-0.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${badge.bg} ${badge.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          <span>{badge.label}</span>
                        </span>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#94A3B8"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        ) : (
          /* ════════════════════════════════════════════════════════════
             DOCS TAB CONTENT — Matching the Screenshot
             ════════════════════════════════════════════════════════════ */
          <div className="mt-4 space-y-6">
            {/* ─── 1. Session Notes ─── */}
            <div>
              <div className="flex items-center justify-between mb-3 px-0.5">
                <div className="flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                  <h2 className="text-[17px] font-extrabold text-[#0F172A]">
                    Session Notes
                  </h2>
                </div>

                <button
                  onClick={() => setIsAddingNote(true)}
                  className="bg-[#162E55] hover:bg-[#1E3A68] text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                >
                  <span>+</span>
                  <span>Add Note</span>
                </button>
              </div>

              {/* Note Cards List */}
              <div className="space-y-3">
                {notes.map((n) => (
                  <div
                    key={n.id}
                    className="bg-white rounded-[22px] p-4 shadow-sm border border-slate-100/80 transition-all hover:border-slate-200"
                  >
                    {/* Author & Tag Header */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-[#162E55] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                          {n.initials}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[#0F172A] truncate">
                            {n.name}
                          </h4>
                          <p className="text-[10px] text-[#64748B] truncate">
                            {n.org}
                          </p>
                        </div>
                      </div>

                      <span className="bg-[#EEF2F6] text-[#64748B] text-[10px] font-semibold px-2 py-0.5 rounded-md flex-shrink-0">
                        {n.timeTag}
                      </span>
                    </div>

                    {/* Note Body */}
                    <p className="text-xs text-[#334155] leading-relaxed font-normal">
                      {n.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ─── 2. Photo Gallery ─── */}
            <PhotoGallery showUpload={true} showFilters={false} />

            {/* ─── 3. Key Takeaways ─── */}
            <div>
              <div className="flex items-center gap-2 mb-3 px-0.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                  <path d="M9 18h6" />
                  <path d="M10 22h4" />
                </svg>
                <h2 className="text-[17px] font-extrabold text-[#0F172A]">
                  Key Takeaways
                </h2>
              </div>

              <div className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100/80 space-y-3.5">
                {keyTakeaways.map((item, idx) => (
                  <div key={`kt-${idx}`} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#162E55] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-xs text-[#334155] leading-snug font-medium">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ─── 4. Resources ─── */}
            <div>
              <div className="flex items-center gap-2 mb-3 px-0.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <h2 className="text-[17px] font-extrabold text-[#0F172A]">
                  Resources
                </h2>
              </div>

              <div className="space-y-2.5">
                {resourcesList.map((res) => (
                  <div
                    key={res.id}
                    className="bg-white rounded-[20px] p-3.5 shadow-sm border border-slate-100/80 flex items-center justify-between gap-3 hover:border-slate-200 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-[14px] bg-[#EEF2F6] text-[#162E55] flex items-center justify-center flex-shrink-0 font-bold">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xs font-bold text-[#0F172A] truncate">
                          {res.title}
                        </h3>
                        <p className="text-[10px] text-[#64748B] mt-0.5 truncate">
                          {res.type}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => triggerDownload(res.title)}
                      className="text-[#64748B] hover:text-[#162E55] p-2 rounded-lg hover:bg-slate-50 transition-colors flex-shrink-0 cursor-pointer"
                      title="Download resource"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── Add Note Modal ─── */}
      {isAddingNote && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[26px] p-5 w-[370px] max-w-full shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[16px] font-bold text-[#0F172A]">
                Add Session Note
              </h3>
              <button
                onClick={() => setIsAddingNote(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNote} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={noteAuthor}
                  onChange={(e) => setNoteAuthor(e.target.value)}
                  placeholder="e.g. Maria Schmidt"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#EEF2F6] border-0 rounded-[14px] text-xs text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#162E55]/25"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                  Organisation
                </label>
                <input
                  type="text"
                  value={noteOrg}
                  onChange={(e) => setNoteOrg(e.target.value)}
                  placeholder="e.g. Open Society Foundations"
                  className="w-full px-3.5 py-2.5 bg-[#EEF2F6] border-0 rounded-[14px] text-xs text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#162E55]/25"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                  Session Insights / Notes
                </label>
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Share key learnings, takeaways, or partnership opportunities..."
                  rows={3}
                  required
                  className="w-full px-3.5 py-2.5 bg-[#EEF2F6] border-0 rounded-[14px] text-xs text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#162E55]/25 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNote(false)}
                  className="flex-1 py-2.5 rounded-[14px] text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-[14px] text-xs font-bold text-white bg-[#162E55] hover:bg-[#1E3A68] transition-colors cursor-pointer"
                >
                  Publish Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Download Toast ─── */}
      {downloadToast && (
        <div className="fixed bottom-20 z-50 bg-[#162E55] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 animate-slide-up">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          <span>{downloadToast}</span>
        </div>
      )}
    </div>
  )
}
