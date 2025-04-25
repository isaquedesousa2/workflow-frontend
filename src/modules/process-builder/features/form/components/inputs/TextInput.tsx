import { TextField } from '@/modules/process-builder/features/form/types'
import { Input } from '@/components/ui/input'

interface BaseInputProps {
  field: TextField
}

export function TextInput({ field }: BaseInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <Input
        id={field.id}
        placeholder={field.placeholder}
        defaultValue={field.defaultValue}
        maxLength={field.maxLength}
        minLength={field.minLength}
        readOnly={field.readOnly}
        disabled={field.readOnly}
      />
      {field.description && <p className="text-sm text-muted-foreground">{field.description}</p>}
      {field.required && <span className="text-red-500">*</span>}
    </div>
  )
}
