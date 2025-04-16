import { Label } from '@/components/ui/label'
import { FormComponent, FormOption } from '@/modules/form-builder2/types'
import { Checkbox } from '@/components/ui/checkbox'
import { useState } from 'react'

interface BaseInputProps {
  field: FormComponent
}

export function CheckboxGroupInput({ field }: BaseInputProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])

  const handleCheckboxChange = (option: FormOption) => {
    setSelectedOptions((prev) => {
      if (prev.includes(option.value)) {
        return prev.filter((item) => item !== option.value)
      }

      if (field.multiple) {
        return [...prev, option.value]
      }

      return [option.value]
    })
  }

  return (
    <div className="space-y-2">
      {field.label && <Label className="text-sm font-medium">{field.label}</Label>}
      <div className="space-y-2">
        {field.options?.map((option) => (
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
      {field.description && (
        <p className="text-xs text-muted-foreground mt-1">{field.description}</p>
      )}
    </div>
  )
}
