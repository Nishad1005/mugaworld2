// app/admin/dashboard/page.tsx
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export default async function DashboardDebug() {
  const cookieStore = cookies();

  // ✅ Full cookie adapter (read + set/remove) so ssr client always sees session
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // next/headers cookies are mutable in RSC
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options, maxAge: 0 });
        },
      },
    }
  );

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  let admin: any = null;
  let adminError: string | null = null;

  if (user) {
    const { data, error } = await supabase
      .from('admins')
      .select('id,email,is_active,role_id')
      .eq('id', user.id) // RLS: id = auth.uid()
      .maybeSingle();

    admin = data;
    adminError = error?.message || null;
  }

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontWeight: 700, fontSize: 20, marginBottom: 12 }}>Admin Dashboard – Debug</h1>
      <pre style={{ whiteSpace: 'pre-wrap', background: '#111827', color: '#e5e7eb', padding: 16, borderRadius: 8 }}>
{JSON.stringify({ user, userError: userError?.message || null, admin, adminError }, null, 2)}
      </pre>

      <div style={{ marginTop: 16 }}>
        <a href="/admin/products" style={{ color: '#f59e0b', textDecoration: 'underline' }}>
          Go to Manage Products
        </a>
      </div>
    </div>
  );
}

