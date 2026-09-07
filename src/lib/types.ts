// ─── Attendee ───────────────────────────────────────────────
export interface Attendee {
  id: string
  full_name: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  organization: string
  sub_partner: string | null
  role: string
  dietary_requirements: string | null
  accessibility_needs: string | null
  travel_needs: string | null
  consent_given: boolean
  qr_code_token: string
  created_at: string
}

/** Public-safe attendee data (no sensitive fields) */
export interface AttendeePublic {
  id: string
  full_name: string
  first_name: string
  last_name: string
  organization: string
  role: string
  qr_code_token: string
}

// ─── Check-in ───────────────────────────────────────────────
export interface CheckIn {
  id: string
  attendee_id: string
  check_in_date: string // YYYY-MM-DD
  checked_in_at: string
}

export interface CheckInWithAttendee extends CheckIn {
  attendee: AttendeePublic
}

// ─── Partner ────────────────────────────────────────────────
export interface Partner {
  id: string
  name: string
  acronym?: string
  region?: string
  tags?: string[]
  since_year?: number | string
  category?: string
  contact_name?: string
  contact_email?: string
  contact_initials?: string
  description?: string | null
  website_url?: string | null
  logo_url?: string | null
  display_order?: number
  is_sub_partner?: boolean
  parent_partner_id?: string | null
  created_at?: string
}

// ─── Programme ──────────────────────────────────────────────
export interface ProgrammeSession {
  id: string
  day_number: number // 1, 2, or 3
  title: string
  description: string | null
  speaker: string | null
  location: string | null
  start_time: string // HH:MM
  end_time: string // HH:MM
  session_type: 'plenary' | 'breakout' | 'networking' | 'meal' | 'registration' | 'other'
  created_at: string
}

export interface DocumentationPost {
  id: string
  day_number: number
  title: string
  content: string
  photo_urls: string[]
  published_at: string
  created_at: string
}

// ─── Dashboard ──────────────────────────────────────────────
export interface HeadcountStats {
  total_registered: number
  checked_in_today: number
  day1_count: number
  day2_count: number
  day3_count: number
}

// ─── Registration Form ─────────────────────────────────────
export interface RegistrationFormData {
  first_name: string
  last_name: string
  email: string
  phone: string
  organization: string
  sub_partner: string
  role: string
  dietary_requirements: string
  accessibility_needs: string
  travel_needs: string
  consent_given: boolean
}
