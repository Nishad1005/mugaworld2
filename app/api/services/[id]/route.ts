// app/api/services/[id]/route.ts
import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { checkPermission } from '@/lib/admin/permissions'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const allowed = await checkPermission('edit_services')
    if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const id = params.id
    const updates = await req.json().catch(() => ({}))
    const safe: Record<string, any> = {}

    if (updates.title !== undefined) safe.title = updates.title
    if (updates.description !== undefined) safe.description = updates.description ?? null
    if (updates.price !== undefined) safe.price = typeof updates.price === 'number' ? updates.price : null
    if (updates.duration !== undefined) safe.duration = typeof updates.duration === 'number' ? updates.duration : null
    if (updates.category !== undefined) safe.category = updates.category ?? null
    if (updates.image_url !== undefined) safe.image_url = updates.image_url ?? null
    if (updates.is_active !== undefined) safe.is_active = !!updates.is_active

    if (Object.keys(safe).length === 0) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 })
    }

    const svc = createServiceClient()
    const { error } = await svc.from('services').update(safe).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const allowed = await checkPermission('edit_services')
    if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const svc = createServiceClient()
    const { error } = await svc.from('services').delete().eq('id', params.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 })
  }
}
