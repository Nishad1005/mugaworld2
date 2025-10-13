// app/admin/debug/page.tsx
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export default async function AdminDebugPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  let adminRow: any = null, adminErr: any = null;
  if (user) {
    const { data, error } = await supabase
      .from('admins')
      .select('id,email,is_active,role_id')
      .eq('id', user.id)
      .maybeSingle();
    adminRow = data; adminErr = error?.message || null;
  }

  // Try RPCs if they exist in your schema (ignore errors)
  let profileRPC: any = null, profileRPCErr: any = null;
  let permRPC: any = null, permRPCErr: any = null;

  try {
    const { data, error } = await supabase.rpc('get_admin_profile');
    profileRPC = data; profileRPCErr = error?.message || null;
  } catch (e: any) {
    profileRPCErr = e?.message || String(e);
  }

  try {
    const { data, error } = await supabase.rpc('check_admin_permission', { permission_name: 'edit_products' });
    permRPC = data; permRPCErr = error?.message || null;
  } catch (e: any) {
    // Some projects use a different arg name
    try {
      const { data, error } = await supabase.rpc('check_admin_permission', { perm: 'edit_products' });
      permRPC = data; permRPCErr = error?.message || null;
    } catch (e2: any) {
      permRPCErr = e2?.message || String(e2);
    }
  }

  return (
    <pre style={{whiteSpace: 'pre-wrap'}}>
{JSON.stringify(
  { 
    user, 
    userError: userError?.message || null, 
    adminRow, 
    adminErr, 
    profileRPC, 
    profileRPCErr, 
    permRPC, 
    permRPCErr 
  }, 
  null, 
  2
)}
    </pre>
  );
}
