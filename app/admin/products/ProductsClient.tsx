'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader as Loader2, Plus, Pencil, Trash2, RotateCcw } from 'lucide-react'

type ProductRow = {
  id: string
  name: string
  description: string | null
  price: number | null
  stock: number | null
  category: string | null
  image_url: string | null
  in_stock: boolean | null
  created_at: string | null
}

type FormState = {
  name: string
  description: string
  price: string
  stock: string
  category: string
  image_url: string
  in_stock: boolean
}

export default function ProductsClient() {
  const supabase = useMemo(() => createClient(), [])
  const [rows, setRows] = useState<ProductRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isBusy, setIsBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [showCreate, setShowCreate] = useState(false)
  const [createForm, setCreateForm] = useState<FormState>({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image_url: '',
    in_stock: true,
  })

  const [editing, setEditing] = useState<ProductRow | null>(null)
  const [editForm, setEditForm] = useState<FormState>({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image_url: '',
    in_stock: true,
  })

  const load = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id,name,description,price,stock,category,image_url,in_stock,created_at')
        .order('created_at', { ascending: false })
      if (error) throw error
      setRows(data ?? [])
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load products')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ---------- Create ----------
  const onCreate = async () => {
    setIsBusy(true)
    setError(null)
    try {
      if (!createForm.name.trim()) throw new Error('Name is required')

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: createForm.name.trim(),
          description: createForm.description.trim() || null,
          price: createForm.price ? Number(createForm.price) : null,
          stock: createForm.stock ? Number(createForm.stock) : null,
          category: createForm.category.trim() || null,
          image_url: createForm.image_url.trim() || null,
          in_stock: createForm.in_stock,
        }),
      })
      const payload = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(payload?.error || 'Failed to create product')

      setShowCreate(false)
      setCreateForm({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        image_url: '',
        in_stock: true,
      })
      await load()
    } catch (e: any) {
      setError(e?.message ?? 'Failed to create')
    } finally {
      setIsBusy(false)
    }
  }

  // ---------- Edit ----------
  const openEdit = (row: ProductRow) => {
    setEditing(row)
    setEditForm({
      name: row.name ?? '',
      description: row.description ?? '',
      price: row.price != null ? String(row.price) : '',
      stock: row.stock != null ? String(row.stock) : '',
      category: row.category ?? '',
      image_url: row.image_url ?? '',
      in_stock: !!row.in_stock,
    })
  }

  const onUpdate = async () => {
    if (!editing) return
    setIsBusy(true)
    setError(null)
    try {
      const res = await fetch(`/api/products/${editing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name.trim(),
          description: editForm.description.trim() || null,
          price: editForm.price ? Number(editForm.price) : null,
          stock: editForm.stock ? Number(editForm.stock) : null,
          category: editForm.category.trim() || null,
          image_url: editForm.image_url.trim() || null,
          in_stock: editForm.in_stock,
        }),
      })
      const payload = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(payload?.error || 'Failed to update product')

      setEditing(null)
      await load()
    } catch (e: any) {
      setError(e?.message ?? 'Failed to update')
    } finally {
      setIsBusy(false)
    }
  }

  // ---------- Delete ----------
  const onDelete = async (row: ProductRow) => {
    if (!confirm(`Delete "${row.name}"?`)) return
    setIsBusy(true)
    setError(null)
    try {
      const res = await fetch(`/api/products/${row.id}`, { method: 'DELETE' })
      const payload = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(payload?.error || 'Failed to delete product')

      await load()
    } catch (e: any) {
      setError(e?.message ?? 'Failed to delete')
    } finally {
      setIsBusy(false)
    }
  }

  // ---------- UI ----------
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Manage Products</h1>
        <div className="flex gap-2">
          <button
            onClick={() => load()}
            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
            disabled={isLoading || isBusy}
            title="Reload"
          >
            <RotateCcw className="h-4 w-4" />
            Reload
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-black px-3 py-2 text-sm text-white hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            New Product
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading…
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-lg border p-6 text-sm text-gray-600">No products yet.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-600">Name</th>
                <th className="px-3 py-2 text-left font-medium text-gray-600">Category</th>
                <th className="px-3 py-2 text-left font-medium text-gray-600">Price</th>
                <th className="px-3 py-2 text-left font-medium text-gray-600">Stock</th>
                <th className="px-3 py-2 text-left font-medium text-gray-600">In Stock</th>
                <th className="px-3 py-2 text-right font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-3 py-2">{r.name}</td>
                  <td className="px-3 py-2">{r.category ?? '—'}</td>
                  <td className="px-3 py-2">{r.price != null ? `₹ ${r.price}` : '—'}</td>
                  <td className="px-3 py-2">{r.stock != null ? r.stock : '—'}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        r.in_stock ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {r.in_stock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(r)}
                        className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 hover:bg-gray-50"
                        disabled={isBusy}
                      >
                        <Pencil className="h-4 w-4" /> Edit
                      </button>
                      <button
                        onClick={() => onDelete(r)}
                        className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-red-600 hover:bg-red-50"
                        disabled={isBusy}
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Dialog */}
      {showCreate && (
        <Dialog title="Create Product" onClose={() => setShowCreate(false)}>
          <Form
            form={createForm}
            setForm={setCreateForm}
            onSubmit={onCreate}
            isBusy={isBusy}
            submitLabel="Create"
          />
        </Dialog>
      )}

      {/* Edit Dialog */}
      {editing && (
        <Dialog title="Edit Product" onClose={() => setEditing(null)}>
          <Form
            form={editForm}
            setForm={setEditForm}
            onSubmit={onUpdate}
            isBusy={isBusy}
            submitLabel="Save changes"
          />
        </Dialog>
      )}
    </div>
  )
}

function Dialog({
  title,
  onClose,
  children,
}: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-sm text-gray-500">Close</button>
        </div>
        {children}
      </div>
    </div>
  )
}

function Form({
  form, setForm, onSubmit, isBusy, submitLabel,
}: {
  form: FormState
  setForm: React.Dispatch<React.SetStateAction<FormState>>
  onSubmit: () => void
  isBusy: boolean
  submitLabel: string
}) {
  return (
    <>
      <Field label="Name">
        <input
          className="w-full rounded-lg border px-3 py-2"
          value={form.name}
          onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
        />
      </Field>
      <Field label="Description">
        <textarea
          className="w-full rounded-lg border px-3 py-2"
          rows={3}
          value={form.description}
          onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Price">
          <input
            inputMode="numeric"
            className="w-full rounded-lg border px-3 py-2"
            value={form.price}
            onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))}
          />
        </Field>
        <Field label="Stock">
          <input
            inputMode="numeric"
            className="w-full rounded-lg border px-3 py-2"
            value={form.stock}
            onChange={(e) => setForm((s) => ({ ...s, stock: e.target.value }))}
          />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Category">
          <input
            className="w-full rounded-lg border px-3 py-2"
            value={form.category}
            onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}
          />
        </Field>
        <Field label="Image URL">
          <input
            className="w-full rounded-lg border px-3 py-2"
            value={form.image_url}
            onChange={(e) => setForm((s) => ({ ...s, image_url: e.target.value }))}
          />
        </Field>
      </div>
      <Field label="In Stock">
        <input
          type="checkbox"
          checked={form.in_stock}
          onChange={(e) => setForm((s) => ({ ...s, in_stock: e.target.checked }))}
        />
      </Field>
      <div className="mt-6 flex justify-end gap-2">
        <button
          onClick={onSubmit}
          className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm text-white hover:opacity-90 disabled:opacity-50"
          disabled={isBusy}
        >
          {isBusy && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitLabel}
        </button>
      </div>
    </>
  )
}

function Field(props: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <div className="mb-1 text-gray-600">{props.label}</div>
      {props.children}
    </label>
  )
}

