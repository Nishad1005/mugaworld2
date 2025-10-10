'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader as Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/auth/FormField'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { SelectField } from '@/components/auth/SelectField'
import { RadioField } from '@/components/auth/RadioField'
import { CheckboxField } from '@/components/auth/CheckboxField'
import { registerSchema, getPasswordStrength } from '@/lib/auth/validation'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import type { RegisterData } from '@/lib/auth/types'

const countries = [
  { value: 'IN', label: 'India' },
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
]

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      accountType: 'individual',
      acceptTerms: false,
    },
  })

  const password = watch('password')
  const accountType = watch('accountType')
  const acceptTerms = watch('acceptTerms')
  const passwordStrength = password ? getPasswordStrength(password) : null

  const onSubmit = async (data: RegisterData) => {
    setIsLoading(true)

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
          emailRedirectTo: undefined,
        },
      })

      if (authError) throw authError

      if (authData.user) {
        const { error: profileError } = await supabase.from('profiles').insert({
          id: authData.user.id,
          full_name: data.fullName,
          email: data.email,
          phone: data.phone,
          country: data.country,
          city: data.city || null,
          address: data.address || null,
          account_type: data.accountType,
        })

        if (profileError) throw profileError

        toast({
          title: 'Account created successfully!',
          description: 'Welcome to MUGA WORLD. You can now sign in.',
        })

        router.push('/login')
      }
    } catch (error: any) {
      toast({
        title: 'Registration failed',
        description: error.message || 'An error occurred during registration',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 mb-6">
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Your Account</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Join MUGA WORLD and explore authentic handmade products
          </p>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-800">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              label="Full Name"
              id="fullName"
              type="text"
              placeholder="John Doe"
              required
              {...register('fullName')}
              error={errors.fullName?.message}
            />

            <FormField
              label="Email Address"
              id="email"
              type="email"
              placeholder="john@example.com"
              required
              {...register('email')}
              error={errors.email?.message}
            />

            <FormField
              label="Phone Number"
              id="phone"
              type="tel"
              placeholder="+1234567890"
              required
              {...register('phone')}
              error={errors.phone?.message}
            />

            <PasswordInput
              label="Password"
              id="password"
              placeholder="Create a strong password"
              required
              {...register('password')}
              error={errors.password?.message}
              showStrength
              strength={passwordStrength || undefined}
            />

            <PasswordInput
              label="Confirm Password"
              id="confirmPassword"
              placeholder="Re-enter your password"
              required
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />

            <SelectField
              label="Country"
              id="country"
              required
              options={countries}
              {...register('country')}
              error={errors.country?.message}
            />

            <FormField
              label="City"
              id="city"
              type="text"
              placeholder="Your city"
              {...register('city')}
              error={errors.city?.message}
            />

            <FormField
              label="Address"
              id="address"
              placeholder="Your full address"
              isTextarea
              {...register('address')}
              error={errors.address?.message}
            />

            <RadioField
              label="Account Type"
              name="accountType"
              value={accountType}
              onChange={(value) => setValue('accountType', value as 'business' | 'individual')}
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
              error={errors.accountType?.message}
            />

            <CheckboxField
              id="acceptTerms"
              checked={acceptTerms}
              onCheckedChange={(checked) => setValue('acceptTerms', checked)}
              label={
                <span>
                  I accept the{' '}
                  <Link href="/terms" className="text-gold hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-gold hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              }
              error={errors.acceptTerms?.message}
            />

            <Button
              type="submit"
              className="w-full bg-gold hover:bg-gold/90 text-gray-900 font-bold h-11"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">Already have an account? </span>
            <Link href="/login" className="text-gold hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
