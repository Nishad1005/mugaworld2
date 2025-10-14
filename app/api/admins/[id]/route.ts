// app/api/admins/[id]/route.ts
import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { createClient as createServerClient } from '@/lib/supabase/server'

type AdminProfileRPC = {
  id: string
  role_name: 'super_admin' | 'admin' | 'cashier' | string | null
  is_active: boolean | null
}

// Reuse the same approach that worked in create/route.ts
async function assertSuperAdmin() {
  const supabase = await createServerClient()
  const { data, error } = await supabase.rpc('get_admin_profile').single<AdminProfileRPC>()
  if (error || !data || !data.is_active || data.role_name !== 'super_admin') return null
  return { id: data.id }
}

// PATCH /api/admins/[id]  → update email/full_name/role_id/is_active
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const me = await assertSuperAdmin()
    if (!me) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const adminId = params.id
    const body = await req.json().catch(() => ({}))
    const { email, full_name, role_id, is_active } = body as Partial<{
      email: string; full_name: string; role_id: string; is_active: boolean
    }>

    const updates: Record<string, any> = {}
    if (email !== undefined) updates.email = email
    if (full_name !== undefined) updates.full_name = full_name
    if (role_id !== undefined) updates.role_id = role_id
    if (is_active !== undefined) updates.is_active = !!is_active

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 })
    }

    const svc = createServiceClient()
    const { error } = await svc.from('admins').update(updates).eq('id', adminId)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 })
  }
}

// DELETE /api/admins/[id]  → remove from table and Auth
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const me = await assertSuperAdmin()
    if (!me) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const adminId = params.id
    const svc = createServiceClient()

    // delete DB row first
    const { error: dbErr } = await svc.from('admins').delete().eq('id', adminId)
    if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 400 })

    // then delete auth user
    const { error: authErr } = await svc.auth.admin.deleteUser(adminId)
    if (authErr) return NextResponse.json({ error: authErr.message }, { status: 400 })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 })
  }
}
