import { forwardRef } from 'react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  options: { value: string; label: string }[]
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, options, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <Label htmlFor={props.id} className="text-sm font-medium">
          {label}
          {props.required && <span className="text-red ml-1">*</span>}
        </Label>
        <select
          ref={ref}
          {...props}
          className={cn(
            'flex h-9 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red focus:border-red focus:ring-red',
            className
          )}
        >
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-sm text-red font-medium" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)

SelectField.displayName = 'SelectField'
