'use client'

import { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  showStrength?: boolean
  strength?: { score: number; label: string; color: string }
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, showStrength, strength, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
      <div className="space-y-2">
        <Label htmlFor={props.id} className="text-sm font-medium">
          {label}
          {props.required && <span className="text-red ml-1">*</span>}
        </Label>
        <div className="relative">
          <Input
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            {...props}
            className={cn(
              'pr-10 border-gray-300 dark:border-gray-700 focus:border-gold focus:ring-gold',
              error && 'border-red focus:border-red focus:ring-red',
              className
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-500" />
            ) : (
              <Eye className="h-4 w-4 text-gray-500" />
            )}
            <span className="sr-only">
              {showPassword ? 'Hide password' : 'Show password'}
            </span>
          </Button>
        </div>
        {showStrength && strength && props.value && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">Password strength:</span>
              <span className={cn('font-medium', strength.color.replace('bg-', 'text-'))}>
                {strength.label}
              </span>
            </div>
            <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={cn('h-full transition-all duration-300', strength.color)}
                style={{ width: `${(strength.score / 6) * 100}%` }}
              />
            </div>
          </div>
        )}
        {error && (
          <p className="text-sm text-red font-medium" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)

PasswordInput.displayName = 'PasswordInput'
