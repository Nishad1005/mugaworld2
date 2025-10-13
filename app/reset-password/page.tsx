'use client'

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader as Loader2, CircleCheck as CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/auth/FormField'
import { PasswordInput } from '@/components/auth/PasswordInput'
import {
  resetPasswordSchema,
  updatePasswordSchema,
  getPasswordStrength,
} from '@/lib/auth/validation'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import type { ResetPasswordData, UpdatePasswordData } from '@/lib/auth/types'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [isUpdateMode, setIsUpdateMode] = useState(false)
  const supabase = createClient()

  // ✅ Detect recovery token in both query and hash
  useEffect(() => {
    const qType = searchParams.get('type')
    const qAccess = searchParams.get('access_token') || searchParams.get('token')
    const qRefresh = searchParams.get('refresh_token') || ''

    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    const hashParams = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : '')
    const hType = hashParams.get('type')
    const hAccess = hashParams.get('access_token') || hashParams.get('token')
    const hRefresh = hashParams.get('refresh_token') || ''

    const type = qType || hType
    const accessToken = qAccess || hAccess
    const refreshToken = qRefresh || hRefresh

    async function handleRecovery() {
      if (type === 'recovery' && accessToken) {
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })

        // Clean URL
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href)
          url.hash = ''
          url.searchParams.set('type', 'recovery')
          window.history.replaceState({}, '', url.toString())
        }

        setIsUpdateMode(true)
      }
    }

    handleRecovery()
  }, [searchParams, supabase])

  // ✅ Fallback in case Supabase triggers event after redirect
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setIsUpdateMode(true)
      }
    })
    return () => {
      sub.subscription.unsubscribe()
    }
  }, [supabase])

  // --- Forms ---
  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: errorsEmail },
  } = useForm<ResetPasswordData>({ resolver: zodResolver(resetPasswordSchema) })

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    watch: watchPassword,
    formState: { errors: errorsPassword },
  } = useForm<UpdatePasswordData>({ resolver: zodResolver(updatePasswordSchema) })

  const newPassword = watchPassword('password')
  const passwordStrength = newPassword ? getPasswordStrength(newPassword) : null

  const onSubmitEmail = async (data: ResetPasswordData) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password?type=recovery`,
      })
      if (error) throw error
      setEmailSent(true)
      toast({
        title: 'Reset link sent!',
        description: 'Check your email for the password reset link.',
      })
    } catch (error: any) {
      toast({
        title: 'Failed to send reset link',
        description: error.message || 'An error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmitPassword = async (data: UpdatePasswordData) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      })
      if (error) throw error
      toast({
        title: 'Password updated!',
        description: 'Your password has been successfully updated.',
      })
      router.push('/login')
    } catch (error: any) {
      toast({
        title: 'Failed to update password',
        description: error?.message || 'An error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // --- Render ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isUpdateMode ? 'Set New Password' : 'Reset Password'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {isUpdateMode
              ? 'Enter your new password below'
              : 'Enter your email to receive a reset link'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-800">
          {!isUpdateMode && !emailSent && (
            <form onSubmit={handleSubmitEmail(onSubmitEmail)} className="space-y-6">
              <FormField
                label="Email Address"
                id="email"
                type="email"
                placeholder="john@example.com"
                required
                autoComplete="email"
                {...registerEmail('email')}
                error={errorsEmail.email?.message}
              />
              <Button
                type="submit"
                className="w-full bg-gold hover:bg-gold/90 text-gray-900 font-bold h-11"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Link...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </form>
          )}

          {!isUpdateMode && emailSent && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-500" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Check Your Email
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  We’ve sent a password reset link to your email. Click the link to reset your password.
                </p>
              </div>
              <Button onClick={() => setEmailSent(false)} variant="outline" className="w-full">
                Didn’t receive the email? Try again
              </Button>
            </div>
          )}

          {isUpdateMode && (
            <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-6">
              <PasswordInput
                label="New Password"
                id="password"
                placeholder="Create a strong password"
                required
                {...registerPassword('password')}
                error={errorsPassword.password?.message}
                showStrength
                strength={passwordStrength || undefined}
              />
              <PasswordInput
                label="Confirm New Password"
                id="confirmPassword"
                placeholder="Re-enter your password"
                required
                {...registerPassword('confirmPassword')}
                error={errorsPassword.confirmPassword?.message}
              />
              <Button
                type="submit"
                className="w-full bg-gold hover:bg-gold/90 text-gray-900 font-bold h-11"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating Password...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center text-sm">
            <Link href="/login" className="text-gold hover:underline font-medium">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

