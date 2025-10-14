// app/api/admins/[id]/toggle/route.ts
import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { createClient as createServerClient } from '@/lib/supabase/server'

type AdminProfileRPC = {
  id: string
  role_name: 'super_admin' | 'admin' | 'cashier' | string | null
  is_active: boolean | null
}

async function assertSuperAdmin() {
  const supabase = await createServerClient()
  const { data, error } = await supabase.rpc('get_admin_profile').single<AdminProfileRPC>()
  if (error || !data || !data.is_active || data.role_name !== 'super_admin') return null
  return { id: data.id }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const me = await assertSuperAdmin()
    if (!me) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { is_active } = await req.json()
    if (typeof is_active !== 'boolean') {
      return NextResponse.json({ error: 'is_active must be boolean' }, { status: 400 })
    }

    const svc = createServiceClient()
    const { error } = await svc.from('admins').update({ is_active }).eq('id', params.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 })
  }
}
