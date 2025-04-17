import { Label } from '@/components/ui/label'
import { FormComponent } from '@/modules/form-builder2/types'
import { Input } from '@/components/ui/input'

interface BaseInputProps {
  field: FormComponent
}

export function NumberInput({ field }: BaseInputProps) {
  return (
    <div className="space-y-2">
      {field.label && <Label className="text-sm font-medium">{field.label}</Label>}
      <Input
        type="number"
        id={field.id}
        placeholder={field.placeholder}
        defaultValue={field.defaultValue}
        min={field.validation?.min}
        max={field.validation?.max}
        step={field.validation?.step || 1}
        className="w-full"
      />
      {field.description && (
        <p className="text-xs text-muted-foreground mt-1">{field.description}</p>
      )}
    </div>
  )
}
