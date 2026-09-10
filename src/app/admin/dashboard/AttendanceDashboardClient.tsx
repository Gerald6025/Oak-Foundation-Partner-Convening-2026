'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { getInitials } from '@/lib/utils'

export interface AttendeeRecord {
  id: string
  full_name: string
  first_name: string
  last_name: string
  organization: string
  role: string
  email: string
  created_at: string
  qr_code_token?: string
  checked_in: boolean
  check_in_time?: string
}

interface AttendanceDashboardClientProps {
  initialAttendees: AttendeeRecord[]
  initialDayCounts: { day1: number; day2: number; day3: number }
}

const officialRoles = ['Partner', 'OAK Staff', 'Coordination Team', 'Presenter', 'Observer']

export default function AttendanceDashboardClient({
  initialAttendees,
  initialDayCounts,
}: AttendanceDashboardClientProps) {
  const [attendees] = useState<AttendeeRecord[]>(initialAttendees)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('All')
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'checked_in' | 'pending'>('All')
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

  // Presenters have NO right to Attendance page
  if (role === 'Presenter') {
    return (
      <div className="w-full flex flex-col items-center px-4 pt-10 pb-24">
        <div className="w-[370px] max-w-full bg-white rounded-[26px] p-6 text-center shadow-sm border border-slate-100">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3.5 text-2xl border border-amber-200">
            🔒
          </div>
          <h1 className="text-lg font-black text-[#0F172A]">
            Attendance Access Restricted
          </h1>
          <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
            The Attendance Dashboard is restricted to members of the <strong>Coordination Team</strong>. As a <strong>Presenter</strong>, your privileges include access to the Programme and Partner directory.
          </p>
          <a
            href="/programme"
            className="mt-5 inline-block w-full bg-[#162E55] hover:bg-[#1E3A68] text-white py-3.5 rounded-[16px] font-bold text-xs shadow-md shadow-[#162E55]/20 transition-all text-center"
          >
            Go to Programme
          </a>
        </div>
      </div>
    )
  }

  // Overall Statistics
  const totalRegistered = attendees.length
  const totalAttendees = attendees.filter((a) => a.checked_in).length
  const attendanceRate =
    totalRegistered > 0 ? Math.round((totalAttendees / totalRegistered) * 100) : 0

  // Role Breakdown
  const roleCounts = useMemo(() => {
    const counts: Record<string, { total: number; checkedIn: number }> = {
      Partner: { total: 0, checkedIn: 0 },
      'OAK Staff': { total: 0, checkedIn: 0 },
      'Coordination Team': { total: 0, checkedIn: 0 },
      Presenter: { total: 0, checkedIn: 0 },
      Observer: { total: 0, checkedIn: 0 },
    }

    attendees.forEach((att) => {
      // Normalize role match
      const matchedRole =
        officialRoles.find((r) => r.toLowerCase() === att.role?.toLowerCase()) || 'Partner'
      if (!counts[matchedRole]) {
        counts[matchedRole] = { total: 0, checkedIn: 0 }
      }
      counts[matchedRole].total += 1
      if (att.checked_in) {
        counts[matchedRole].checkedIn += 1
      }
    })

    return counts
  }, [attendees])

  // Filtered participants
  const filteredAttendees = useMemo(() => {
    return attendees.filter((att) => {
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchesName = att.full_name?.toLowerCase().includes(q)
        const matchesOrg = att.organization?.toLowerCase().includes(q)
        const matchesEmail = att.email?.toLowerCase().includes(q)
        if (!matchesName && !matchesOrg && !matchesEmail) return false
      }

      // Role filter
      if (selectedRole !== 'All') {
        if (att.role?.toLowerCase() !== selectedRole.toLowerCase()) return false
      }

      // Attendance status filter
      if (selectedStatus === 'checked_in' && !att.checked_in) return false
      if (selectedStatus === 'pending' && att.checked_in) return false

      return true
    })
  }, [attendees, searchQuery, selectedRole, selectedStatus])

  return (
    <div className="w-full flex flex-col items-center px-4 pt-3 pb-24">
      <div className="w-[370px] max-w-full">
        {/* ─── Page Title ─── */}
        <div className="flex items-center justify-between pt-2 pb-3.5">
          <div>
            <h1 className="text-[26px] font-black text-[#0F172A] leading-tight">
              Attendance
            </h1>
            <p className="text-xs text-[#64748B] mt-0.5 font-normal">
              Live registration & check-in statistics
            </p>
          </div>
          <Link
            href="/admin/scanner"
            className="bg-[#1E3A68] hover:bg-[#162E55] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M3 7V5a2 2 0 0 1 2-2h2" />
              <path d="M17 3h2a2 2 0 0 1 2 2v2" />
              <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
              <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
            </svg>
            <span>Scan QR</span>
          </Link>
        </div>

        {/* ─── 1. Dashboard Statistics Cards (PDF Section 6) ─── */}
        <div className="bg-white rounded-[26px] p-5 shadow-sm border border-slate-100/80">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#EEF2F6] rounded-[20px] p-4 text-center">
              <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                Total Attendees
              </p>
              <p className="text-3xl font-black text-[#162E55] mt-1">
                {totalAttendees}
              </p>
              <p className="text-[10px] text-emerald-600 font-bold mt-0.5">
                Checked in
              </p>
            </div>

            <div className="bg-[#EEF2F6] rounded-[20px] p-4 text-center">
              <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                Total Registered
              </p>
              <p className="text-3xl font-black text-[#0F172A] mt-1">
                {totalRegistered}
              </p>
              <p className="text-[10px] text-[#64748B] font-medium mt-0.5">
                All roles
              </p>
            </div>
          </div>

          {/* Attendance Percentage Progress */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-[#64748B] text-[11px]">ATTENDANCE PERCENTAGE</span>
              <span className="text-[#162E55] text-sm font-black">{attendanceRate}%</span>
            </div>
            <div className="w-full bg-[#E2E8F0] rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-[#1E3A68] h-2.5 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${attendanceRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* ─── 2. Day Breakdown Row ─── */}
        <div className="grid grid-cols-3 gap-2.5 mt-3.5">
          <div className="bg-white rounded-[20px] p-3 text-center shadow-sm border border-slate-100/80">
            <p className="text-[10px] font-bold text-[#64748B] uppercase">DAY 1</p>
            <p className="text-xl font-black text-[#162E55] mt-0.5">{initialDayCounts.day1}</p>
            <p className="text-[10px] text-[#94A3B8]">9 Nov</p>
          </div>
          <div className="bg-white rounded-[20px] p-3 text-center shadow-sm border border-slate-100/80">
            <p className="text-[10px] font-bold text-[#64748B] uppercase">DAY 2</p>
            <p className="text-xl font-black text-[#162E55] mt-0.5">{initialDayCounts.day2}</p>
            <p className="text-[10px] text-[#94A3B8]">10 Nov</p>
          </div>
          <div className="bg-white rounded-[20px] p-3 text-center shadow-sm border border-slate-100/80">
            <p className="text-[10px] font-bold text-[#64748B] uppercase">DAY 3</p>
            <p className="text-xl font-black text-[#162E55] mt-0.5">{initialDayCounts.day3}</p>
            <p className="text-[10px] text-[#94A3B8]">11 Nov</p>
          </div>
        </div>

        {/* ─── 3. Role Breakdown (PDF Section 6: Partners, OAK Staff, Coordination Team, Presenters, Observers) ─── */}
        <div className="bg-white rounded-[26px] p-5 shadow-sm border border-slate-100/80 mt-3.5">
          <h2 className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-3">
            Role Breakdown
          </h2>
          <div className="space-y-2.5">
            {officialRoles.map((role) => {
              const data = roleCounts[role] || { total: 0, checkedIn: 0 }
              const rate = data.total > 0 ? Math.round((data.checkedIn / data.total) * 100) : 0
              return (
                <div
                  key={role}
                  className="flex items-center justify-between p-2.5 rounded-[16px] bg-[#EEF2F6]/60 border border-slate-100"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-bold text-[#0F172A] truncate">{role}</p>
                    <p className="text-[10px] text-[#64748B]">
                      {data.checkedIn} checked in / {data.total} registered
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs font-black text-[#162E55]">{data.total}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#64748B] border border-slate-200">
                      {rate}%
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ─── 4. Participant List & Search/Filters (PDF Section 6) ─── */}
        <div className="bg-white rounded-[26px] p-5 shadow-sm border border-slate-100/80 mt-3.5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              Participant List ({filteredAttendees.length})
            </h2>
          </div>

          {/* Search Box */}
          <div className="relative mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, organisation, email..."
              className="w-full px-3.5 py-2.5 bg-[#EEF2F6] border-0 rounded-[14px] text-xs text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#162E55]/25 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Role Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2">
            <button
              onClick={() => setSelectedRole('All')}
              className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedRole === 'All'
                  ? 'bg-[#162E55] text-white'
                  : 'bg-[#EEF2F6] text-[#64748B] hover:bg-slate-200'
              }`}
            >
              All Roles
            </button>
            {officialRoles.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRole(r)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedRole === r
                    ? 'bg-[#162E55] text-white'
                    : 'bg-[#EEF2F6] text-[#64748B] hover:bg-slate-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center gap-1.5 mt-1 pb-3 border-b border-slate-100">
            <button
              onClick={() => setSelectedStatus('All')}
              className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                selectedStatus === 'All'
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-[#64748B]'
              }`}
            >
              All Status
            </button>
            <button
              onClick={() => setSelectedStatus('checked_in')}
              className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                selectedStatus === 'checked_in'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-700'
              }`}
            >
              Checked In
            </button>
            <button
              onClick={() => setSelectedStatus('pending')}
              className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                selectedStatus === 'pending'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              Pending
            </button>
          </div>

          {/* Attendees List */}
          <div className="mt-3.5 space-y-2.5">
            {filteredAttendees.map((att) => {
              const initials = getInitials(att.full_name)
              const regDate = new Date(att.created_at).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
              })

              return (
                <div
                  key={att.id}
                  className="p-3 rounded-[18px] bg-slate-50/70 border border-slate-100 hover:border-slate-200 transition-all flex items-start justify-between gap-2.5"
                >
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    <div className="w-9 h-9 rounded-full bg-[#1E3A68] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#0F172A] truncate">
                        {att.full_name}
                      </p>
                      <p className="text-[10px] text-[#64748B] truncate mt-0.5">
                        {att.organization}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white text-[#1E3A68] border border-slate-200">
                          {att.role}
                        </span>
                        <span className="text-[9px] text-[#94A3B8]">
                          Reg: {regDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Attendance Status & Check In Time */}
                  <div className="text-right flex-shrink-0">
                    {att.checked_in ? (
                      <div>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          Checked In
                        </span>
                        <p className="text-[9px] text-[#64748B] mt-1">
                          {att.check_in_time || 'Today'}
                        </p>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              )
            })}

            {filteredAttendees.length === 0 && (
              <div className="text-center py-8 text-xs text-[#94A3B8]">
                No participants match your search criteria.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
