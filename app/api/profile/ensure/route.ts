import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export async function POST() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  )

  const { data: { user }, error: userErr } = await supabase.auth.getUser()
  if (userErr || !user) {
    return NextResponse.json({ ok: false, error: 'not_authenticated' }, { status: 401 })
  }

  const { data: existing, error: selErr } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .maybeSingle()

  if (selErr) return NextResponse.json({ ok: false, error: selErr.message }, { status: 400 })
  if (existing) return NextResponse.json({ ok: true, created: false })

  const { error: insErr } = await supabase
    .from('profiles')
    .insert({ id: user.id, email: user.email, account_type: 'individual' })
    .select('id')
    .single()

  if (insErr) return NextResponse.json({ ok: false, error: insErr.message }, { status: 400 })
  return NextResponse.json({ ok: true, created: true })
}
