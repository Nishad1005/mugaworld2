// app/admin/dashboard/page.tsx
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export default async function DashboardPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  const { data: admin } = await supabase
    .from('admins')
    .select('id,is_active,role_id')
    .eq('id', user.id) // ✅ checks by id (works with RLS: id = auth.uid())
    .maybeSingle();

  if (!admin || !admin.is_active) redirect('/admin/login?err=no_admin_access');

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      {/* rest of your UI */}
    </div>
  );
}

