// lib/invoicing/roles-app.ts
import { createClient as createServerClient } from '@/lib/supabase/server';

export async function getIssuerApp() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, issuer: null };

  // Preferred: RPC (works even if admins table changes later)
  const rpc = await supabase.rpc('get_admin_profile').maybeSingle();
  if (!rpc.error && rpc.data) {
    const ok = (!!rpc.data.is_active) && ['super_admin','admin','cashier'].includes(rpc.data.role_name || 'admin');
    return { supabase, issuer: ok ? { id: rpc.data.id, role: rpc.data.role_name || 'admin' } : null };
  }

  // Fallback: just check is_active in admins
  const { data, error } = await supabase
    .from('admins')
    .select('id, is_active')
    .eq('id', user.id)
    .maybeSingle();

  if (error || !data || !data.is_active) return { supabase, issuer: null };
  return { supabase, issuer: { id: data.id, role: 'admin' } };
}

