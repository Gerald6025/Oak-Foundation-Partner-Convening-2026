import { v4 as uuidv4 } from 'uuid'

/**
 * Generate a unique QR code token in the format OAK-2026-XXXX-XXXX
 * Uses UUID v4 and extracts alphanumeric chars for the suffix.
 */
export function generateQRToken(): string {
  const uuid = uuidv4().replace(/-/g, '').toUpperCase()
  const part1 = uuid.substring(0, 4)
  const part2 = uuid.substring(4, 8)
  return `OAK-2026-${part1}-${part2}`
}

/**
 * Format a date string to a human-readable format
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Format a time string (HH:MM) to 12-hour format
 */
export function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':').map(Number)
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`
}

/**
 * Get the initials from a full name (up to 2 characters)
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

/**
 * Get a consistent color for initials avatar based on the name
 */
export function getAvatarColor(name: string): string {
  const colors = [
    'bg-blue-600',
    'bg-emerald-600',
    'bg-purple-600',
    'bg-amber-600',
    'bg-rose-600',
    'bg-cyan-600',
    'bg-indigo-600',
    'bg-teal-600',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

/**
 * Convert attendee data to CSV for export
 */
export function attendeesToCSV(attendees: Record<string, unknown>[]): string {
  if (attendees.length === 0) return ''

  const headers = [
    'Full Name',
    'Email',
    'Phone',
    'Organisation',
    'Sub-Partner',
    'Role',
    'Dietary Requirements',
    'Accessibility Needs',
    'Travel Needs',
    'QR Code',
    'Registered At',
  ]

  const rows = attendees.map((a) =>
    [
      a.full_name,
      a.email,
      a.phone || '',
      a.organization,
      a.sub_partner || '',
      a.role,
      a.dietary_requirements || '',
      a.accessibility_needs || '',
      a.travel_needs || '',
      a.qr_code_token,
      a.created_at,
    ]
      .map((field) => `"${String(field).replace(/"/g, '""')}"`)
      .join(',')
  )

  return [headers.join(','), ...rows].join('\n')
}

/**
 * Download a string as a file
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}

/**
 * Determine the event day number (1, 2, or 3) based on the date
 * Event: 9-11 November 2026
 */
export function getEventDayNumber(date?: Date): number | null {
  const d = date || new Date()
  const day = d.getDate()
  const month = d.getMonth() + 1 // 0-indexed
  const year = d.getFullYear()

  if (year === 2026 && month === 11) {
    if (day === 9) return 1
    if (day === 10) return 2
    if (day === 11) return 3
  }
  return null
}
