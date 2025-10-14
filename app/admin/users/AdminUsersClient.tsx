'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader as Loader2, Plus, Trash2, Pencil, RotateCcw } from 'lucide-react'

type Role = { id: string; name: string }
type AdminRow = {
  id: string
  email: string
  full_name: string | null
  role_id: string | null
  is_active: boolean | null
  created_at: string | null
  // Accept array (what your query is returning) OR single object OR null
  admin_roles?: { name: string }[] | { name: string } | null
}

type CreateForm = {
  email: string
  password?: string
  full_name: string
  role_id: string
}

type EditForm = {
  email: string
  full_name: string
  role_id: string
  is_active?: boolean
}

export default function AdminUsersClient() {
  const supabase = useMemo(() => createClient(), [])
  const [roles, setRoles] = useState<Role[]>([])
  const [admins, setAdmins] = useState<AdminRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isBusy, setIsBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Create dialog state
  const [showCreate, setShowCreate] = useState(false)
  const [createForm, setCreateForm] = useState<CreateForm>({
    email: '',
    password: '',
    full_name: '',
    role_id: '',
  })

  // Edit dialog state
  const [editing, setEditing] = useState<AdminRow | null>(null)
  const [editForm, setEditForm] = useState<EditForm>({ email: '', full_name: '', role_id: '' })

  const load = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [{ data: rolesData, error: rolesErr }, { data: adminsData, error: adminsErr }] =
        await Promise.all([
          supabase.from('admin_roles').select('id,name').order('name', { ascending: true }),
          supabase
            .from('admins')
            .select('id,email,full_name,role_id,is_active,created_at,admin_roles(name)')
            .order('created_at', { ascending: false }),
        ])

      if (rolesErr) throw rolesErr
      if (adminsErr) throw adminsErr

      setRoles(rolesData ?? [])
      setAdmins((adminsData ?? []) as AdminRow[])
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load admins/roles')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const roleNameFromId = (role_id: string | null | undefined) => {
    const r = roles.find((x) => x.id === role_id)
    return r?.name
  }

  // Safely read role name regardless of shape
  const displayRoleName = (row: AdminRow) => {
    const ar = row.admin_roles
    if (!ar) return roleNameFromId(row.role_id) ?? '—'
    if (Array.isArray(ar)) return ar[0]?.name ?? roleNameFromId(row.role_id) ?? '—'
    return ar.name ?? roleNameFromId(row.role_id) ?? '—'
  }

  // ---------- Create ----------
  const onCreate = async () => {
    setIsBusy(true)
    setError(null)
    try {
      if (!createForm.email || !createForm.full_name || !createForm.role_id) {
        throw new Error('Please fill name, email and role')
      }

      // Call our server route (uses service role & upsert)
      const res = await fetch('/api/admins/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: createForm.email.trim(),
          full_name: createForm.full_name.trim(),
          role_id: createForm.role_id, // must be UUID from admin_roles.id
          is_active: true,
        }),
      })
      const payload = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(payload?.error || 'Failed to create admin')

      // Close modal, reset form, then REFRESH the list so the new row appears
      setShowCreate(false)
      setCreateForm({ email: '', password: '', full_name: '', role_id: '' })
      await load()
    } catch (e: any) {
      setError(e?.message ?? 'Failed to create')
    } finally {
      setIsBusy(false)
    }
  }

  // ---------- Edit ----------
  const openEdit = (row: AdminRow) => {
    setEditing(row)
    setEditForm({
      email: row.email,
      full_name: row.full_name || '',
      role_id: row.role_id || '',
      is_active: !!row.is_active,
    })
  }

  const onUpdate = async () => {
    if (!editing) return
    setIsBusy(true)
    setError(null)
    try {
      const res = await fetch(`/api/admins/${editing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: editForm.email,
          full_name: editForm.full_name,
          role_id: editForm.role_id,
          is_active: editForm.is_active,
        }),
      })
      const payload = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(payload?.error || 'Failed to update admin')

      setEditing(null)
      await load()
    } catch (e: any) {
      setError(e?.message ?? 'Failed to update')
    } finally {
      setIsBusy(false)
    }
  }

  // ---------- Toggle ----------
  const onToggle = async (row: AdminRow) => {
    setIsBusy(true)
    setError(null)
    try {
      const res = await fetch(`/api/admins/${row.id}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !row.is_active }),
      })
      const payload = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(payload?.error || 'Failed to toggle admin')

      await load()
    } catch (e: any) {
      setError(e?.message ?? 'Failed to toggle')
    } finally {
      setIsBusy(false)
    }
  }

  // ---------- Delete ----------
  const onDelete = async (row: AdminRow) => {
    if (!confirm(`Delete admin ${row.email}? This also marks the Auth user.`)) return
    setIsBusy(true)
    setError(null)
    try {
      const res = await fetch(`/api/admins/${row.id}`, { method: 'DELETE' })
      const payload = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(payload?.error || 'Failed to delete admin')

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
        <h1 className="text-2xl font-semibold">Manage Admins</h1>
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
            New Admin
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
      ) : admins.length === 0 ? (
        <div className="rounded-lg border p-6 text-sm text-gray-600">No admins yet.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-600">Name</th>
                <th className="px-3 py-2 text-left font-medium text-gray-600">Email</th>
                <th className="px-3 py-2 text-left font-medium text-gray-600">Role</th>
                <th className="px-3 py-2 text-left font-medium text-gray-600">Active</th>
                <th className="px-3 py-2 text-right font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="px-3 py-2">{a.full_name || '—'}</td>
                  <td className="px-3 py-2">{a.email}</td>
                  <td className="px-3 py-2">{displayRoleName(a)}</td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => onToggle(a)}
                      className={`rounded-full px-2 py-1 text-xs ${
                        a.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}
                      disabled={isBusy}
                      title="Toggle active"
                    >
                      {a.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(a)}
                        className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 hover:bg-gray-50"
                        disabled={isBusy}
                      >
                        <Pencil className="h-4 w-4" /> Edit
                      </button>
                      <button
                        onClick={() => onDelete(a)}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Create Admin</h2>
              <button onClick={() => setShowCreate(false)} className="text-sm text-gray-500">
                Close
              </button>
            </div>
            <div className="space-y-4">
              <Field label="Full name">
                <input
                  className="w-full rounded-lg border px-3 py-2"
                  value={createForm.full_name}
                  onChange={(e) => setCreateForm((s) => ({ ...s, full_name: e.target.value }))}
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  className="w-full rounded-lg border px-3 py-2"
                  value={createForm.email}
                  onChange={(e) => setCreateForm((s) => ({ ...s, email: e.target.value }))}
                />
              </Field>
              <Field label="Password (optional)">
                <input
                  type="password"
                  className="w-full rounded-lg border px-3 py-2"
                  value={createForm.password ?? ''}
                  onChange={(e) => setCreateForm((s) => ({ ...s, password: e.target.value }))}
                />
              </Field>
              <Field label="Role">
                <select
                  className="w-full rounded-lg border px-3 py-2"
                  value={createForm.role_id}
                  onChange={(e) => setCreateForm((s) => ({ ...s, role_id: e.target.value }))}
                >
                  <option value="">Select role</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowCreate(false)}
                className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
                disabled={isBusy}
              >
                Cancel
              </button>
              <button
                onClick={onCreate}
                className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm text-white hover:opacity-90 disabled:opacity-50"
                disabled={isBusy}
              >
                {isBusy && <Loader2 className="h-4 w-4 animate-spin" />}
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Edit Admin</h2>
              <button onClick={() => setEditing(null)} className="text-sm text-gray-500">
                Close
              </button>
            </div>
            <div className="space-y-4">
              <Field label="Full name">
                <input
                  className="w-full rounded-lg border px-3 py-2"
                  value={editForm.full_name}
                  onChange={(e) => setEditForm((s) => ({ ...s, full_name: e.target.value }))}
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  className="w-full rounded-lg border px-3 py-2"
                  value={editForm.email}
                  onChange={(e) => setEditForm((s) => ({ ...s, email: e.target.value }))}
                />
              </Field>
              <Field label="Role">
                <select
                  className="w-full rounded-lg border px-3 py-2"
                  value={editForm.role_id}
                  onChange={(e) => setEditForm((s) => ({ ...s, role_id: e.target.value }))}
                >
                  <option value="">Select role</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Active">
                <input
                  type="checkbox"
                  checked={!!editForm.is_active}
                  onChange={(e) => setEditForm((s) => ({ ...s, is_active: e.target.checked }))}
                />
              </Field>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setEditing(null)}
                className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
                disabled={isBusy}
              >
                Cancel
              </button>
              <button
                onClick={onUpdate}
                className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm text-white hover:opacity-90 disabled:opacity-50"
                disabled={isBusy}
              >
                {isBusy && <Loader2 className="h-4 w-4 animate-spin" />}
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
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


