import { redirect } from 'next/navigation';
import { getAdminProfile } from '@/lib/admin/permissions';
import AdminDashboardClient from './AdminDashboardClient';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export default async function AdminDashboardPage() {
  const profile = await getAdminProfile();

  if (!profile || !profile.is_active) {
    redirect('/admin/login');
  }

  return <AdminDashboardClient profile={profile} />;
}
