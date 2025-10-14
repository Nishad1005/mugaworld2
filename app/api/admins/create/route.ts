// app/api/admins/create/route.ts
import { NextResponse } from 'next/server'
import { checkPermission } from '@/lib/admin/permissions'
import { createServiceClient } from '@/lib/supabase/service'

type CreateAdminBody = {
  email?: string
  full_name?: string
  role_id?: string
  role_name?: string
  is_active?: boolean
}

export async function POST(req: Request) {
  try {
    // 1) Permission gate
    const allowed = await checkPermission('manage_admins')
    if (!allowed) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = (await req.json().catch(() => ({}))) as CreateAdminBody
    const email = (body.email ?? '').trim().toLowerCase()
    const full_name = (body.full_name ?? '').trim()
    let { role_id } = body
    const role_name = body.role_name?.trim().toLowerCase()
    const is_active = body.is_active ?? true

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }
    if (!role_id && !role_name) {
      return NextResponse.json({ error: 'role_id or role_name is required' }, { status: 400 })
    }

    const svc = createServiceClient()

    // 2) Resolve role_id if only role_name was sent
    if (!role_id && role_name) {
      const { data: roleRow, error: roleErr } = await svc
        .from('admin_roles')
        .select('id,name')
        .ilike('name', role_name)
        .maybeSingle()
      if (roleErr) {
        return NextResponse.json({ error: `Failed to resolve role: ${roleErr.message}` }, { status: 400 })
      }
      if (!roleRow?.id) {
        return NextResponse.json({ error: `Role not found: ${role_name}` }, { status: 400 })
      }
      role_id = roleRow.id
    }

    // 3) Find or create the auth user
    let userId: string | undefined

    // Try creating the user (passwordless). If exists, fall back to lookup.
    const createRes = await svc.auth.admin.createUser({
      email,
      email_confirm: true, // adjust if you require confirmation
      user_metadata: full_name ? { full_name } : undefined,
    })

    if (createRes.error) {
      const msg = (createRes.error.message || '').toLowerCase()
      const already = msg.includes('already') || msg.includes('registered') || msg.includes('exists')
      if (!already) {
        return NextResponse.json({ error: `Auth createUser failed: ${createRes.error.message}` }, { status: 400 })
      }
      // User exists → list users and find by email
      // (Supabase admin API doesn’t filter by email directly; iterate a few pages)
      let page = 1
      const perPage = 1000
      while (!userId && page <= 5) { // safety bound
        const list = await svc.auth.admin.listUsers({ page, perPage })
        if (list.error) {
          return NextResponse.json({ error: `Auth listUsers failed: ${list.error.message}` }, { status: 400 })
        }
        const found = list.data.users.find(
          (u) => u?.email?.toLowerCase() === email
        )
        if (found?.id) {
          userId = found.id
          break
        }
        if ((list.data.users?.length ?? 0) < perPage) break
        page++
      }
      if (!userId) {
        return NextResponse.json({ error: 'User exists but could not be looked up by email' }, { status: 400 })
      }
    } else {
      userId = createRes.data.user?.id
    }

    if (!userId) {
      return NextResponse.json({ error: 'Could not resolve user id' }, { status: 400 })
    }

    // 4) Insert into public.admins (service key bypasses RLS)
 const { error: upsertErr } = await svc
  .from('admins')
  .upsert(
    {
      id: userId,                 // MUST be the Auth user id
      email,
      full_name: full_name || null,
      role_id,
      is_active: true,            // default to active on create
    },
    { onConflict: 'id' }
  )
if (upsertErr) {
  return NextResponse.json({ error: `upsert admins: ${upsertErr.message}` }, { status: 400 })
}

    if (insertErr) {
      // If row already exists, return 200 idempotently
      const dup = insertErr.message?.toLowerCase().includes('duplicate')
      if (!dup) {
        return NextResponse.json({ error: `Insert admin failed: ${insertErr.message}` }, { status: 400 })
      }
    }

    return NextResponse.json({ ok: true, user_id: userId })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 })
  }
}
