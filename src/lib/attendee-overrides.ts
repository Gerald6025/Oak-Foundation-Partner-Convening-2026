import fs from 'fs'
import path from 'path'

export interface AttendeeOverride {
  id?: string
  email?: string
  role?: string
  organization?: string
  first_name?: string
  last_name?: string
  full_name?: string
  qr_code_token?: string
  updated_at?: string
}

const OVERRIDES_FILE = path.join(process.cwd(), 'src', 'lib', 'attendee-overrides.json')

// In-memory cache for fast lookups
let inMemoryOverrides: Record<string, AttendeeOverride> = {}

// Seed with existing known accounts that may have re-registered as Partner
function loadOverrides(): Record<string, AttendeeOverride> {
  try {
    if (fs.existsSync(OVERRIDES_FILE)) {
      const data = fs.readFileSync(OVERRIDES_FILE, 'utf8')
      inMemoryOverrides = JSON.parse(data)
    }
  } catch (err) {
    console.error('Failed to read attendee-overrides.json:', err)
  }
  return inMemoryOverrides
}

function saveOverrides(): void {
  try {
    fs.writeFileSync(OVERRIDES_FILE, JSON.stringify(inMemoryOverrides, null, 2), 'utf8')
  } catch (err) {
    console.error('Failed to write attendee-overrides.json:', err)
  }
}

// Initial load
loadOverrides()

export function getAttendeeOverride(key: string): AttendeeOverride | null {
  if (!key) return null
  loadOverrides()
  const normalizedKey = key.trim().toLowerCase()

  // Match by exact key (id, token, or email)
  if (inMemoryOverrides[key]) return inMemoryOverrides[key]
  if (inMemoryOverrides[normalizedKey]) return inMemoryOverrides[normalizedKey]

  // Search by fields
  for (const item of Object.values(inMemoryOverrides)) {
    if (item.id === key) return item
    if (item.qr_code_token === key) return item
    if (item.email && item.email.toLowerCase() === normalizedKey) return item
  }

  return null
}

export function setAttendeeOverride(override: AttendeeOverride): void {
  loadOverrides()
  const updated: AttendeeOverride = {
    ...override,
    updated_at: new Date().toISOString(),
  }

  if (override.id) {
    inMemoryOverrides[override.id] = { ...inMemoryOverrides[override.id], ...updated }
  }
  if (override.email) {
    const normEmail = override.email.trim().toLowerCase()
    inMemoryOverrides[normEmail] = { ...inMemoryOverrides[normEmail], ...updated }
  }
  if (override.qr_code_token) {
    inMemoryOverrides[override.qr_code_token] = { ...inMemoryOverrides[override.qr_code_token], ...updated }
  }

  saveOverrides()
}
