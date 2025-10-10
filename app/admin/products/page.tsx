import { redirect } from 'next/navigation';
import { getAdminProfile, checkPermission } from '@/lib/admin/permissions';
import AdminProductsClient from './AdminProductsClient';

export default async function AdminProductsPage() {
  const profile = await getAdminProfile();

  if (!profile || !profile.is_active) {
    redirect('/admin/login');
  }

  const hasPermission = await checkPermission('edit_products');

  if (!hasPermission) {
    redirect('/admin/dashboard');
  }

  return <AdminProductsClient profile={profile} />;
}
