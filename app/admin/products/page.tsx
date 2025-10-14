// app/admin/products/page.tsx
import { redirect } from 'next/navigation'
import { getAdminProfile, checkPermission } from '@/lib/admin/permissions'
import ProductsClient from './ProductsClient'

export default async function AdminProductsPage() {
  const profile = await getAdminProfile()
  if (!profile || !profile.is_active) redirect('/admin/login')

  const allowed = await checkPermission('edit_products')
  if (!allowed) redirect('/admin/dashboard')

  // Client is self-loading; no props
  return <ProductsClient />
}

