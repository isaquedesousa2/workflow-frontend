import { Label } from '@/components/ui/label'
import {
  ICheckboxGroupField,
  FormOption,
} from '@/modules/process-builder/features/form/types'
import { Checkbox } from '@/components/ui/checkbox'
import { useState } from 'react'
import { BaseInput } from '@/modules/process-builder/features/form/components/inputs/BaseInput'

interface BaseInputProps {
  field: ICheckboxGroupField
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
    <BaseInput component={field} className="space-y-2">
      <div className="space-y-2">
        {field.options?.map((option: FormOption) => (
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
    </BaseInput>
  )
}
