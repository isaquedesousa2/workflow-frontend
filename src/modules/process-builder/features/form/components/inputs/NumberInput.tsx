import { Input } from '@/components/ui/input'
import { NumberField } from '@/modules/process-builder/features/form/types'

interface BaseInputProps {
  field: NumberField
}

export function NumberInput({ field }: BaseInputProps) {
  const { placeholder, description, required, id, defaultValue, min, max, step } = field

  return (
    <div id={id} className="space-y-2">
      <Input
        type="number"
        id={id}
        placeholder={placeholder}
        defaultValue={defaultValue}
        min={min}
        max={max}
        step={step || 1}
        className="w-full"
      />
      {field.description && (
        <p className="text-xs text-muted-foreground mt-1">{field.description}</p>
      )}
    </div>
  )
}
