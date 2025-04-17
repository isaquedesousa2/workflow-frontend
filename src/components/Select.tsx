import {
  Select as SelectUI,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useState } from 'react'

type TCustomSelectProps = {
  title: string
  options: {
    label: string
    value: any
  }[]
  defaultOption?: string
  loading?: boolean
  disabled?: boolean
  onClick?: (date: string) => void
} & React.HTMLAttributes<HTMLDivElement>

export function Select({
  title,
  options,
  loading,
  disabled,
  onClick,
  className,
  defaultOption,
}: TCustomSelectProps) {
  const [_, setSelectedValue] = useState<any>(defaultOption || title)
  const [selectedLabel, setSelectedLabel] = useState<string>(defaultOption || title)

  return (
    <>
      {loading ? (
        <Skeleton className={cn('h-10 w-full min-w-[300px] rounded-sm', className)} />
      ) : (
        <SelectUI
          disabled={loading || disabled}
          onValueChange={(value) => {
            const selectedOption = options.find((option) => option.value === value)

            if (selectedOption && selectedOption.label !== selectedLabel) {
              setSelectedValue(selectedOption.value)
              setSelectedLabel(selectedOption.label)

              if (onClick) {
                onClick(selectedOption.value)
              }
            }
          }}
        >
          <SelectTrigger className={className}>
            <SelectValue placeholder={selectedLabel} />
          </SelectTrigger>
          <SelectContent>
            {options.map(({ label, value }) => (
              <SelectItem key={value} value={value} className="cursor-pointer">
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectUI>
      )}
    </>
  )
}
