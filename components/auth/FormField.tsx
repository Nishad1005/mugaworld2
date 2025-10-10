import { forwardRef } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  isTextarea?: boolean
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, isTextarea, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <Label htmlFor={props.id} className="text-sm font-medium">
          {label}
          {props.required && <span className="text-red ml-1">*</span>}
        </Label>
        {isTextarea ? (
          <Textarea
            {...(props as any)}
            className={cn(
              'border-gray-300 dark:border-gray-700 focus:border-gold focus:ring-gold',
              error && 'border-red focus:border-red focus:ring-red',
              className
            )}
          />
        ) : (
          <Input
            ref={ref}
            {...props}
            className={cn(
              'border-gray-300 dark:border-gray-700 focus:border-gold focus:ring-gold',
              error && 'border-red focus:border-red focus:ring-red',
              className
            )}
          />
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

FormField.displayName = 'FormField'
