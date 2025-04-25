import { Label } from '@/components/ui/label'
import {
  CheckboxGroupField,
  FormComponent,
  FormOption,
} from '@/modules/process-builder/features/form/types'
import { Checkbox } from '@/components/ui/checkbox'
import { useState } from 'react'

interface BaseInputProps {
  field: CheckboxGroupField
}

export function CheckboxGroupInput({ field }: BaseInputProps) {
  const { options, multiple, id, description, required } = field
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])

  const handleCheckboxChange = (option: FormOption) => {
    setSelectedOptions((prev) => {
      if (prev.includes(option.value)) {
        return prev.filter((item) => item !== option.value)
      }

      if (multiple) {
        return [...prev, option.value]
      }

      return [option.value]
    })
  }

  return (
    <div id={id} className="space-y-2">
      <div className="space-y-2">
        {options?.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <Checkbox
              id={`${field.id}-${option.value}`}
              checked={selectedOptions.includes(option.value)}
              onCheckedChange={() => handleCheckboxChange(option)}
            />
            <Label
              htmlFor={`${field.id}-${option.value}`}
              className="text-sm font-normal cursor-pointer"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </div>
      {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      {required && <span className="text-red-500">*</span>}
    </div>
  )
}
