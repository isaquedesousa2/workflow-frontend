import { Input } from '@/components/ui/input'
import { BaseInput } from '@/modules/process-builder/features/form/components/inputs/BaseInput'
import { NumberField } from '@/modules/process-builder/features/form/types'

interface BaseInputProps {
  field: NumberField
}

export function NumberInput({ field }: BaseInputProps) {
  return (
    <BaseInput component={field} className="space-y-2">
      <Input
        type="number"
        id={field.id}
        placeholder={field.placeholder}
        defaultValue={field.defaultValue}
        min={field.min}
        max={field.max}
        step={field.step}
      />
      {field.description && (
        <p className="text-xs text-muted-foreground mt-1">{field.description}</p>
      )}
    </BaseInput>
  )
}
