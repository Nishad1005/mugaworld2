import { forwardRef } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface CheckboxFieldProps {
  id: string
  label: React.ReactNode
  error?: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export const CheckboxField = forwardRef<HTMLButtonElement, CheckboxFieldProps>(
  ({ id, label, error, checked, onCheckedChange }, ref) => {
    return (
      <div className="space-y-2">
        <div className="flex items-start space-x-2">
          <Checkbox
            id={id}
            ref={ref}
            checked={checked}
            onCheckedChange={onCheckedChange}
            className={cn(
              'border-gray-300 dark:border-gray-700 data-[state=checked]:bg-gold data-[state=checked]:border-gold',
              error && 'border-red'
            )}
          />
          <Label
            htmlFor={id}
            className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            {label}
          </Label>
        </div>
        {error && (
          <p className="text-sm text-red font-medium ml-6" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)

CheckboxField.displayName = 'CheckboxField'
