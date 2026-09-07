'use client'

import { useState } from 'react'
import { formatTime } from '@/lib/utils'
import type { ProgrammeSession } from '@/lib/types'

const sessionTypeColors: Record<string, { bg: string; text: string }> = {
  plenary: { bg: 'bg-oak-navy/10', text: 'text-oak-navy' },
  breakout: { bg: 'bg-purple-100', text: 'text-purple-700' },
  networking: { bg: 'bg-oak-green/10', text: 'text-oak-green-dark' },
  meal: { bg: 'bg-amber-100', text: 'text-amber-700' },
  registration: { bg: 'bg-blue-100', text: 'text-blue-700' },
  other: { bg: 'bg-oak-gray-100', text: 'text-oak-gray-600' },
}

interface ProgrammeTabsProps {
  sessions: Record<number, ProgrammeSession[]>
}

export default function ProgrammeTabs({ sessions }: ProgrammeTabsProps) {
  const [activeDay, setActiveDay] = useState(1)

  const dayLabels = [
    { day: 1, label: 'Day 1', date: 'Nov 9' },
    { day: 2, label: 'Day 2', date: 'Nov 10' },
    { day: 3, label: 'Day 3', date: 'Nov 11' },
  ]

  return (
    <div className="mt-5">
      {/* Day Tabs */}
      <div className="flex gap-2 mb-4">
        {dayLabels.map(({ day, label, date }) => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              activeDay === day
                ? 'bg-oak-navy text-white shadow-md'
                : 'bg-white text-oak-text-muted hover:bg-oak-gray-50 border border-oak-gray-200'
            }`}
          >
            <div>{label}</div>
            <div className={`text-[10px] font-normal ${activeDay === day ? 'text-white/70' : ''}`}>
              {date}
            </div>
          </button>
        ))}
      </div>

      {/* Session List */}
      <div className="space-y-3">
        {sessions[activeDay]?.map((session, index) => {
          const colors = sessionTypeColors[session.session_type] || sessionTypeColors.other
          return (
            <div
              key={session.id}
              className="bg-white rounded-2xl p-4 shadow-sm animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                      {session.session_type}
                    </span>
                  </div>
                  <h3 className="font-semibold text-oak-text">{session.title}</h3>
                  {session.description && (
                    <p className="text-xs text-oak-text-muted mt-0.5">{session.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs text-oak-text-muted">
                    <span className="flex items-center gap-1">
                      🕐 {formatTime(session.start_time)} – {formatTime(session.end_time)}
                    </span>
                    {session.location && (
                      <span className="flex items-center gap-1">
                        📍 {session.location}
                      </span>
                    )}
                  </div>
                  {session.speaker && (
                    <p className="text-xs text-oak-navy font-medium mt-1">
                      🎤 {session.speaker}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {(!sessions[activeDay] || sessions[activeDay].length === 0) && (
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <p className="text-sm text-oak-text-muted">No sessions scheduled for this day yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
