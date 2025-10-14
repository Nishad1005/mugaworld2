// app/api/admins/create/route.ts
import { NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

// 1) Add a type describing what your RPC returns
type AdminProfileRPC = {
  id: string
  role_name: 'super_admin' | 'admin' | 'cashier' | string | null
  is_active: boolean | null
}

async function assertSuperAdmin() {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    //            ⬇ Result type            ⬇ No-params type
    .rpc<AdminProfileRPC, Record<string, never>>('get_admin_profile')
    .single()

  if (error || !data || !data.is_active || data.role_name !== 'super_admin') {
    return null
  }
  return { id: data.id, role_name: 'super_admin' as const, is_active: true as const }
}
export async function POST(req: Request) {
  try {
    const me = await assertSuperAdmin()
    if (!me) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json()
    const { email, password, full_name, role_id } = body ?? {}
    if (!email || !password || !full_name || !role_id) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const svc = createServiceClient()

    // create auth user
    const { data: authData, error: authErr } = await svc.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })
    if (authErr) return NextResponse.json({ error: authErr.message }, { status: 400 })
    const userId = authData.user.id

    // insert admins row
    const { error: insertErr } = await svc.from('admins').insert({
      id: userId,
      email,
      full_name,
      role_id,
      is_active: true,
      created_by: me.id,
    })
    if (insertErr) {
      await svc.auth.admin.deleteUser(userId).catch(() => {})
      return NextResponse.json({ error: insertErr.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true, id: userId })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 })
  }
}

