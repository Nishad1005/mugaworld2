'use client'

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
import type {
  ResetPasswordData,
  UpdatePasswordData,
} from '@/lib/auth/types'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [isUpdateMode, setIsUpdateMode] = useState(false)
  const supabase = createClient()

  // ✅ detect Supabase redirect type and token correctly
  useEffect(() => {
    const type = searchParams.get('type')
    const token =
      searchParams.get('access_token') ||
      searchParams.get('token') ||
      searchParams.get('recovery_token')

    if (type === 'recovery' && token) {
      // Supabase automatically sets the session from URL token
      setIsUpdateMode(true)
    }
  }, [searchParams])

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: errorsEmail },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    watch: watchPassword,
    formState: { errors: errorsPassword },
  } = useForm<UpdatePasswordData>({
    resolver: zodResolver(updatePasswordSchema),
  })

  const newPassword = watchPassword('password')
  const passwordStrength = newPassword
    ? getPasswordStrength(newPassword)
    : null

  // ✅ step 1: send reset link
  const onSubmitEmail = async (data: ResetPasswordData) => {
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        data.email,
        {
          redirectTo: `${window.location.origin}/reset-password?type=recovery`,
        }
      )

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

  // ✅ step 2: update password (after recovery link)
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
        description: error.message || 'An error occurred',
        variant: 'destructi

