import { createClient } from '@supabase/supabase-js'

/**
 * Admin Supabase client using the service role key.
 * ONLY use server-side (API routes, Server Components).
 * Bypasses Row Level Security — never expose to the browser.
 */
export function createAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const hasValidServiceKey = serviceKey && serviceKey !== 'your-service-role-key-here' && serviceKey.trim() !== ''
  const key = hasValidServiceKey ? serviceKey : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    key,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
