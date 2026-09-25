import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const isConfigured = Boolean(supabaseUrl && supabaseAnonKey)

if (!isConfigured) {
  // eslint-disable-next-line no-console
  console.error('Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY environment variables. Booking features are disabled until these are set.')
}

// Falls back to placeholder values so the rest of the site can still render/build
// when Supabase env vars aren't set yet; booking calls will simply fail with a network error.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
)
