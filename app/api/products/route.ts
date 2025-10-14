// app/api/products/route.ts
import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { checkPermission } from '@/lib/admin/permissions'

export async function POST(req: Request) {
  try {
    const allowed = await checkPermission('edit_products')
    if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json().catch(() => ({}))
    const { name, description, price, stock, category, image_url, in_stock } = body ?? {}

    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

    const svc = createServiceClient()
    const { error } = await svc.from('products').insert({
      name,
      description: description ?? null,
      price: typeof price === 'number' ? price : null,
      stock: typeof stock === 'number' ? stock : null,
      category: category ?? null,
      image_url: image_url ?? null,
      in_stock: in_stock ?? true,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 })
  }
}

