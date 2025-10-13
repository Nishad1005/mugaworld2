'use client';

import { useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

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

export default function ProductsClient({
  initialProducts,
  canEdit,
}: {
  initialProducts: Product[];
  canEdit: boolean;
}) {
  const supabase = createClient();
  const [items, setItems] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<null | Product>(null);
  const [form, setForm] = useState<Omit<Product, 'id' | 'created_at'>>({
    name: '',
    description: '',
    price: 0,
    stock_qty: 0,
    category: '',
    image_url: '',
    in_stock: true,
    is_active: true,
  } as any);

  async function refresh() {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('id,name,description,price,stock_qty,category,image_url,in_stock,is_active,created_at')
      .order('created_at', { ascending: false });
    if (error) {
      toast({ title: 'Failed to load products', description: error.message, variant: 'destructive' });
    } else {
      setItems((data ?? []) as Product[]);
    }
    setLoading(false);
  }

  function openCreate() {
    setEditing(null);
    setForm({
      name: '',
      description: '',
      price: 0,
      stock_qty: 0,
      category: '',
      image_url: '',
      in_stock: true,
      is_active: true,
    } as any);
  }

  function openEdit(p: Product) {
    setEditing(p);
    setForm({
      name: p.name ?? '',
      description: p.description ?? '',
      price: Number(p.price ?? 0),
      stock_qty: Number(p.stock_qty ?? 0),
      category: p.category ?? '',
      image_url: p.image_url ?? '',
      in_stock: !!p.in_stock,
      is_active: p.is_active ?? true,
    } as any);
  }

  async function save() {
    if (!canEdit) return;
    setLoading(true);
    try {
      if (!editing) {
        const { error } = await supabase.from('products').insert([
          {
            name: form.name,
            description: form.description,
            price: form.price,
            stock_qty: form.stock_qty,
            category: form.category,
            image_url: form.image_url,
            in_stock: form.in_stock,
            is_active: form.is_active,
          },
        ]);
        if (error) throw error;
        toast({ title: 'Product created' });
      } else {
        const { error } = await supabase
          .from('products')
          .update({
            name: form.name,
            description: form.description,
            price: form.price,
            stock_qty: form.stock_qty,
            category: form.category,
            image_url: form.image_url,
            in_stock: form.in_stock,
            is_active: form.is_active,
          })
          .eq('id', editing.id);
        if (error) throw error;
        toast({ title: 'Product updated' });
      }
      await refresh();
      setEditing(null);
    } catch (e: any) {
      toast({ title: 'Save failed', description: e.message ?? 'Error', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    if (!canEdit) return;
    if (!confirm('Delete this product?')) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Product deleted' });
      setItems(prev => prev.filter(p => p.id !== id));
    } catch (e: any) {
      toast({ title: 'Delete failed', description: e.message ?? 'Error', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  const isEditing = useMemo(() => editing !== null, [editing]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manage Products</h1>
          <p className="text-sm text-muted-foreground">
            {canEdit ? 'Create, edit, and delete products.' : 'View only (no edit permission).'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={refresh} disabled={loading}>
            Refresh
          </Button>
          <Button onClick={openCreate} disabled={!canEdit || loading}>
            + New Product
          </Button>
        </div>
      </div>

      {(isEditing || editing === null) && (
        <div className="rounded-xl border p-4 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <Input
                value={form.name ?? ''}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                disabled={!canEdit || loading}
                placeholder="Silk Handloom Shawl"
              />
            </div>
            <div>
              <Label>Category</Label>
              <Input
                value={form.category ?? ''}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                disabled={!canEdit || loading}
                placeholder="Shawls"
              />
            </div>
            <div>
              <Label>Price</Label>
              <Input
                type="number"
                step="0.01"
                value={Number(form.price ?? 0)}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                disabled={!canEdit || loading}
                placeholder="1999"
              />
            </div>
            <div>
              <Label>Stock Quantity</Label>
              <Input
                type="number"
                value={Number(form.stock_qty ?? 0)}
                onChange={(e) => setForm({ ...form, stock_qty: Number(e.target.value) })}
                disabled={!canEdit || loading}
                placeholder="50"
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Description</Label>
              <Input
                value={form.description ?? ''}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                disabled={!canEdit || loading}
                placeholder="Handmade Assamese silk shawl…"
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Image URL</Label>
              <Input
                value={form.image_url ?? ''}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                disabled={!canEdit || loading}
                placeholder="https://images.pexels.com/..."
              />
            </div>
            <div>
              <Label>In Stock</Label>
              <select
                className="w-full border rounded-md h-10 px-3 bg-background"
                value={form.in_stock ? 'true' : 'false'}
                onChange={(e) => setForm({ ...form, in_stock: e.target.value === 'true' })}
                disabled={!canEdit || loading}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div>
              <Label>Active</Label>
              <select
                className="w-full border rounded-md h-10 px-3 bg-background"
                value={form.is_active ? 'true' : 'false'}
                onChange={(e) => setForm({ ...form, is_active: e.target.value === 'true' })}
                disabled={!canEdit || loading}
              >
                <option value="true">Active</option>
                <option value="false">Hidden</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={save} disabled={!canEdit || loading}>
              {editing ? 'Save Changes' : 'Create Product'}
            </Button>
            {editing && (
              <Button variant="outline" onClick={() => setEditing(null)} disabled={loading}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Category</th>
              <th className="text-left p-3">Price</th>
              <th className="text-left p-3">Stock</th>
              <th className="text-left p-3">Active</th>
              <th className="text-left p-3">In Stock</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.category}</td>
                <td className="p-3">{p.price ?? '-'}</td>
                <td className="p-3">{p.stock_qty ?? '-'}</td>
                <td className="p-3">{p.is_active ? 'Yes' : 'No'}</td>
                <td className="p-3">{p.in_stock ? 'Yes' : 'No'}</td>
                <td className="p-3 space-x-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(p)} disabled={!canEdit || loading}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => remove(p.id)} disabled={!canEdit || loading}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td className="p-6 text-center text-muted-foreground" colSpan={7}>
                  No products yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
