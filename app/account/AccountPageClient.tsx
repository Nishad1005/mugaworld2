'use client'

import { useState, useEffect } from 'react' // ⬅️ add useEffect
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader as Loader2, LogOut, Shield, User as UserIcon, Mail, Phone, MapPin, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FormField } from '@/components/auth/FormField'
import { SelectField } from '@/components/auth/SelectField'
import { RadioField } from '@/components/auth/RadioField'
import { updateProfileSchema } from '@/lib/auth/validation'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import type { Profile, UpdateProfileData } from '@/lib/auth/types'
import type { User } from '@supabase/supabase-js'

const countries = [
  { value: 'IN', label: 'India' },
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
]

interface AccountPageClientProps {
  profile: Profile
  user: User
}

export default function AccountPageClient({ profile, user }: AccountPageClientProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const supabase = createClient()

  // ✅ Ensure a profile row exists for this user (created server-side if missing)
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/profile/ensure', { method: 'POST', cache: 'no-store' })
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          if (!cancelled) console.warn('ensure profile failed', body)
        } else {
          const body = await res.json().catch(() => ({}))
          if (body?.created && !cancelled) {
            // Refresh server components (e.g., header user menu) without navigation
            try { router.refresh() } catch {}
          }
        }
      } catch (e) {
        if (!cancelled) console.warn('ensure profile exception', e)
      }
    })()
    return () => { cancelled = true }
  }, [router])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      full_name: profile.full_name,
      phone: profile.phone || '',
      country: profile.country || '',
      city: profile.city || '',
      address: profile.address || '',
      account_type: profile.account_type,
    },
  })

  const accountType = watch('account_type')

  const onSubmit = async (data: UpdateProfileData) => {
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: data.full_name,
          phone: data.phone || null,
          country: data.country || null,
          city: data.city || null,
          address: data.address || null,
          account_type: data.account_type,
        })
        .eq('id', user.id)

      if (error) throw error

      toast({
        title: 'Profile updated!',
        description: 'Your profile has been successfully updated.',
      })

      setIsEditing(false)
      router.refresh()
    } catch (error: any) {
      toast({
        title: 'Failed to update profile',
        description: error.message || 'An error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Account</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your profile and preferences
            </p>
          </div>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>

        <div className="grid gap-6">
          <Card className="dark:bg-gray-950 dark:border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{profile.full_name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Mail className="w-4 h-4" />
                      {profile.email}
                    </CardDescription>
                  </div>
                </div>
                <Badge
                  variant={profile.account_type === 'business' ? 'default' : 'secondary'}
                  className="capitalize"
                >
                  <Building2 className="w-3 h-3 mr-1" />
                  {profile.account_type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {!isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.phone && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700 dark:text-gray-300">{profile.phone}</span>
                      </div>
                    )}
                    {profile.country && (
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {profile.city ? `${profile.city}, ` : ''}
                          {countries.find((c) => c.value === profile.country)?.label || profile.country}
                        </span>
                      </div>
                    )}
                  </div>
                  {profile.address && (
                    <div className="pt-2 border-t dark:border-gray-800">
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">
                        Address:
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{profile.address}</p>
                    </div>
                  )}
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="bg-gold hover:bg-gold/90 text-gray-900"
                    >
                      Edit Profile
                    </Button>
                    <Button onClick={handleSignOut} variant="outline">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    label="Full Name"
                    id="full_name"
                    type="text"
                    required
                    {...register('full_name')}
                    error={errors.full_name?.message}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      label="Phone Number"
                      id="phone"
                      type="tel"
                      placeholder="+1234567890"
                      {...register('phone')}
                      error={errors.phone?.message}
                    />

                    <SelectField
                      label="Country"
                      id="country"
                      options={countries}
                      {...register('country')}
                      error={errors.country?.message}
                    />
                  </div>

                  <FormField
                    label="City"
                    id="city"
                    type="text"
                    {...register('city')}
                    error={errors.city?.message}
                  />

                  <FormField
                    label="Address"
                    id="address"
                    isTextarea
                    {...register('address')}
                    error={errors.address?.message}
                  />

                  <RadioField
                    label="Account Type"
                    name="account_type"
                    value={accountType}
                    onChange={(value) => setValue('account_type', value as 'business' | 'individual')}
                    options={[
                      {
                        value: 'individual',
                        label: 'Individual',
                        description: 'For personal shopping and services',
                      },
                      {
                        value: 'business',
                        label: 'Business',
                        description: 'For business accounts and bulk orders',
                      },
                    ]}
                    error={errors.account_type?.message}
                  />

                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      className="bg-gold hover:bg-gold/90 text-gray-900"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-950 dark:border-gray-800">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-gold" />
                <CardTitle>Security</CardTitle>
              </div>
              <CardDescription>Manage your account security settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border dark:border-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Password</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Last changed {new Date(profile.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Link href="/reset-password">
                    <Button variant="outline" size="sm">
                      Change Password
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center justify-between p-4 border dark:border-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Two-Factor Authentication
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Add an extra layer of security
                    </p>
                  </div>
                  <Button variant="outline" size="sm" disabled className="opacity-50">
                    Coming Soon
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

