import { createBrowserClient } from '@supabase/ssr'

const DEFAULT_URL = 'https://aqmrezfbezflixqyqsto.supabase.co'
const DEFAULT_KEY = 'sb_publishable_nMIRhPI41XbdzC8AL1yuOQ_nIiy5SUZ'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_KEY

  return createBrowserClient(url, key)
}
