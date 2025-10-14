// app/admin/products/page.tsx
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import ProductsClient from './ProductsClient';
import { getAdminProfile, checkPermission } from '@/lib/admin/permissions'

type Product = {
  id: string;
  name: string | null;
  description: string | null;
  price: number | null;
  stock_qty: number | null;
  category: string | null;
  image_url: string | null;
  in_stock: boolean | null;
  is_active: boolean | null;
  created_at: string | null;
};

export default async function AdminProductsPage() {
  const profile = await getAdminProfile()
  if (!profile || !profile.is_active) redirect('/admin/login')

  const allowed = await checkPermission('edit_products')
  if (!allowed) redirect('/admin/dashboard')

  // client is self-loading; no props
  return <ProductsClient />
}

export default async function ProductsPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  // Must be logged in
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  // Gate by permissions
  const { data: canView } = await supabase
    .rpc('check_admin_permission', { permission_name: 'view_products' })
    .single();
  if (!canView) redirect('/admin/login?err=no_admin_access');

  const { data: canEdit } = await supabase
    .rpc('check_admin_permission', { permission_name: 'edit_products' })
    .single();

  // Initial fetch (respects RLS)
  const { data: products, error } = await supabase
    .from('products')
    .select('id,name,description,price,stock_qty,category,image_url,in_stock,is_active,created_at')
    .order('created_at', { ascending: false });

  if (error) {
    // If RLS blocks, show an empty list but still render page
    return <ProductsClient initialProducts={[]} canEdit={!!canEdit} />;
  }

  return <ProductsClient initialProducts={(products ?? []) as Product[]} canEdit={!!canEdit} />;
}
