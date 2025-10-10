import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AccountPageClient from './AccountPageClient'

export const dynamic = 'force-dynamic'

export default async function AccountPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile) {
    redirect('/login')
  }

  return <AccountPageClient profile={profile} user={user} />
}
