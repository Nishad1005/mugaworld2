// app/admin/services/page.tsx
import { redirect } from 'next/navigation'
import { getAdminProfile, checkPermission } from '@/lib/admin/permissions'
import AdminServicesClient from './AdminServicesClient'

export default async function AdminServicesPage() {
  const profile = await getAdminProfile()
  if (!profile || !profile.is_active) redirect('/admin/login')

  const hasPermission = await checkPermission('edit_services')
  if (!hasPermission) redirect('/admin/dashboard')

  // ⬇️ No props — client is self-loading
  return <AdminServicesClient />
}

