import { forwardRef } from 'react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface RadioOption {
  value: string
  label: string
  description?: string
}

interface RadioFieldProps {
  label: string
  error?: string
  options: RadioOption[]
  name: string
  value?: string
  onChange?: (value: string) => void
}

export const RadioField = forwardRef<HTMLDivElement, RadioFieldProps>(
  ({ label, error, options, name, value, onChange }, ref) => {
    return (
      <div className="space-y-3" ref={ref}>
        <Label className="text-sm font-medium">
          {label}
          <span className="text-red ml-1">*</span>
        </Label>
        <div className="space-y-3">
          {options.map((option) => (
            <div
              key={option.value}
              className={cn(
                'flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-all hover:border-gold',
                value === option.value
                  ? 'border-gold bg-gold/5 dark:bg-gold/10'
                  : 'border-gray-300 dark:border-gray-700'
              )}
              onClick={() => onChange?.(option.value)}
            >
              <input
                type="radio"
                id={`${name}-${option.value}`}
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange?.(e.target.value)}
                className="mt-1 h-4 w-4 text-gold border-gray-300 focus:ring-gold cursor-pointer"
              />
              <div className="flex-1">
                <Label
                  htmlFor={`${name}-${option.value}`}
                  className="font-medium cursor-pointer"
                >
                  {option.label}
                </Label>
                {option.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {option.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        {error && (
          <p className="text-sm text-red font-medium" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)

RadioField.displayName = 'RadioField'
