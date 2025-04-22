import {
  Select as SelectUI,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

type SelectOption<T = any> = {
  label: string
  value: T
}

type TCustomSelectProps<T = any> = {
  title: string
  options: SelectOption<T>[]
  defaultOption?: string
  loading?: boolean
  disabled?: boolean
  onValueChange?: (value: T) => void
  className?: string
  value?: T
  placeholder?: string
  error?: string
}

export function Select<T = any>({
  title,
  options,
  loading,
  disabled,
  onValueChange,
  className,
  defaultOption,
  value,
  placeholder,
  error,
}: TCustomSelectProps<T>) {
  const [selectedValue, setSelectedValue] = useState<T | undefined>(() => {
    if (value !== undefined) return value
    if (defaultOption !== undefined) {
      const option = options.find((opt) => String(opt.value) === String(defaultOption))
      return option?.value
    }
    return undefined
  })

  const [selectedLabel, setSelectedLabel] = useState<string>(() => {
    if (value !== undefined) {
      const option = options.find((opt) => opt.value === value)
      return option?.label || title
    }
    if (defaultOption !== undefined) {
      const option = options.find((opt) => String(opt.value) === String(defaultOption))
      return option?.label || title
    }
    return title
  })

  useEffect(() => {
    if (value !== undefined) {
      const option = options.find((opt) => opt.value === value)
      if (option) {
        setSelectedValue(value)
        setSelectedLabel(option.label)
      }
    }
  }, [value, options])

  const handleValueChange = (newValue: string) => {
    const option = options.find((opt) => String(opt.value) === newValue)
    if (option) {
      setSelectedValue(option.value)
      setSelectedLabel(option.label)
      onValueChange?.(option.value)
    }
  }

  return (
    <div className="space-y-1">
      {loading ? (
        <Skeleton className={cn('h-10 w-full min-w-[300px] rounded-sm', className)} />
      ) : (
        <SelectUI
          disabled={loading || disabled}
          value={selectedValue ? String(selectedValue) : undefined}
          onValueChange={handleValueChange}
        >
          <SelectTrigger
            className={cn(
              'w-full',
              error && 'border-destructive focus-visible:ring-destructive',
              className,
            )}
          >
            <SelectValue placeholder={placeholder || selectedLabel} />
          </SelectTrigger>
          <SelectContent>
            {options.map(({ label, value }) => (
              <SelectItem key={String(value)} value={String(value)} className="cursor-pointer">
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectUI>
      )}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  )
}
