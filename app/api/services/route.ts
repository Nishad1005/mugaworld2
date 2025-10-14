// app/api/services/route.ts
import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { checkPermission } from '@/lib/admin/permissions' // server-safe

export async function POST(req: Request) {
  try {
    const allowed = await checkPermission('edit_services')
    if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json().catch(() => ({}))
    const {
      title,
      description,
      price,
      duration,
      category,
      image_url,
      is_active,
    } = body ?? {}

    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 })

    const svc = createServiceClient()
    const { error } = await svc.from('services').insert({
      title,
      description: description ?? null,
      price: typeof price === 'number' ? price : null,
      duration: typeof duration === 'number' ? duration : null,
      category: category ?? null,
      image_url: image_url ?? null,
      is_active: !!is_active,
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 })
  }
}
