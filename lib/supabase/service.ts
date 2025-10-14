// lib/supabase/service.ts
import { createClient as createAdminClient, SupabaseClient } from '@supabase/supabase-js'

/**
 * Service-role Supabase client for server-only privileged ops.
 * DO NOT import this in client components.
 */
export function createServiceClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!  // set on Netlify (server-only)
  if (!url || !serviceKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  }
  return createAdminClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
