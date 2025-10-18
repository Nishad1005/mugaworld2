import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function InvoicesLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/admin/login');

  // Allow only active admins (using either RPC or fallback)
  let ok = false;
  const rpc = await supabase.rpc('get_admin_profile').maybeSingle();
  if (!rpc.error && rpc.data) ok = !!rpc.data.is_active;
  if (!ok) {
    const { data } = await supabase.from('admins').select('is_active').eq('id', user.id).maybeSingle();
    ok = !!data?.is_active;
  }
  if (!ok) redirect('/admin/login?err=no_admin_access');

  return <>{children}</>;
}
