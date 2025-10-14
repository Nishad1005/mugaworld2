// app/api/admins/_auth.ts
import { createClient as createServerClient } from '@/lib/supabase/server'

export type AdminProfileRPC = {
  id: string
  role_name: 'super_admin' | 'admin' | 'cashier' | string | null
  is_active: boolean | null
}

export async function assertSuperAdmin() {
  const supabase = await createServerClient()

  // If you prefer to rely on auth first:
  const { data: userRes } = await supabase.auth.getUser()
  if (!userRes?.user) return null

  // Typed RPC result (the <AdminProfileRPC> is the key change)
  const { data, error } = await supabase
    .rpc('get_admin_profile')
    .single<AdminProfileRPC>()

  if (error || !data || !data.is_active || data.role_name !== 'super_admin') {
    return null
  }

  // Narrowed, non-null shape from here on
  return { id: data.id, role_name: data.role_name as 'super_admin', is_active: true }
}
