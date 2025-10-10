import { redirect } from 'next/navigation';
import { getAdminProfile, checkPermission } from '@/lib/admin/permissions';
import AdminUsersClient from './AdminUsersClient';

export default async function AdminUsersPage() {
  const profile = await getAdminProfile();

  if (!profile || !profile.is_active) {
    redirect('/admin/login');
  }

  const hasPermission = await checkPermission('manage_admins');

  if (!hasPermission) {
    redirect('/admin/dashboard');
  }

  return <AdminUsersClient profile={profile} />;
}
