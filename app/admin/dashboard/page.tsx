// app/admin/dashboard/page.tsx
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  // Must be logged in
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  // Must be active admin
  const { data: admin } = await supabase
    .from('admins')
    .select('id,is_active,role_id')
    .eq('id', user.id)
    .maybeSingle();
  if (!admin || !admin.is_active) redirect('/admin/login?err=no_admin_access');

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Welcome back! Choose a section to manage.
          </p>
        </div>
        <Link href="/account">
          <Button variant="outline">My Account</Button>
        </Link>
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/products" className="group">
          <div className="h-28 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition">
            <div className="text-lg font-semibold">Manage Products</div>
            <div className="text-xs opacity-80 mt-1">Create, edit, organize products</div>
            <div className="text-xs mt-3 opacity-60 group-hover:opacity-100">Open →</div>
          </div>
        </Link>

        <Link href="/admin/services" className="group">
          <div className="h-28 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition">
            <div className="text-lg font-semibold">Manage Services</div>
            <div className="text-xs opacity-80 mt-1">Update offerings & pricing</div>
            <div className="text-xs mt-3 opacity-60 group-hover:opacity-100">Open →</div>
          </div>
        </Link>

        <Link href="/admin/users" className="group">
          <div className="h-28 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition">
            <div className="text-lg font-semibold">Users & Admins</div>
            <div className="text-xs opacity-80 mt-1">View customers, manage admin roles</div>
            <div className="text-xs mt-3 opacity-60 group-hover:opacity-100">Open →</div>
          </div>
        </Link>

        <Link href="/admin/orders" className="group">
          <div className="h-28 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition">
            <div className="text-lg font-semibold">Orders</div>
            <div className="text-xs opacity-80 mt-1">Track purchases & statuses</div>
            <div className="text-xs mt-3 opacity-60 group-hover:opacity-100">Open →</div>
          </div>
        </Link>

        <Link href="/admin/content" className="group">
          <div className="h-28 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition">
            <div className="text-lg font-semibold">Content & Media</div>
            <div className="text-xs opacity-80 mt-1">Banners, pages, images</div>
            <div className="text-xs mt-3 opacity-60 group-hover:opacity-100">Open →</div>
          </div>
        </Link>

        <Link href="/admin/settings" className="group">
          <div className="h-28 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition">
            <div className="text-lg font-semibold">Site Settings</div>
            <div className="text-xs opacity-80 mt-1">General config & preferences</div>
            <div className="text-xs mt-3 opacity-60 group-hover:opacity-100">Open →</div>
          </div>
        </Link>
      </div>

      {/* (Optional) Quick stats & recent activity – placeholders for now */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="text-sm opacity-70">Products</div>
          <div className="mt-2 text-2xl font-semibold">—</div>
          <div className="text-xs opacity-60 mt-1">Total products</div>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="text-sm opacity-70">Services</div>
          <div className="mt-2 text-2xl font-semibold">—</div>
          <div className="text-xs opacity-60 mt-1">Total services</div>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="text-sm opacity-70">Users</div>
          <div className="mt-2 text-2xl font-semibold">—</div>
          <div className="text-xs opacity-60 mt-1">Registered users</div>
        </div>
      </div>

      {/* You can add a “Recent changes” list here later */}
    </div>
  );
}
