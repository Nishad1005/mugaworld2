'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Plus, Edit, Trash2, Settings } from 'lucide-react'
import { toast } from 'sonner'

type Service = {
  id: string
  title: string
  description: string | null
  price: number | null
  duration: string | null // keep string for UI flexibility (e.g., "30 minutes")
  image_url: string | null
  is_active: boolean | null
  category: string | null
  created_at: string | null
  updated_at?: string | null
}

const categories = [
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'repair', label: 'Repair' },
  { value: 'custom', label: 'Custom Design' },
  { value: 'appraisal', label: 'Appraisal' },
  { value: 'general', label: 'General' },
]

export default function AdminServicesClient() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    image_url: '',
    is_active: true,
    category: 'general',
  })

  useEffect(() => {
    loadServices()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadServices = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('services')
        .select('id,title,description,price,duration,category,image_url,is_active,created_at,updated_at')
        .order('created_at', { ascending: false })

      if (error) throw error
      setServices((data ?? []) as Service[])
    } catch (error) {
      console.error('Error loading services:', error)
      toast.error('Failed to load services')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!formData.title.trim()) throw new Error('Title is required')

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        price: formData.price ? Number(formData.price) : null,
        // send duration as string; server can coerce or store text per schema
        duration: formData.duration.trim() || null,
        image_url: formData.image_url.trim() || null,
        is_active: !!formData.is_active,
        category: formData.category || null,
      }

      if (editingService) {
        const res = await fetch(`/api/services/${editingService.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const out = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(out?.error || 'Failed to update service')
        toast.success('Service updated successfully')
      } else {
        const res = await fetch('/api/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const out = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(out?.error || 'Failed to create service')
        toast.success('Service created successfully')
      }

      setDialogOpen(false)
      resetForm()
      loadServices()
    } catch (error: any) {
      console.error('Error saving service:', error)
      toast.error(error?.message || 'Failed to save service')
    }
  }

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Delete this service?')) return
    try {
      const res = await fetch(`/api/services/${serviceId}`, { method: 'DELETE' })
      const out = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(out?.error || 'Failed to delete service')
      toast.success('Service deleted successfully')
      loadServices()
    } catch (error: any) {
      console.error('Error deleting service:', error)
      toast.error(error?.message || 'Failed to delete service')
    }
  }

  const handleToggleActive = async (service: Service) => {
    try {
      const res = await fetch(`/api/services/${service.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !service.is_active }),
      })
      const out = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(out?.error || 'Failed to update service status')
      toast.success(`Service ${service.is_active ? 'deactivated' : 'activated'} successfully`)
      loadServices()
    } catch (error: any) {
      console.error('Error toggling service status:', error)
      toast.error(error?.message || 'Failed to update service status')
    }
  }

  const openEditDialog = (service: Service) => {
    setEditingService(service)
    setFormData({
      title: service.title ?? '',
      description: service.description ?? '',
      price: service.price != null ? String(service.price) : '',
      duration: service.duration ?? '',
      image_url: service.image_url ?? '',
      is_active: !!service.is_active,
      category: service.category ?? 'general',
    })
    setDialogOpen(true)
  }

  const resetForm = () => {
    setEditingService(null)
    setFormData({
      title: '',
      description: '',
      price: '',
      duration: '',
      image_url: '',
      is_active: true,
      category: 'general',
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-950">
      <div className="border-b bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => router.push('/admin/dashboard')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Settings className="h-6 w-6 text-amber-600" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Manage Services</h1>
            </div>
            <Dialog
              open={dialogOpen}
              onOpenChange={(open) => {
                setDialogOpen(open)
                if (!open) resetForm()
              }}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingService ? 'Edit Service' : 'Create New Service'}</DialogTitle>
                  <DialogDescription>
                    {editingService ? 'Update service details' : 'Add a new service to your offerings'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        placeholder="e.g., 30 minutes"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input
                      id="image_url"
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://images.pexels.com/..."
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label htmlFor="is_active">Active (visible to customers)</Label>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1">
                      {editingService ? 'Update' : 'Create'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setDialogOpen(false)
                        resetForm()
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-600 dark:text-gray-400">Loading services...</p>
            </CardContent>
          </Card>
        ) : services.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-600 dark:text-gray-400">
                No services found. Create your first service.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {services.map((service) => (
              <Card key={service.id}>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    {service.image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={service.image_url}
                        alt={service.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg">{service.title}</CardTitle>
                        <Badge variant={service.is_active ? 'default' : 'secondary'}>
                          {service.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        {service.category && <Badge variant="outline">{service.category}</Badge>}
                      </div>
                      {service.description && <CardDescription>{service.description}</CardDescription>}
                      <div className="flex gap-4 mt-3 text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium text-amber-600 dark:text-amber-500">
                          {service.price != null ? `₹ ${service.price.toFixed(2)}` : '—'}
                        </span>
                        {service.duration && <span>{service.duration}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleToggleActive(service)}>
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => openEditDialog(service)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDelete(service.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
