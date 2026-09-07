import { createClient } from '@supabase/supabase-js'

const DEFAULT_URL = 'https://aqmrezfbezflixqyqsto.supabase.co'
const DEFAULT_KEY = 'sb_publishable_nMIRhPI41XbdzC8AL1yuOQ_nIiy5SUZ'

/**
 * Admin Supabase client using the service role key.
 * ONLY use server-side (API routes, Server Components).
 * Falls back safely to publishable key if service key is not configured.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const hasValidServiceKey = serviceKey && serviceKey !== 'your-service-role-key-here' && serviceKey.trim() !== ''
  const key = hasValidServiceKey ? serviceKey : (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_KEY)

  return createClient(
    url,
    key,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
