import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { checkPermission } from '@/lib/admin/permissions'

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
    if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    // 2) Parse & validate input
    const body = (await req.json().catch(() => ({}))) as CreateAdminBody
    const email = (body.email ?? '').trim().toLowerCase()
    const full_name = (body.full_name ?? '').trim()
    const is_active = body.is_active ?? true
    let { role_id } = body
    const role_name = body.role_name?.trim()

    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    if (!role_id && !role_name) {
      return NextResponse.json({ error: 'role_id or role_name is required' }, { status: 400 })
    }

    const svc = createServiceClient()

    // 3) Resolve role_id if only role_name provided
    if (!role_id && role_name) {
      const { data: r, error: roleErr } = await svc
        .from('admin_roles')
        .select('id,name')
        .ilike('name', role_name)
        .maybeSingle()

      if (roleErr) {
        return NextResponse.json({ error: `Resolve role failed: ${roleErr.message}` }, { status: 400 })
      }
      if (!r?.id) {
        return NextResponse.json({ error: `Role not found: ${role_name}` }, { status: 400 })
      }
      role_id = r.id
    }

    // 4) Create or find Auth user
    let userId: string | undefined

    const created = await svc.auth.admin.createUser({
      email,
      email_confirm: true, // adjust if you require email confirmation
      user_metadata: full_name ? { full_name } : undefined,
    })

    if (created.error) {
      const m = created.error.message?.toLowerCase() ?? ''
      const exists = m.includes('already') || m.includes('registered') || m.includes('exists')

      if (!exists) {
        return NextResponse.json({ error: `auth.createUser: ${created.error.message}` }, { status: 400 })
      }

      // Look up by email if user already exists
      let page = 1
      const perPage = 1000
      while (!userId && page <= 5) {
        const list = await svc.auth.admin.listUsers({ page, perPage })
        if (list.error) {
          return NextResponse.json({ error: `auth.listUsers: ${list.error.message}` }, { status: 400 })
        }
        const found = list.data.users.find((u) => u?.email?.toLowerCase() === email)
        if (found?.id) userId = found.id
        if ((list.data.users?.length ?? 0) < perPage) break
        page++
      }
      if (!userId) {
        return NextResponse.json({ error: 'User exists but not found by email' }, { status: 400 })
      }
    } else {
      userId = created.data.user?.id
    }

    if (!userId) return NextResponse.json({ error: 'Could not resolve user id' }, { status: 400 })

    // 5) UPSERT into public.admins (idempotent attach)
    const { error: upsertErr } = await svc
      .from('admins')
      .upsert(
        {
          id: userId,                      // PK should be the auth user id
          email,
          full_name: full_name || null,
          role_id,
          is_active: !!is_active,
        },
        { onConflict: 'id' }
      )

    if (upsertErr) {
      return NextResponse.json({ error: `upsert admins: ${upsertErr.message}` }, { status: 400 })
    }

    return NextResponse.json({ ok: true, user_id: userId })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 })
  }
}

