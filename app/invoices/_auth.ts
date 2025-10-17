// app/api/invoices/_auth.ts
import { createClient } from '@/lib/supabase/server';

export type IssuerRole = 'super_admin'|'admin'|'cashier';

export async function assertInvoiceIssuer() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // You already have this RPC in your project
  const { data, error } = await supabase
    .rpc('get_admin_profile')
    .single<{ id: string; role_name: string; is_active: boolean }>();

  if (error || !data) return null;

  const ok =
    !!data.is_active &&
    ['super_admin','admin','cashier'].includes((data.role_name || '').toString());

  return ok ? { id: data.id, role: data.role_name as IssuerRole } : null;
}
